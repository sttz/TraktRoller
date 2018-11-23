import { SimpleEventDispatcher } from "strongly-typed-events";

const TraktTokensKey: string = 'trakt_tokens';

export interface ITraktIDs {
  trakt?: number;
  slug?: string;
  imdb?: string;
  tmdb?: number;
  tvdb?: number;
}

export interface ITraktMovie {
  title?: string;
  year?: number;
  ids?: ITraktIDs;
}

export interface ITraktShow {
  title?: string;
  year?: number;
  ids?: ITraktIDs;
}

export interface ITraktSeason {
  number?: number;
  ids?: ITraktIDs;
  episodes?: Array<ITraktEpisode>;
}

export interface ITraktEpisode {
  season?: number;
  number?: number;
  title?: string;
  number_abs?: number;
  ids?: ITraktIDs;
}

export interface ITraktHistoryItem {
  id?: number;
  watched_at: string;
  action: string;
  type: 'movie' | 'episode';
  movie?: ITraktMovie;
  show?: ITraktShow;
  episode?: ITraktEpisode;
}

export interface ITraktSearchResult {
  type: 'movie' | 'show' | 'episode' | 'person' | 'list';
  score: number;
  movie?: ITraktMovie;
  show?: ITraktShow;
  episode?: ITraktEpisode;
}

export interface ITraktScrobbleData {
  movie?: ITraktMovie;
  show?: ITraktShow;
  episode?: ITraktEpisode;
  progress: number;
  app_version: string;
  app_date: string;
}

export interface ITraktScobbleResult {
  id: number;
  action: 'start' | 'pause' | 'scrobble';
  movie?: ITraktMovie;
  show?: ITraktShow;
  episode?: ITraktEpisode;
}

export interface ITraktHistoryRemoveResult {
  deleted: {
    movies: number;
    episodes: number;
  };
  not_found: {
    movies: ITraktMovie[];
    shows: ITraktShow[];
    seasons: ITraktSeason[];
    episodes: ITraktEpisode[];
    ids: number[];
  };
}

export interface ITraktError {
  status: number;
  error: string;
}

const TraktErrorCodes: { [key: number]: ITraktError } = {
  200: { "status": 200, "error": "Success" },
  201: { "status": 201, "error": "Success - new resource created (POST)" },
  204: { "status": 204, "error": "Success - no content to return (DELETE)" },
  400: { "status": 400, "error": "Bad Request - request couldn't be parsed" },
  401: { "status": 401, "error": "Unauthorized - OAuth must be provided" },
  403: { "status": 403, "error": "Forbidden - invalid API key or unapproved app" },
  404: { "status": 404, "error": "Not Found - method exists, but no record found" },
  405: { "status": 405, "error": "Method Not Found - method doesn't exist" },
  409: { "status": 409, "error": "Conflict - resource already created" },
  412: { "status": 412, "error": "Precondition Failed - use application/json content type" },
  422: { "status": 422, "error": "Unprocessible Entity - validation errors" },
  429: { "status": 429, "error": "Rate Limit Exceeded" },
  500: { "status": 500, "error": "Server Error - please open a support issue" },
  503: { "status": 503, "error": "Service Unavailable - server overloaded (try again in 30s)" },
  504: { "status": 504, "error": "Service Unavailable - server overloaded (try again in 30s)" },
  520: { "status": 520, "error": "Service Unavailable - Cloudflare error" },
  521: { "status": 521, "error": "Service Unavailable - Cloudflare error" },
  522: { "status": 522, "error": "Service Unavailable - Cloudflare error" }
};

interface ITraktTokens {
  refresh_token?: string;
  access_token?: string;
  expires?: number;
  authentication_state?: string;
}

export interface ITraktApiOptions {
  client_id: string;
  client_secret: string;
  api_url?: string;
  storage?: IStorage;
}

export interface IStorage {
  getValue(name: string): Promise<string>;
  setValue(name: string, value: string): Promise<void>;
}

export class LocalStorageAdapter implements IStorage {
  getValue(name: string): Promise<string> {
    return Promise.resolve(window.localStorage.getItem(name));
  }
  
  setValue(name: string, value: string): Promise<void> {
    if (!value) {
      window.localStorage.removeItem(name);
    } else {
      window.localStorage.setItem(name, value);
    }
    return Promise.resolve();
  }
}

export class GreaseMonkeyStorageAdapter implements IStorage {
  getValue(name: string): Promise<string> {
    return Promise.resolve(GM_getValue(name));
  }
  
  setValue(name: string, value: string): Promise<void> {
    if (!value) {
      GM_deleteValue(name);
    } else {
      GM_setValue(name, value);
    }
    return Promise.resolve();
  }
}

export default class TraktApi {
  public onAuthenticationChanged = new SimpleEventDispatcher<boolean>();

  private _tokens: ITraktTokens = {};

  private _client_id: string;
  private _client_secret: string;
  private _redirect_uri: string;
  private _endpoint: string;

  private _storage: IStorage;

  constructor(options: ITraktApiOptions) {
    this._client_id = options.client_id;
    this._client_secret = options.client_secret;
    this._redirect_uri = 'https://www.crunchyroll.com';
    this._endpoint = options.api_url || 'https://api.trakt.tv';
    this._storage = options.storage || new LocalStorageAdapter();
  }

  static isError(obj: any, code?: number): obj is ITraktError {
    const err = obj as ITraktError;
    return err.status !== undefined && err.error !== undefined
      && (code === undefined || err.status === code);
  }

  // ------ Authentication ------

  public async loadTokens(): Promise<void> {
    const data = await this._storage.getValue(TraktTokensKey);
    if (data) {
      this._tokens = JSON.parse(data);
    } else {
      this._tokens = {};
    }

    if (this._tokens.expires && this._tokens.expires < Date.now()) {
      this._tokens = await this._refresh_token();
      await this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens));
    }

    this.onAuthenticationChanged.dispatch(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return this._tokens.access_token !== undefined;
  }

  async authenticate(): Promise<void> {
    const state = this._generate_state();
    const url = this._get_url(state);

    // Save authentication state data
    this._tokens.authentication_state = state;
    await this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens));

    window.location.href = url;
  }

  async checkAuthenticationResult(url: string): Promise<void> {
    const params = new URL(url).searchParams;
    const code = params.get('code');
    const state = params.get('state');
    if (!code || !state) return;

    if (!await this._exchange_code(code, state)) {
      console.error('Exchanging oauth code failed!');
      return;
    }

    console.log('Trakt authentication successful!');

    await this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens));

    window.history.replaceState(null, undefined, window.location.pathname);

    this.onAuthenticationChanged.dispatch(true);
  }

  disconnect(): void {
    this._storage.setValue(TraktTokensKey, null);
    this.onAuthenticationChanged.dispatch(false);
    this._revoke_token();
  }

  // ------ API ------

  private _getError(response: Response): ITraktError {
    var error = TraktErrorCodes[response.status];
    if (error) return error;

    return {
      status: response.status,
      error: `Unknown error (${response.statusText})`
    };
  }

  private async _request(method: 'GET' | 'POST' | 'DELETE', url: string, body?: any): Promise<any> {
    let contentType = null;
    if (body) {
      if (body.contentType) {
        contentType = body.contentType;
        body = body.body;
      }

      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }
    }

    let headers = new Headers();
    headers.append('trakt-api-version', '2');
    headers.append('trakt-api-key', this._client_id);
    headers.append('Content-Type', contentType || 'application/json');

    if (this._tokens && this._tokens.access_token) {
      headers.append('Authorization', `Bearer ${this._tokens.access_token}`);
    }

    try {
      let response = await fetch(this._endpoint + url, {
        method: method,
        mode: "cors",
        headers: headers,
        body: body
      });

      if (!response.ok) {
        return this._getError(response);
      }

      if (response.status === 204) {
        return null; // 204: No Content
      }

      return response.json();
    } catch (err) {
      return {
        status: 0,
        error: `An error occurred sending the request: ${err}`
      };
    }
  }

  private async _exchange(body: object): Promise<ITraktTokens> {
    try {
      const data = await this._request('POST', '/oauth/token', body);
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires: (data.created_at + data.expires_in) * 1000
      };
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  private _generate_state(): string {
    let data = new Uint32Array(4);
    crypto.getRandomValues(data);
    let state = '';
    for (let i = 0; i < data.length; i++) {
      state += data[i].toString(16);
    }
    return state;
  }

  private _get_url(state: string): string {
     // Replace 'api' from the api_url to get the top level trakt domain
     const base_url = this._endpoint.replace(/api\W/, '');
     return `${base_url}/oauth/authorize?response_type=code&client_id=${this._client_id}&redirect_uri=${this._redirect_uri}&state=${state}`;
  }

  private async _exchange_code(code: string, state: string): Promise<boolean> {
    if (state !== this._tokens.authentication_state) {
      console.error('Invalid CSRF (State)');
      return false;
    }

    this._tokens = await this._exchange({
      code: code,
      client_id: this._client_id,
      client_secret: this._client_secret,
      redirect_uri: this._redirect_uri,
      grant_type: 'authorization_code'
    });
    return this.isAuthenticated();
  }

  private async _refresh_token(): Promise<ITraktTokens> {
    if (!this._tokens.refresh_token)
      return {};

    return await this._exchange({
      refresh_token: this._tokens.refresh_token,
      client_id: this._client_id,
      client_secret: this._client_secret,
      redirect_uri: this._redirect_uri,
      grant_type: 'refresh_token'
    });
  }

  private async _revoke_token(): Promise<{} | ITraktError> {
    if (!this._tokens.access_token) return;

    return this._request('POST', '/oauth/revoke', { 
      token: this._tokens.access_token,
      client_id: this._client_id,
      client_secret: this._client_secret
    });
  }

  async search(type: string, query: string): Promise<Array<ITraktSearchResult> | ITraktError> {
    return this._request('GET', `/search/${type}?query=${encodeURIComponent(query)}`);
  }

  async seasons(showId: number | string, episodes?: boolean): Promise<Array<ITraktSeason> | ITraktError> {
    return this._request('GET', `/shows/${showId}/seasons?extended=${episodes ? 'episodes' : ''}`);
  }

  async season(showId: number | string, season: number, extended?: boolean): Promise<Array<ITraktEpisode> | ITraktError> {
    return this._request('GET', `/shows/${showId}/seasons/${season}?extended=${extended ? 'full' : ''}`);
  }

  async scrobble(type: 'start' | 'pause' | 'stop', data: ITraktScrobbleData): Promise<ITraktScobbleResult | ITraktError> {
    if (!this._tokens.access_token) {
      throw new Error('Access token required.');
    }
    return this._request('POST', `/scrobble/${type}`, data);
  }

  async history(type?: 'movies' | 'shows' | 'seasons' | 'episodes', id?: number): Promise<ITraktHistoryItem[] | ITraktError> {
    if (!this._tokens.access_token) {
      throw new Error('Access token required.');
    }

    let url = '/sync/history';
    if (type) url += '/' + type;
    if (type && id) url += '/' + id;
    return this._request('GET', url);
  }

  async historyRemove(id: number): Promise<ITraktHistoryRemoveResult | ITraktError> {
    if (!this._tokens.access_token) {
      throw new Error('Access token required.');
    }

    return this._request('POST', `/sync/history/remove`, { ids: [ id ] });
  }
}