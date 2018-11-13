import TraktApi, { ITraktScrobbleData, ITraktApiOptions } from "./TraktApi";
import TraktScrobble, { TraktScrobbleState, PlaybackState } from "./TraktScrobble";
import Preact, { render } from 'preact';
import { readFileSync } from "fs";

const packageInfo = require('../package.json');

// Magically include missing dependency "Buffer" by merely mentioning the word. :O
const css = readFileSync("./source/styles.css").toString();
// Required for TypeScript's jsx transformation, Parcel doesn't pick up and process the h() calls
const h = Preact.h;

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

  private _connectButton: Element;
  private _statusButton: Element;

  private _duration: number;
  private _currentTime: number;

  constructor(options: ITraktRollerOptions) {
    console.log("TraktRoller");

    this._api = new TraktApi(options);
    this._api.onAuthenticationChanged.sub(this._onAuthenticationChange.bind(this));
    this._api.loadTokens();

    this._injectCss();
    this._createFooterButton();
    this._waitForPlayer();
  }

  private _waitForPlayer() {
    if (window.VILOS_PLAYERJS) {
      this._loadPlayer(window.VILOS_PLAYERJS);
    } else {
      // Use a setter to wait for the player to be set
      let value: any;
      Object.defineProperty(window, "VILOS_PLAYERJS", {
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

    this._scrobble = new TraktScrobble(this._api, data);
    this._scrobble.onStateChanged.sub(this._onScrobbleStatusChanged.bind(this));

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
    this._updateFooterButton();
  }

  private _onScrobbleStatusChanged(state: TraktScrobbleState) {
    this._updateStatusButton();
  }

  private _injectCss() {
    const el = document.createElement("style");
    el.type = "text/css";
    el.appendChild(document.createTextNode(css));
    document.head.appendChild(el);
  }

  private _createFooterButton() {
    let footer = document.querySelector('#social_media');
    if (!footer) {
      console.error("TraktRoller: Could not find footer to add trakt connect button");
      return;
    }

    let onclick = () => {
      if (this._api.isAuthenticated()) {
        this._api.disconnect();
      } else {
        this._api.authenticate();
      }
    };
    this._connectButton = render(
      <div class="footer-column">
        <div class="trakt-connect-button" onClick={ onclick }>
          <div class="trakt-icon"></div>
          <div class="text"></div>
        </div>
      </div>,
      footer
    );
    this._updateFooterButton();
  }

  private _updateFooterButton() {
    if (!this._connectButton) return;
    this._connectButton.getElementsByClassName('text')[0].textContent = !this._api.isAuthenticated() ? 'Connect with Trakt' : 'Disconnect from Trakt';
  }

  private _createStatusButton() {
    let container = document.querySelector('.showmedia-submenu');
    if (!container) {
      console.error("TraktRoller: Could not find share row to add trakt status button");
      return;
    }

    this._statusButton = render((
      <button class="trakt-status-button right" onClick={ () => this._onStatusButtonClick() }>
        <div class="trakt-icon"/>
      </button>
    ), container);
    this._updateStatusButton();
  }

  private _updateStatusButton() {
    if (!this._statusButton) return;

    let classList = this._statusButton.classList;
    let toRemove = [];
    for (let i = 0; i < classList.length; i++) {
      let item = classList.item(i)!;
      if (item.startsWith('state-')) toRemove.push(item);
    }
    classList.remove(...toRemove);

    if (!this._scrobble) {
      classList.add('state-error');
      this._statusButton.setAttribute('title', 'No scrobbler instance');
    } else {
      classList.add('state-' + TraktScrobbleState[this._scrobble.state].toLowerCase());
      this._statusButton.setAttribute('title', this._scrobble.error || TraktScrobbleState[this._scrobble.state]);
    }
  }

  private _onStatusButtonClick() {
    if (!this._scrobble) return;
    window.open(this._scrobble.scrobbleUrl(), '_blank');
  }
}