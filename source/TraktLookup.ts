import TraktApi, { ITraktScrobbleData, ITraktError, TraktApiError, ITraktSearchResult, ITraktShow, ITraktSeason } from "./TraktApi";

export enum TraktLookupState {
  Initialized,
  Started,
  NotFound,
  Completed,
  Aborted,
  Error
};

export class TraktLookupError extends Error {
  public associatedObject: any;

  constructor(message: string, object?: any) {
    super(message);
    this.associatedObject = object;
  }
}

/** Look up a show on trakt */
export default class TraktLookup {
  private _client: TraktApi;
  private _state = TraktLookupState.Initialized;
  private _data: ITraktScrobbleData;

  constructor(client: TraktApi, data: ITraktScrobbleData) {
    this._client = client;
    this._data = JSON.parse(JSON.stringify(data));
  }

  /** The current state of this lookup */
  public get status(): TraktLookupState {
    return this._state;
  }

  /** Start the lookup */
  public async start(): Promise<ITraktScrobbleData | null> {
    if (this._state != TraktLookupState.Initialized) {
      throw new TraktLookupError(`TraktRoller: Lookup already used (${this._state})`);
    }

    if (this._data.movie === undefined && (this._data.show === undefined || this._data.episode === undefined)) {
      throw new TraktLookupError('TraktRoller: either movie or show/episode needs to be set on scrobble data');
    }

    console.log('TraktRoller: looking up media on trakt...', Object.assign({}, this._data));

    let type: 'movie' | 'show' = this._data.movie !== undefined ? 'movie' : 'show';
    let result : ITraktScrobbleData | null = null;
  
    // Special episodes with fractional episode numbers, e.g. 14.5
    // (Often used for recap episodes)
    let isSpecialEp = this._data.episode && this._data.episode.number && (this._data.episode.number % 1) !== 0;

    if (!isSpecialEp) {
      // Start with trakt's automatic matching
      console.log('TraktRoller: trying automatic matching...');
      result = await this._scrobbleLookup();
      if (result != null) return result;

      // Retry automatic matching with absolute episode number
      if (type === 'show' && this._data.episode && this._data.episode.number_abs === undefined && this._data.episode.number !== undefined) {
        let data = JSON.parse(JSON.stringify(this._data)) as ITraktScrobbleData;
        data.episode!.number_abs = data.episode!.number;
        delete data.episode!.number;
        
        result = await this._scrobbleLookup(data);
        if (result != null) return result;
      }
    }

    // Search for item manually
    let title = this._data.movie !== undefined ? this._data.movie.title : this._data.show!.title;
    if (!title) {
      throw new TraktLookupError('TraktRoller: No title set');
    }

    console.log('TraktRoller: trying to search manually...');
    const results = await this._search(type, title);
    if (results.length === 0) {
      console.warn(`TraktRoller: manual search for "${title}" returned no results`);
      return null;
    }

    // Try search results in order
    for (const found of results) {
      if (type === 'movie') {
        console.log(`TraktRoller: trying result ${found.movie!.title}`, found);
        this._data.movie = found.movie;
      } else {
        console.log(`TraktRoller: trying result ${found.show!.title}`, found);
        this._data.show = found.show;
      }

      // Look up episode for shows
      if (type === 'show') {
        result = await this._lookupEpisode(found.show!);
        if (result == null) continue;
      }

      // Retry start with new data
      console.log('TraktRoller: re-trying matching');
      result = await this._scrobbleLookup();
      if (result == null) break;
    }

    return result;
  }

  /** Abort the lookup */
  public abort(): void {
    this._state = TraktLookupState.Aborted;
  }

  private async _scrobbleLookup(data?: ITraktScrobbleData): Promise<ITraktScrobbleData | null> {
    let scrobbleResponse = await this._client.scrobble('pause', data || this._data);
    if (TraktApi.isError(scrobbleResponse, 404)) {
      return null;
    } else if (TraktApi.isError(scrobbleResponse)) {
      throw new TraktApiError(scrobbleResponse);
    }

    if (scrobbleResponse.movie !== undefined)   this._data.movie = scrobbleResponse.movie;
    if (scrobbleResponse.show !== undefined)    this._data.show = scrobbleResponse.show;
    if (scrobbleResponse.episode !== undefined) this._data.episode = scrobbleResponse.episode;

    console.log('TraktRoller: scrobble lookup succeeded', scrobbleResponse);
    return this._data;
  }

  private async _search(type: 'movie' | 'show', title: string): Promise<Array<ITraktSearchResult>> {
    // Quote and escape title to avoid special search characters interfereing with the query
    // See https://github.com/trakt/api-help/issues/76
    title = `"${title.replace(/[\\"']/g, '\\$&')}"`;

    const searchResponse = await this._client.search(type, title);
    if (TraktApi.isError(searchResponse)) {
      throw new TraktApiError(searchResponse);
    }

    const goodMatches = searchResponse.filter(r => r.score > 10);
    if (searchResponse.length > goodMatches.length) {
      if (goodMatches.length === 0) {
        console.log(`TraktRoller: search returned only garbage results.`);
      } else {
        console.log(`TraktRoller: some search results with low scores ignored`);
      }
    }
    return goodMatches;
  }

  private async _lookupEpisode(show: ITraktShow): Promise<ITraktScrobbleData | null> {
    if (this._data.episode === undefined || this._data.episode.number === undefined || this._data.episode.season === undefined) {
      throw new TraktLookupError('TraktRoller: data has show but episode is not set or incomplete', this._data.episode);
    }
    if (show.ids === undefined || show.ids.trakt === undefined) {
      throw new TraktLookupError('TraktRoller: show data is missing trakt id', this._data.show);
    }

    let episodeResult: ITraktScrobbleData | null = null;

    const seasonsResponse = await this._client.seasons(show.ids.trakt, ['episodes', 'full']);
    if (TraktApi.isError(seasonsResponse, 404)) {
      console.error('TraktRoller: manual lookup could not find seasons');
      return null;
    } else if (TraktApi.isError(seasonsResponse)) {
      throw new TraktApiError(seasonsResponse);
    }

    // First search in matching season
    const season = seasonsResponse.find(s => s.number === this._data.episode!.season);
    if (!season) {
      console.warn(`TraktRoller: could not find season ${this._data.episode.season} in seasons response`, seasonsResponse);
    } else {
      episodeResult = this._matchEpisodeOrTitle(season, this._data.episode.number, this._data.episode.title);
    }

    // Look through all other seasons
    if (episodeResult == null) {
      for (let s of seasonsResponse) {
        if (s === season) continue;
        episodeResult = this._matchEpisodeOrTitle(s, this._data.episode.number, this._data.episode.title);
        if (episodeResult != null) break;
      }
    }

    return episodeResult;
  }

  private _matchEpisodeOrTitle(season: ITraktSeason, episode: number, title?: string): ITraktScrobbleData | null {
    if (!season.episodes) {
      throw new TraktLookupError(`TraktRoller: Missing episodes array in season object`, season);
    }

    let numberMatch = season.episodes.filter(e => e.number === episode || e.number_abs === episode);
    if (numberMatch.length > 1) {
      console.error(`TraktRoller: got multiple episode #${episode} in season`, season);
      return null;
    } else if (numberMatch.length == 1) {
      console.log(`TraktRoller: found episode using episode number`, numberMatch[0]);
      this._data.episode = numberMatch[0];
      return this._data;
    }

    if (title) {
      const filteredTitle = this._filterEpisodeTitle(title);
      let titleMatch = season.episodes
        .filter(e => e.title && this._filterEpisodeTitle(e.title) === filteredTitle);
      if (titleMatch.length > 1) {
        console.error(`TraktRoller: got multiple episodes titled "${title}" in show`, season);
        return null;
      } else if (titleMatch.length == 1) {
        console.log(`TraktRoller: found episode using episode title`, titleMatch[0]);
        this._data.episode = titleMatch[0];
        return this._data;
      }
    }

    return null;
  }

  private _filterEpisodeTitle(title: string): string {
    if (!title) debugger;
    return title.replace(/[^\w\s]/gi, '').toLowerCase();
  }
}
