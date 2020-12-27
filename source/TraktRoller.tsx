import TraktApi, { ITraktScrobbleData, ITraktApiOptions, ITraktScobbleResult, IStorage, LocalStorageAdapter, ITraktIDs, ITraktScrobbleItem } from "./TraktApi";
import TraktScrobble, { TraktScrobbleState, PlaybackState } from "./TraktScrobble";
import ConnectButton from "./ui/ConnectButton";
import StatusButton from "./ui/StatusButton";
import TraktHistory from "./TraktHistory";
import TraktLookup from "./TraktLookup";

import { createContext } from 'react';
import { render } from "react-dom";
import { jsx, CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { SimpleEventDispatcher } from "ste-simple-events";
import * as playerjs from "player.js";

export const RollerContext = createContext<TraktRoller | undefined>(undefined);

export interface ITraktRollerOptions extends ITraktApiOptions {
  website?: ITraktRollerWebsite;
}

export interface IWebsiteData {
  id: string | null;
  series_id: string | null;
  season_id: string | null;
  scrobble: ITraktScrobbleItem;
}

export interface ITraktRollerWebsite {
  loadPlayer(): Promise<playerjs.Player>;
  loadData(): IWebsiteData | null;
  getConnectButtonParent(): HTMLElement | null;
  getStatusButtonParent(): HTMLElement | null;
}

export enum TraktRollerState {
  Undefined = 'undefined',
  Lookup = 'lookup',
  NotFound = 'notfound',
  Scrobbling = 'scrobbling',
  Error = 'error',
};

export type TraktRollerCombinedState = TraktRollerState | TraktScrobbleState;

const TraktUrlRegex = /^https:\/\/trakt\.tv\/(movies|shows)\/([\w-]+)(?:\/seasons\/(\d+)\/episodes\/(\d+))?$/;

const ScrobblingEnabledKey: string = 'TraktRoller.enabled';

export default class TraktRoller {
  public onStateChanged = new SimpleEventDispatcher<TraktRollerCombinedState>();
  public onEnabledChanged = new SimpleEventDispatcher<boolean>();

  private _state: TraktRollerState;
  private _error: string | undefined;

  private _website: ITraktRollerWebsite;
  private _player?: playerjs.Player;
  private _storage: IStorage;
  private _api: TraktApi;
  private _looker: TraktLookup;
  private _scrobble: TraktScrobble;
  private _history: TraktHistory;
  private _enabled: boolean = false;

  private _data: IWebsiteData | null = null;
  private _duration: number = 0;
  private _currentTime: number = 0;

  constructor(options: ITraktRollerOptions) {
    if (!options.website) throw new Error("'website' option cannot be undefined");

    console.log("TraktRoller");

    this._state = TraktRollerState.Undefined;

    this._website = options.website;

    this._storage = options.storage || new LocalStorageAdapter();
    this._loadPrefs();

    this._api = new TraktApi(options);
    this._api.onAuthenticationChanged.sub(this._onAuthenticationChange.bind(this));
    this._api.loadTokens();

    this._history = new TraktHistory(this._api);

    this._looker = new TraktLookup(this._api);

    this._scrobble = new TraktScrobble(this._api);
    this._scrobble.enabled = this.enabled;
    this._scrobble.onStateChanged.sub(this._onScrobbleStatusChanged.bind(this));
    this._scrobble.onScrobbled.sub(this._onScrobbled.bind(this));

    this._createFooterButton();
    this._waitForPlayer();
  }

  public get scrobble(): TraktScrobble {
    return this._scrobble;
  }

  public get history(): TraktHistory {
    return this._history;
  }

  public get state(): TraktRollerCombinedState {
    if (this._state != TraktRollerState.Scrobbling) {
      return this._state;
    } else {
      return this._scrobble.state;
    }
  }

  private _setState(value: TraktRollerState) {
    if (this._state == value) return;
    this._state = value;
    this.onStateChanged.dispatch(this.state);
  }

  public get error(): string | undefined {
    if (this._state != TraktRollerState.Scrobbling) {
      return this._error;
    } else {
      return this._scrobble.error;
    }
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    if (this._enabled === value) return;
    this._enabled = value;

    this._storage.setValue(ScrobblingEnabledKey, value ? "true" : "false");
    this._scrobble.enabled = value;

    this.onEnabledChanged.dispatch(value);
  }

  public async lookupTraktUrl(url: string) {
    let match = TraktUrlRegex.exec(url);
    if (!match) {
      this._error = "Unrecognized Trakt URL.";
      this._setState(TraktRollerState.Error);
      return;
    }
    
    let data: ITraktScrobbleItem = {};
    if (match[1] == 'movies') {
      data.movie = {
        ids: {
          slug: match[2]
        }
      };
    } else {
      data.show = {
        ids: {
          slug: match[2]
        }
      };
      if (match[3] && match[4]) {
        data.episode = {
          season: parseInt(match[3]),
          number: parseInt(match[4])
        };
      } else {
        if (this._data && this._data.scrobble.episode) {
          data.episode = this._data.scrobble.episode;
        } else {
          this._error = "Missing episode information, provide the Trakt URL of an episode.";
          this._setState(TraktRollerState.Error);
          return;
        }
      }
    }

    await this._lookup(this._createScrobbleData(data));
  }

  private async _loadPrefs() {
    this._enabled = await this._storage.getValue(ScrobblingEnabledKey) === "true";
  }

  private async _waitForPlayer() {
    try {
      this._player = await this._website.loadPlayer();
      this._player.on(playerjs.EVENTS.READY, () => this._playerReady());
    } catch (e) {
      console.log(`TraktRoller: No player found on page: ${e.message}`);
    }
  }

  private _playerReady() {
    if (!this._api.isAuthenticated()) return;
    if (!this._player) return;

    this._player.on(playerjs.EVENTS.TIMEUPDATE,  (info: { seconds: number, duration: number }) => this._onTimeChanged(info));
    this._player.on(playerjs.EVENTS.PLAY,  () => this._onPlaybackStateChange(PlaybackState.Playing));
    this._player.on(playerjs.EVENTS.PAUSE, () => this._onPlaybackStateChange(PlaybackState.Paused));
    this._player.on(playerjs.EVENTS.ENDED, () => this._onPlaybackStateChange(PlaybackState.Ended));
    this._player.on(playerjs.EVENTS.ERROR, () => this._onPlaybackStateChange(PlaybackState.Ended));

    this._createStatusButton();

    this._data = this._website.loadData();
    if (!this._data) {
      this._error = "Could not extract scrobble data from page";
      this._setState(TraktRollerState.Error);
      return;
    }

    this._lookup(this._createScrobbleData(this._data.scrobble));
  }

  private async _lookup(data: ITraktScrobbleData) {
    try {
      this._setState(TraktRollerState.Lookup);
      let result = await this._looker.start(data);
      if (result == null) {
        this._setState(TraktRollerState.NotFound);
      } else {
        this._scrobble.scrobble(result);
        this._setState(TraktRollerState.Scrobbling);
      }
    } catch (error) {
      if (error.associatedObject) {
        console.error(error.message, error.associatedObject);
      } else {
        console.error(error.message);
      }
      this._error = error.message;
      this._setState(TraktRollerState.Error);
    }
  }

  private _onTimeChanged(info: { seconds: number, duration: number }) {
    this._currentTime = info.seconds;
    this._duration = info.duration;
    this._scrobble.setPlaybackTime(info.seconds, info.duration);
  }

  private _onPlaybackStateChange(state: PlaybackState) {
    this._scrobble.setPlaybackState(state, this._getProgress());
  }

  private _getProgress(): number {
    if (!this._duration) {
      console.warn(`TraktRoller: Duration is not set (${this._duration})`);
      return 0;
    } else if (this._duration === undefined) {
      console.warn("TraktRoller: Current time is not set");
      return 0;
    }
    
    return this._currentTime / this._duration * 100;
  }

  private _createScrobbleData(item: ITraktScrobbleItem): ITraktScrobbleData {
    let buildDate = new Date(process.env.BUILD_DATE);
    return Object.assign(item, {
      progress: this._getProgress(),
      app_version: process.env.VERSION,
      app_date: `${buildDate.getFullYear()}-${buildDate.getMonth() + 1}-${buildDate.getDate()}`
    });
  }

  private _onAuthenticationChange(isAuthenticated: boolean) {
    if (!isAuthenticated) {
      this._api.checkAuthenticationResult(window.location.href);
    }
  }

  private _onScrobbleStatusChanged(state: TraktScrobbleState) {
    if (this._state == TraktRollerState.Scrobbling) {
      this.onStateChanged.dispatch(this.state);
    }
  }

  private _onScrobbled(result: ITraktScobbleResult) {
    let ids: ITraktIDs | undefined = undefined;
    if (result.movie && result.movie.ids) {
      ids = result.movie.ids;
    } else if (result.episode && result.episode.ids) {
      ids = result.episode.ids;
    }

    if (!ids || !ids.trakt) {
      console.error(`TraktRoller: Srobble didn't return any trakt ids`, result);
      return;
    }

    this._history.add(ids.trakt, {
      id: result.id,
      watched_at: new Date().toISOString(),
      action: "scrobble",
      type: (result.movie ? 'movie' : 'episode'),
      movie: result.movie,
      show: result.show,
      episode: result.episode
    });
  }

  private _createFooterButton() {
    let footer = this._website.getConnectButtonParent();
    if (!footer) {
      console.error("TraktRoller: Could not find footer to add trakt connect button");
      return;
    }

    const cache = createCache({
      key: "trakt-roller",
      container: footer,
    });

    render(
      <CacheProvider value={ cache }>
        <ConnectButton api={ this._api } />
      </CacheProvider>,
      footer
    );
  }

  private _createStatusButton() {
    let container = this._website.getStatusButtonParent();
    if (!container) {
      console.error("TraktRoller: Could not find share row to add trakt status button");
      return;
    }

    const cache = createCache({
      key: "trakt-roller",
      container: container,
    });

    render((
      <CacheProvider value={ cache }>
        <RollerContext.Provider value={ this }>
          <StatusButton roller={ this } />
        </RollerContext.Provider>
      </CacheProvider>
    ), container);
  }
}
