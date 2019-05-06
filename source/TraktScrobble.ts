import TraktApi, { ITraktScrobbleData, ITraktError, ITraktShow, ITraktSearchResult, ITraktScobbleResult, ITraktSeason } from './TraktApi';
import { SimpleEventDispatcher } from 'ste-simple-events';

export enum PlaybackState {
  Paused,
  Playing,
  Ended
}

export enum TraktScrobbleState {
  Undefined,
  Lookup,
  Found,
  Started,
  Paused,
  Scrobbled,
  NotFound,
  Error
}

enum LookupResult {
  NotFound,
  Found,
  Error
}

export default class TraktScrobble {
  /** Extract item type from scrobble data */
  public static typeFromData(data: ITraktScrobbleData): 'movie' | 'episode' | null {
    if (!data) return null;
    if (data.movie) return 'movie';
    if (data.show && data.episode) return 'episode';
    return null;
  }

  /** Extract trakt id from scrobble data, returns 0 if id is not set */
  public static traktIdFromData(data: ITraktScrobbleData): number {
    if (!data) return 0;
    let movieId = data.movie && data.movie.ids && data.movie.ids.trakt || null;
    if (movieId) return movieId;
    let episodeId = data.episode && data.episode.ids && data.episode.ids.trakt || null;
    if (episodeId) return episodeId;
    return 0;
  }

  /** Scrobble once this percentage has been reached */
  public scrobbleAbovePecentage: number = 80;
  /** Minimum time of the video that has to have been played before scrobbling (percent of duration) */
  public scrobbleMimimumPlaybackPercentage: number = 0.1;

  public onStateChanged = new SimpleEventDispatcher<TraktScrobbleState>();
  public onScrobbled = new SimpleEventDispatcher<ITraktScobbleResult>();

  private _client: TraktApi;
  private _data: ITraktScrobbleData;

  private _state: TraktScrobbleState;
  private _pendingState: TraktScrobbleState;
  private _playbackState: PlaybackState;
  private _error: string;
  private _enabled: boolean = false;

  private _lastPlaybackTime: number = 0;
  private _playbackTime: number = 0;

  constructor(client: TraktApi, data: ITraktScrobbleData) {
    this._client = client;
    this._data = data;

    this._init();
  }

  public get api(): TraktApi {
    return this._client;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    if (this._enabled === value) return;

    this._enabled = value;

    if (this._enabled) {
      this._applyState(PlaybackState.Paused);
    } else {
      this._applyState(this._playbackState);
    }
  }

  public setPlaybackTime(time: number, duration: number) {
    let delta = time - this._lastPlaybackTime;
    if (delta < 0.5) {
      this._playbackTime += delta;
    }

    let progress = time / duration * 100;
    let minimumTime = duration * this.scrobbleMimimumPlaybackPercentage;
    if (this._state === TraktScrobbleState.Started 
        && progress > this.scrobbleAbovePecentage
        && this._playbackTime > minimumTime) {
      this.setPlaybackState(PlaybackState.Ended, progress);
    }

    this._lastPlaybackTime = time;
  }

  public setPlaybackState(state: PlaybackState, progress: number): void {
    this._playbackState = state;
    this._data.progress = progress;

    if (!this.enabled) {
      this._applyState(state);
    }
  }

  public scrobbleNow() {
    this._playbackState = PlaybackState.Ended;
    this._data.progress = 100;
    this._applyState(this._playbackState);
  }

  private _applyState(state: PlaybackState) {
    if (state === PlaybackState.Playing) {
      if (this._pendingState === TraktScrobbleState.Found 
          || this._pendingState === TraktScrobbleState.Paused) {
        this._updateScrobble('start');
      }
    } else if (state === PlaybackState.Paused) {
      if (this._pendingState === TraktScrobbleState.Started) {
        this._updateScrobble('pause');
      }
    } else if (state === PlaybackState.Ended) {
      if (this._pendingState === TraktScrobbleState.Found 
          || this._pendingState === TraktScrobbleState.Started 
          || this._pendingState === TraktScrobbleState.Paused) {
        this._updateScrobble('stop');
      }
    }
  }

  public get error(): string {
    return this._error;
  }

  public scrobbleUrl(): string {
    let url = 'https://trakt.tv/';
    if (this._data.movie !== undefined) {
      return url + `movies/${this._data.movie.ids!.slug}`;
    } else if (this._data.show !== undefined && this._data.episode !== undefined) {
      const show = this._data.show;
      const episode = this._data.episode;
      return url + `shows/${show.ids!.slug}/seasons/${episode.season}/episodes/${episode.number}`;
    }
    return '';
  }

  public get state(): TraktScrobbleState {
    return this._state;
  }

  private setState(value: TraktScrobbleState): void {
    if (this._state == value) return;
    this._state = value;
    this._pendingState = value;
    this.onStateChanged.dispatch(value);
  }

  public get data(): ITraktScrobbleData {
    return this._data;
  }

  private _handleError(response: any): response is ITraktError {
    if (!TraktApi.isError(response)) return false;
  
    console.error(`trakt scrobbler: ${response.error}`);
    this._error = response.error;
    this.setState(TraktScrobbleState.Error);
    return true;
  }

  private async _init(): Promise<void> {
    this.setState(TraktScrobbleState.Lookup);

    let result = await this._lookup();
    if (result === LookupResult.NotFound) {
      this.setState(TraktScrobbleState.NotFound);
      return;
    } else if (result === LookupResult.Error) {
      this.setState(TraktScrobbleState.Error);
      return;
    }

    this.setState(TraktScrobbleState.Found);

    if (this._playbackState === PlaybackState.Playing) {
      this._updateScrobble('start');
    } else if (this._playbackState === PlaybackState.Ended) {
      this._updateScrobble('stop');
    }
  }

  private async _updateScrobble(type: 'start' | 'pause' | 'stop'): Promise<boolean> {
    switch (type) {
      case 'start':
        this._pendingState = TraktScrobbleState.Started;
        break;
      case 'pause':
        this._pendingState = TraktScrobbleState.Paused;
        break;
      case 'stop':
        this._pendingState = TraktScrobbleState.Scrobbled;
        break;
    }

    let scrobbleResponse = await this._client.scrobble(type, this._data);
    if (this._handleError(scrobbleResponse)) {
      return false;
    }

    switch (this._state) {
      case TraktScrobbleState.Found:
      case TraktScrobbleState.Started:
      case TraktScrobbleState.Paused:
        switch (scrobbleResponse.action) {
          case 'start':
            this.setState(TraktScrobbleState.Started);
            break;
          case 'pause':
            this.setState(TraktScrobbleState.Paused);
            break;
          case 'scrobble':
            this.setState(TraktScrobbleState.Scrobbled);
            this.onScrobbled.dispatch(scrobbleResponse);
            break;
        }
        break;
    }

    return true;
  }

  private async _lookup(): Promise<LookupResult> {
    if (this._data.movie === undefined && (this._data.show === undefined || this._data.episode === undefined)) {
      console.error('trakt scrobbler: either movie or show/episode needs to be set on scrobble data');
      return LookupResult.Error;
    }

    console.log('trakt scrobbler: looking up media on trakt...', Object.assign({}, this._data));

    let type: 'movie' | 'show' = this._data.movie !== undefined ? 'movie' : 'show';
    let result: LookupResult;
  
    // Special episodes with fractional episode numbers, e.g. 14.5
    // (Often used for recap episodes)
    let isSpecialEp = this._data.episode && (this._data.episode.number % 1) !== 0;

    if (!isSpecialEp) {
      // Start with trakt's automatic matching
      console.log('trakt scrobbler: trying automatic matching...');
      result = await this._scrobbleLookup();
      if (result !== LookupResult.NotFound) return result;

      // Retry automatic matching with absolute episode number
      if (type === 'show' && this._data.episode.number_abs === undefined && this._data.episode.number !== undefined) {
        let data = JSON.parse(JSON.stringify(this._data)) as ITraktScrobbleData;
        data.episode.number_abs = data.episode.number;
        delete data.episode.number;
        
        result = await this._scrobbleLookup(data);
        if (result !== LookupResult.NotFound) return result;
      }
    }

    // Search for item manually
    let title = this._data.movie !== undefined ? this._data.movie.title : this._data.show!.title;
    if (!title) {
      console.error('trakt scrobbler: No title set');
      return LookupResult.Error;
    }
    console.log('trakt scrobbler: trying to search manually...');
    const results = await this._search(type, title);
    if (results === null) return LookupResult.Error;
    if (results.length === 0) {
      console.warn(`trakt scrobbler: manual search for "${title}" returned no results`);
      return LookupResult.NotFound;
    }

    // Try search results in order
    for (const found of results) {
      if (type === 'movie') {
        console.log(`trakt scrobbler: trying result ${found.movie!.title}`, found);
        this._data.movie = found.movie;
      } else {
        console.log(`trakt scrobbler: trying result ${found.show!.title}`, found);
        this._data.show = found.show;
      }

      // Look up episode for shows
      if (type === 'show') {
        result = await this._lookupEpisode(found.show!);
        if (result === LookupResult.Error) return result;
        if (result === LookupResult.NotFound) continue;
      }

      // Retry start with new data
      console.log('trakt scrobbler: re-trying matching');
      result = await this._scrobbleLookup();
      if (result === LookupResult.Error) return result;
      if (result === LookupResult.Found) break;
    }

    return result;
  }

  private async _scrobbleLookup(data?: ITraktScrobbleData): Promise<LookupResult> {
    let scrobbleResponse = await this._client.scrobble('pause', data || this._data);
    if (TraktApi.isError(scrobbleResponse, 404)) {
      return LookupResult.NotFound;
    } else if (this._handleError(scrobbleResponse)) {
      return LookupResult.Error;
    }

    if (scrobbleResponse.movie !== undefined)   this._data.movie = scrobbleResponse.movie;
    if (scrobbleResponse.show !== undefined)    this._data.show = scrobbleResponse.show;
    if (scrobbleResponse.episode !== undefined) this._data.episode = scrobbleResponse.episode;

    console.log('trakt scrobbler: scrobble lookup succeeded', scrobbleResponse);
    return LookupResult.Found;
  }

  private async _search(type: 'movie' | 'show', title: string): Promise<Array<ITraktSearchResult> | null> {
    const searchResponse = await this._client.search(type, title);
    if (this._handleError(searchResponse)) {
      return null;
    }

    const goodMatches = searchResponse.filter(r => r.score > 10);
    if (searchResponse.length > goodMatches.length) {
      if (goodMatches.length === 0) {
        console.log(`trakt scrobbler: search returned only garbage results.`);
      } else {
        console.log(`trakt scrobbler: some search results with low scores ignored`);
      }
    }
    return goodMatches;
  }

  private async _lookupEpisode(show: ITraktShow): Promise<LookupResult> {
    if (this._data.episode === undefined || this._data.episode.number === undefined || this._data.episode.season === undefined) {
      console.error('trakt scrobbler: data has show but episode is not set or incomplete', this._data.episode);
      return LookupResult.Error;
    }
    if (show.ids === undefined || show.ids.trakt === undefined) {
      console.error('trakt scrobbler: show data is missing trakt id', this._data.show);
      return LookupResult.Error;
    }

    let episodeResult = LookupResult.NotFound;

    const seasonsResponse = await this._client.seasons(show.ids.trakt, ['episodes', 'full']);
    if (TraktApi.isError(seasonsResponse, 404)) {
      console.error('trakt scrobbler: manual lookup could not find seasons');
      return LookupResult.NotFound;
    } else if (this._handleError(seasonsResponse)) {
      return LookupResult.Error;
    }

    // First search in matching season
    const season = seasonsResponse.find(s => s.number === this._data.episode.season);
    if (!season) {
      console.warn(`trakt scrobbler: could not find season ${this._data.episode.season} in seasons response`, seasonsResponse);
    } else {
      episodeResult = this._matchEpisodeOrTitle(season, this._data.episode.number, this._data.episode.title);
    }

    // Look through all other seasons
    if (episodeResult === LookupResult.NotFound) {
      for (let s of seasonsResponse) {
        if (s === season) continue;
        episodeResult = this._matchEpisodeOrTitle(s, this._data.episode.number, this._data.episode.title);
        if (episodeResult == LookupResult.Found) break;
      }
    }

    return episodeResult;
  }

  private _matchEpisodeOrTitle(season: ITraktSeason, episode: number, title: string): LookupResult {
    let numberMatch = season.episodes.filter(e => e.number === episode || e.number_abs === episode);
    if (numberMatch.length > 1) {
      console.error(`trakt scrobbler: got multiple episode #${episode} in season`, season);
      return LookupResult.NotFound;
    } else if (numberMatch.length == 1) {
      console.log(`trakt scrobbler: found episode using episode number`, numberMatch[0]);
      this._data.episode = numberMatch[0];
      return LookupResult.Found;
    }

    if (title) {
      const filteredTitle = this._filterEpisodeTitle(title);
      let titleMatch = season.episodes
        .filter(e => e.title && this._filterEpisodeTitle(e.title) === filteredTitle);
      if (titleMatch.length > 1) {
        console.error(`trakt scrobbler: got multiple episodes titled "${title}" in show`, season);
        return LookupResult.NotFound;
      } else if (titleMatch.length == 1) {
        console.log(`trakt scrobbler: found episode using episode title`, titleMatch[0]);
        this._data.episode = titleMatch[0];
        return LookupResult.Found;
      }
    }

    return LookupResult.NotFound;
  }

  private _filterEpisodeTitle(title: string): string {
    if (!title) debugger;
    return title.replace(/[^\w\s]/gi, '').toLowerCase();
  }
}