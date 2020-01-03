import TraktApi, { ITraktScrobbleData, ITraktScobbleResult } from './TraktApi';
import { SimpleEventDispatcher } from 'ste-simple-events';
import TraktLookup from './TraktLookup';

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

  private _state: TraktScrobbleState = TraktScrobbleState.Undefined;
  private _pendingState: TraktScrobbleState = TraktScrobbleState.Undefined;
  private _playbackState: PlaybackState = PlaybackState.Paused;
  private _error: string | undefined;
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

  public get error(): string | undefined {
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

  private async _init(): Promise<void> {
    this.setState(TraktScrobbleState.Lookup);

    let lookup = new TraktLookup(this._client);

    try {
      let result = await lookup.start(this._data);
      if (result == null) {
        this.setState(TraktScrobbleState.NotFound);
        return;
      } else {
        this._data = result;
      }
    } catch (error) {
      if (error.associatedObject) {
        console.error(error.message, error.associatedObject);
      } else {
        console.error(error.message);
      }
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
    if (TraktApi.isError(scrobbleResponse)) {
      console.error(`trakt scrobbler: ${scrobbleResponse.error}`);
      this._error = scrobbleResponse.error;
      this.setState(TraktScrobbleState.Error);
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
}
