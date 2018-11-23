import TraktApi, { ITraktScrobbleData, ITraktApiOptions, ITraktScobbleResult, ITraktHistoryItem } from "./TraktApi";
import TraktScrobble, { TraktScrobbleState, PlaybackState } from "./TraktScrobble";
import ConnectButton from "./ui/ConnectButton";
import StatusButton from "./ui/StatusButton";

import Preact, { render } from 'preact';
import TraktHistory from "./TraktHistory";
const h = Preact.h;

const packageInfo = require('../package.json');

interface ITraktRollerOptions extends ITraktApiOptions {
  //
}

const EpisodeRegex = /Episode (\d+)/;
const SeasonRegex = /Season (\d+)/;

export default class TraktRoller {
  public scrobbleAbovePercentage = 80;

  private _player: playerjs.Player;
  private _api: TraktApi;
  private _scrobble?: TraktScrobble;
  private _history: TraktHistory;

  private _duration: number;
  private _currentTime: number;

  constructor(options: ITraktRollerOptions) {
    console.log("TraktRoller");

    this._api = new TraktApi(options);
    this._api.onAuthenticationChanged.sub(this._onAuthenticationChange.bind(this));
    this._api.loadTokens();

    this._createFooterButton();
    this._waitForPlayer();
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
    console.log("Got player:", player);
    player.on(playerjs.EVENTS.READY, () => this._playerReady(player));
  }

  private _playerReady(player: playerjs.Player) {
    console.log("Player ready");

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
    this._scrobble.onStateChanged.sub(this._onScrobbleStatusChanged.bind(this));
    this._scrobble.onScrobbled.sub(this._onScrobbled.bind(this));

    this._createStatusButton();
  }

  private _onTimeChanged(info: { seconds: number, duration: number }) {
    this._currentTime = info.seconds;
    this._duration = info.duration;
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
    const data: ITraktScrobbleData = {
      progress: this._getProgress(),
      app_version: packageInfo.version,
      app_date: '2018-12-01'
    };

    const titleElement = document.querySelector('#showmedia_about_episode_num');
    if (!titleElement || titleElement.textContent.length == 0) {
      console.error("TraktRoller: Could not find video title");
      return null;
    }
    let showTitle = titleElement.textContent.trim();

    const episodeTitleElement = document.querySelector('#showmedia_about_name');
    if (!episodeTitleElement) {
      console.error("TraktRoller: Could not find video subtitle");
      return null;
    }
    let episodeTitle = episodeTitleElement.textContent.trim();

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

    if (episodeTitle.toLowerCase().includes('movie')) {
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
      <StatusButton scrobble={ this._scrobble } history={ this._history } />
    ), container);
  }
}