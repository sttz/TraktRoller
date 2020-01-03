import TraktApi, { ITraktScrobbleData, TraktApiError, ITraktSearchResult, ITraktShow, ITraktSeason, ITraktEpisode } from "./TraktApi";

export class TraktLookupError extends Error {
  public associatedObject: any;

  constructor(message: string, object?: any) {
    super(message);
    this.associatedObject = object;
  }
}

/** Token allowing to cancel the async lookup operation */
export class CancellationToken {
  private _isCancelled: boolean = false;

  public cancel(): void {
    this._isCancelled = true;
  }

  public get isCancelled(): boolean {
    return this._isCancelled;
  }

  public static throwIfCancelled(token?: CancellationToken) {
    if (token && token.isCancelled) {
      throw new CancellationError();
    }
  }
}

/** Error thrown by async lookup method if it has been cancelled */
export class CancellationError extends Error {
  constructor() {
    super("The operation has been cancelled.");
  }
}

/** Look up a show on trakt */
export default class TraktLookup {
  private _client: TraktApi;

  constructor(client: TraktApi) {
    this._client = client;
  }

  /** Start the lookup */
  public async start(scrobbleData: ITraktScrobbleData, cancellation?: CancellationToken): Promise<ITraktScrobbleData | null> {
    let data = Object.assign({}, scrobbleData);

    if (data.movie === undefined && (data.show === undefined || data.episode === undefined)) {
      throw new TraktLookupError('TraktRoller: either movie or show/episode needs to be set on scrobble data');
    }

    console.log('TraktRoller: looking up media on trakt...', Object.assign({}, data));

    let type: 'movie' | 'show' = data.movie !== undefined ? 'movie' : 'show';
    let result : ITraktScrobbleData | null = null;
  
    // Special episodes with fractional episode numbers, e.g. 14.5
    // (Often used for recap episodes)
    let isSpecialEp = data.episode && data.episode.number && (data.episode.number % 1) !== 0;

    if (!isSpecialEp) {
      // Start with trakt's automatic matching
      console.log('TraktRoller: trying automatic matching...');
      result = await this._scrobbleLookup(data);
      CancellationToken.throwIfCancelled(cancellation);
      if (result != null) return result;

      // Retry automatic matching with absolute episode number
      if (type === 'show' && data.episode && data.episode.number_abs === undefined && data.episode.number !== undefined) {
        let dataAbs = Object.assign({}, data);
        dataAbs.episode = Object.assign({}, dataAbs.episode, { number_abs: data.episode.number });
        delete dataAbs.episode.number;
        
        result = await this._scrobbleLookup(dataAbs);
        CancellationToken.throwIfCancelled(cancellation);
        if (result != null) return result;
      }
    }

    // Search for item manually
    let title = data.movie !== undefined ? data.movie.title : data.show!.title;
    if (!title) {
      throw new TraktLookupError('TraktRoller: No title set');
    }

    console.log('TraktRoller: trying to search manually...');
    const results = await this._search(type, title);
    CancellationToken.throwIfCancelled(cancellation);
    if (results.length === 0) {
      console.warn(`TraktRoller: manual search for "${title}" returned no results`);
      return null;
    }

    // Try search results in order
    for (const found of results) {
      if (type === 'movie') {
        console.log(`TraktRoller: trying result ${found.movie!.title}`, found);
        data.movie = found.movie;
      } else {
        console.log(`TraktRoller: trying result ${found.show!.title}`, found);
        data.show = found.show;
      }

      // Look up episode for shows
      if (type === 'show') {
        let episodeResult = await this._lookupEpisode(data.episode!, found.show!);
        CancellationToken.throwIfCancelled(cancellation);
        if (episodeResult == null) continue;
        data.episode = episodeResult;
      }

      // Retry start with new data
      console.log('TraktRoller: re-trying matching');
      result = await this._scrobbleLookup(data);
      CancellationToken.throwIfCancelled(cancellation);
      if (result == null) break;
    }

    return result;
  }

  private async _scrobbleLookup(data: ITraktScrobbleData): Promise<ITraktScrobbleData | null> {
    let scrobbleResponse = await this._client.scrobble('pause', data);
    if (TraktApi.isError(scrobbleResponse, 404)) {
      return null;
    } else if (TraktApi.isError(scrobbleResponse)) {
      throw new TraktApiError(scrobbleResponse);
    }

    let result = Object.assign({}, data);

    if (scrobbleResponse.movie !== undefined)   result.movie = scrobbleResponse.movie;
    if (scrobbleResponse.show !== undefined)    result.show = scrobbleResponse.show;
    if (scrobbleResponse.episode !== undefined) result.episode = scrobbleResponse.episode;

    console.log('TraktRoller: scrobble lookup succeeded', scrobbleResponse);
    return result;
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

  private async _lookupEpisode(episode: ITraktEpisode, show: ITraktShow): Promise<ITraktEpisode | null> {
    if (episode.number === undefined || episode.season === undefined) {
      throw new TraktLookupError('TraktRoller: data has show but episode is not set or incomplete', episode);
    }
    if (show.ids === undefined || show.ids.trakt === undefined) {
      throw new TraktLookupError('TraktRoller: show data is missing trakt id', show);
    }

    let episodeResult: ITraktEpisode | null = null;

    const seasonsResponse = await this._client.seasons(show.ids.trakt, ['episodes', 'full']);
    if (TraktApi.isError(seasonsResponse, 404)) {
      console.error('TraktRoller: manual lookup could not find seasons');
      return null;
    } else if (TraktApi.isError(seasonsResponse)) {
      throw new TraktApiError(seasonsResponse);
    }

    // First search in matching season
    const season = seasonsResponse.find(s => s.number === episode.season);
    if (!season) {
      console.warn(`TraktRoller: could not find season ${episode.season} in seasons response`, seasonsResponse);
    } else {
      episodeResult = this._matchEpisodeOrTitle(season, episode.number, episode.title);
    }

    // Look through all other seasons
    if (episodeResult == null) {
      for (let s of seasonsResponse) {
        if (s === season) continue;
        episodeResult = this._matchEpisodeOrTitle(s, episode.number, episode.title);
        if (episodeResult != null) break;
      }
    }

    return episodeResult;
  }

  private _matchEpisodeOrTitle(season: ITraktSeason, episode: number, title?: string): ITraktEpisode | null {
    if (!season.episodes) {
      throw new TraktLookupError(`TraktRoller: Missing episodes array in season object`, season);
    }

    let numberMatch = season.episodes.filter(e => e.number === episode || e.number_abs === episode);
    if (numberMatch.length > 1) {
      console.error(`TraktRoller: got multiple episode #${episode} in season`, season);
      return null;
    } else if (numberMatch.length == 1) {
      console.log(`TraktRoller: found episode using episode number`, numberMatch[0]);
      return numberMatch[0];
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
        return titleMatch[0];
      }
    }

    return null;
  }

  private _filterEpisodeTitle(title: string): string {
    if (!title) debugger;
    return title.replace(/[^\w\s]/gi, '').toLowerCase();
  }
}
