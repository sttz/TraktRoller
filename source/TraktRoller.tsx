import TraktApi, { ITraktScrobbleData, ITraktApiOptions, ITraktScobbleResult, ITraktHistoryItem, IStorage, LocalStorageAdapter } from "./TraktApi";
import TraktScrobble, { TraktScrobbleState, PlaybackState } from "./TraktScrobble";
import ConnectButton from "./ui/ConnectButton";
import StatusButton from "./ui/StatusButton";
import { SimpleEventDispatcher } from "ste-simple-events";

import Preact, { render } from 'preact';
import TraktHistory from "./TraktHistory";
const h = Preact.h;

interface ITraktRollerOptions extends ITraktApiOptions {
  //
}

const EpisodeRegex = /Episode (\d+)/;
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

const ScrobblingEnabledKey: string = 'TraktRoller.enabled';

export default class TraktRoller {
  public onEnabledChanged = new SimpleEventDispatcher<boolean>();

  private _player: playerjs.Player;
  private _storage: IStorage;
  private _api: TraktApi;
  private _scrobble?: TraktScrobble;
  private _history: TraktHistory;
  private _enabled: boolean;

  private _duration: number;
  private _currentTime: number;

  constructor(options: ITraktRollerOptions) {
    console.log("TraktRoller");

    this._storage = options.storage || new LocalStorageAdapter();
    this._loadPrefs();

    this._api = new TraktApi(options);
    this._api.onAuthenticationChanged.sub(this._onAuthenticationChange.bind(this));
    this._api.loadTokens();

    this._createFooterButton();
    this._waitForPlayer();
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    if (this._enabled === value) return;
    this._enabled = value;

    this._storage.setValue(ScrobblingEnabledKey, value ? "true" : "false");
    if (this._scrobble) this._scrobble.enabled = value;

    this.onEnabledChanged.dispatch(value);
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
    this._player.on(playerjs.EVENTS.TIMEUPDATE,  (info) => this._onTimeChanged(info));
    this._player.on(playerjs.EVENTS.PLAY,  () => this._onPlaybackStateChange(PlaybackState.Playing));
    this._player.on(playerjs.EVENTS.PAUSE, () => this._onPlaybackStateChange(PlaybackState.Paused));
    this._player.on(playerjs.EVENTS.ENDED, () => this._onPlaybackStateChange(PlaybackState.Ended));
    this._player.on(playerjs.EVENTS.ERROR, () => this._onPlaybackStateChange(PlaybackState.Ended));

    this._history = new TraktHistory(this._api);

    this._scrobble = new TraktScrobble(this._api, data);
    this._scrobble.enabled = this.enabled;
    this._scrobble.onStateChanged.sub(this._onScrobbleStatusChanged.bind(this));
    this._scrobble.onScrobbled.sub(this._onScrobbled.bind(this));

    this._createStatusButton();
  }

  private _onTimeChanged(info: { seconds: number, duration: number }) {
    this._currentTime = info.seconds;
    this._duration = info.duration;
    if (this._scrobble) this._scrobble.setPlaybackTime(info.seconds, info.duration);
  }

  private _onPlaybackStateChange(state: PlaybackState) {
    if (!this._scrobble) return;
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

  private _getScrobbleData(): ITraktScrobbleData | null {
    let buildDate = new Date(process.env.BUILD_DATE);
    const data: ITraktScrobbleData = {
      progress: this._getProgress(),
      app_version: process.env.VERSION,
      app_date: `${buildDate.getFullYear()}-${buildDate.getMonth() + 1}-${buildDate.getDate()}`
    };

    const titleElement = document.querySelector('#showmedia_about_episode_num');
    if (!titleElement || titleElement.textContent.length == 0) {
      console.error("TraktRoller: Could not find video title");
      return null;
    }
    let showTitle = titleElement.textContent.trim();

    let episodeTitle: string = undefined;
    const episodeTitleElement = document.querySelector('#showmedia_about_name');
    if (episodeTitleElement) {
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
    if (episodeElement && episodeElement.textContent.length > 0) {
      const seasonMatch = SeasonRegex.exec(episodeElement.textContent);
      if (seasonMatch) {
        seasonNumber = parseInt(seasonMatch[1]);
      }
      
      const episodeMatch = EpisodeRegex.exec(episodeElement.textContent);
      if (episodeMatch) {
        episodeNumber = parseInt(episodeMatch[1]);
      }
    }

    if (episodeTitle && MovieRegexes.some(r => r.test(episodeTitle))) {
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
    //
  }

  private _onScrobbled(result: ITraktScobbleResult) {
    var item: ITraktHistoryItem = {
      id: result.id,
      watched_at: new Date().toISOString(),
      action: "scrobble",
      type: (result.movie ? 'movie' : 'episode'),
      movie: result.movie,
      show: result.show,
      episode: result.episode
    };
    let traktId = result.movie ? result.movie.ids.trakt : result.episode.ids.trakt;
    this._history.add(traktId, item);
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
      <StatusButton roller={ this } scrobble={ this._scrobble } history={ this._history } />
    ), container);
  }
}