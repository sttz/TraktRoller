import TraktApi, { ITraktScrobbleData, ITraktApiOptions, ITraktScobbleResult, ITraktHistoryItem, IStorage, LocalStorageAdapter, ITraktIDs } from "./TraktApi";
import TraktScrobble, { TraktScrobbleState, PlaybackState } from "./TraktScrobble";
import ConnectButton from "./ui/ConnectButton";
import StatusButton from "./ui/StatusButton";
import TraktHistory from "./TraktHistory";

import { render, h, createContext } from 'preact';
import { SimpleEventDispatcher } from "ste-simple-events";
import TraktLookup from "./TraktLookup";

export const RollerContext = createContext<TraktRoller | undefined>(undefined);

export interface ITraktRollerOptions extends ITraktApiOptions {
  //
}

export enum TraktRollerState {
  Undefined = 'undefined',
  Lookup = 'lookup',
  NotFound = 'notfound',
  Scrobbling = 'scrobbling',
  Error = 'error',
};

export type TraktRollerCombinedState = TraktRollerState | TraktScrobbleState;

const EpisodeRegex = /Episode ([\d\.]+)/;
const SeasonRegex = /Season (\d+)/;

const MovieRegexes = [
  /Movie$/i,
  /Movie (Dub)$/i,
  /Movie (Sub)$/i,
  /Movie (Dubbed)$/i,
  /Movie (Subtitled)$/i,
  /^Movie - /i,
  /The Movie/i,
];

const TraktUrlRegex = /^https:\/\/trakt\.tv\/(movies|shows)\/([\w-]+)(?:\/seasons\/(\d+)\/episodes\/(\d+))?$/;

const ScrobblingEnabledKey: string = 'TraktRoller.enabled';

export default class TraktRoller {
  public onStateChanged = new SimpleEventDispatcher<TraktRollerCombinedState>();
  public onEnabledChanged = new SimpleEventDispatcher<boolean>();

  private _state: TraktRollerState;
  private _error: string | undefined;

  private _player?: playerjs.Player;
  private _storage: IStorage;
  private _api: TraktApi;
  private _looker: TraktLookup;
  private _scrobble: TraktScrobble;
  private _history: TraktHistory;
  private _enabled: boolean = false;

  private _duration: number = 0;
  private _currentTime: number = 0;

  constructor(options: ITraktRollerOptions) {
    console.log("TraktRoller");

    this._state = TraktRollerState.Undefined;

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
    
    let data = this._baseScrobbleData();
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
        if (this._scrobble.data && this._scrobble.data.episode) {
          data.episode = this._scrobble.data.episode;
        } else {
          let pageData = this._getScrobbleData();
          data.episode = pageData?.episode;
        }
      }
    }

    await this._lookup(data);
  }

  private async _loadPrefs() {
    this._enabled = await this._storage.getValue(ScrobblingEnabledKey) === "true";
  }

  private _waitForPlayer() {
    if (unsafeWindow.VILOS_PLAYERJS) {
      this._loadPlayer(unsafeWindow.VILOS_PLAYERJS);
    } else {
      // Use a setter to wait for the player to be set
      let value: any;
      Object.defineProperty(unsafeWindow, "VILOS_PLAYERJS", {
        get: ()=> value,
        set: (v)=> {
          value = v;
          this._loadPlayer(v);
        }
      });
    }
  }

  private _loadPlayer(player: playerjs.Player) {
    player.on(playerjs.EVENTS.READY, () => this._playerReady(player));
  }

  private _playerReady(player: playerjs.Player) {
    if (!this._api.isAuthenticated()) return;

    let data = this._getScrobbleData();
    if (!data) return;

    this._player = player;
    this._player.on(playerjs.EVENTS.TIMEUPDATE,  (info: { seconds: number, duration: number }) => this._onTimeChanged(info));
    this._player.on(playerjs.EVENTS.PLAY,  () => this._onPlaybackStateChange(PlaybackState.Playing));
    this._player.on(playerjs.EVENTS.PAUSE, () => this._onPlaybackStateChange(PlaybackState.Paused));
    this._player.on(playerjs.EVENTS.ENDED, () => this._onPlaybackStateChange(PlaybackState.Ended));
    this._player.on(playerjs.EVENTS.ERROR, () => this._onPlaybackStateChange(PlaybackState.Ended));

    this._createStatusButton();

    this._lookup(data);
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

  private _baseScrobbleData(): ITraktScrobbleData {
    let buildDate = new Date(process.env.BUILD_DATE);
    return {
      progress: this._getProgress(),
      app_version: process.env.VERSION,
      app_date: `${buildDate.getFullYear()}-${buildDate.getMonth() + 1}-${buildDate.getDate()}`
    };
  }

  private _getScrobbleData(): ITraktScrobbleData | null {
    const data = this._baseScrobbleData();

    const titleElement = document.querySelector('#showmedia_about_episode_num');
    if (!titleElement || !titleElement.textContent || titleElement.textContent.length == 0) {
      console.error("TraktRoller: Could not find video title");
      return null;
    }
    let showTitle = titleElement.textContent.trim();

    let episodeTitle: string | undefined = undefined;
    const episodeTitleElement = document.querySelector('#showmedia_about_name');
    if (episodeTitleElement && episodeTitleElement.textContent) {
      episodeTitle = episodeTitleElement.textContent.trim();
      if (episodeTitle) {
        if (episodeTitle.startsWith("“")) {
          episodeTitle = episodeTitle.substring(1);
        }
        if (episodeTitle.endsWith("”")) {
          episodeTitle = episodeTitle.substring(0, episodeTitle.length - 1);
        }
      }
    }

    let seasonNumber = 1;
    let episodeNumber = 0;
    const episodeElement = document.querySelector('#showmedia_about_media h4:nth-child(2)');
    if (episodeElement && episodeElement.textContent && episodeElement.textContent.length > 0) {
      const seasonMatch = SeasonRegex.exec(episodeElement.textContent);
      if (seasonMatch) {
        seasonNumber = parseInt(seasonMatch[1]);
      }
      
      const episodeMatch = EpisodeRegex.exec(episodeElement.textContent);
      if (episodeMatch) {
        episodeNumber = parseFloat(episodeMatch[1]);
      }
    }

    if (episodeTitle && MovieRegexes.some(r => r.test(episodeTitle!))) {
      data.movie = {
        title: showTitle
      };
    } else {
      data.show = {
        title: showTitle
      };
      data.episode = {
        season: seasonNumber,
        number: episodeNumber,
        title: episodeTitle
      };
    }

    return data;
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
    let footer = document.querySelector('#social_media');
    if (!footer) {
      console.error("TraktRoller: Could not find footer to add trakt connect button");
      return;
    }

    render(
      <div class="footer-column">
        <ConnectButton api={ this._api } />
      </div>,
      footer
    );
  }

  private _createStatusButton() {
    let container = document.querySelector('.showmedia-submenu');
    if (!container) {
      console.error("TraktRoller: Could not find share row to add trakt status button");
      return;
    }

    render((
      <RollerContext.Provider value={ this }>
        <StatusButton roller={ this } />
      </RollerContext.Provider>
    ), container);
  }
}
