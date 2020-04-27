import { ITraktRollerWebsite } from "../TraktRoller";
import { ITraktScrobbleData } from "../TraktApi";

import * as playerjs from "player.js";

interface TitleData {
  title?: string;
  seasonNum?: number;
  episodeNum?: number;
}

interface KaneDimensions {
  videoType?: string;
  showName?: string;
  dateAdded?: string;
}

export default class Funimation implements ITraktRollerWebsite {
  static createPlayerAdapter(videojs: videojs) {
    videojs('#brightcove-player', {}, function(this: any) {
      const adapter = new playerjs.VideoJSAdapter(this);
      adapter.ready();
    });
  }

  _decoder: HTMLTextAreaElement = document.createElement('textarea');

  _unescape(input?: string): string | undefined {
    if (!input) return input;
    this._decoder.innerHTML = input;
    return this._decoder.value;
  }

  async loadPlayer(): Promise<playerjs.Player> {
    return new playerjs.Player('player');
  }
  
  getConnectButtonParent(): HTMLElement | null {
    const footer = document.querySelector('footer > .container > .row > .col-md-10 > .row:nth-child(2) > .col-sm-4');
    if (!footer) return null;
    
    const container = document.createElement('div');
    container.style.float = "right";
    container.style.clear = "both";
    footer.appendChild(container);

    const shadow = container.attachShadow({ mode: 'closed' });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);
    
    return shadowContainer;
  }
  
  getStatusButtonParent(): HTMLElement | null {
    const submenu = document.querySelector('#video-details > .row > .col-md-10 > .row > .col-sm-6:nth-child(2)');
    if (!submenu) return null;

    const container = document.createElement('div');
    container.style.float = "right";
    container.style.margin = "12px 0";
    submenu.appendChild(container);

    const shadow = container.attachShadow({ mode: 'closed' });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);

    return shadowContainer;
  }
  
  loadScrobbleData(): Partial<ITraktScrobbleData> | null {
    const data: Partial<ITraktScrobbleData> = {};
    
    var titleData = (window as any)['TITLE_DATA'] as TitleData;
    var kaneData = (window as any)['KANE_customdimensions'] as KaneDimensions;
    if (!titleData || !kaneData) {
      return null;
    }

    let year = undefined;
    if (kaneData.dateAdded) {
      let parts = kaneData.dateAdded.split('/');
      if (parts.length == 3) {
        year = parseInt(parts[2]);
      }
    }

    if (kaneData.videoType == 'Movie') {
      if (!titleData.title) return null;
      data.movie = {
        title: kaneData.showName,
        year: year,
      };
    
    } else if (kaneData.videoType == 'Episode') {
      if (!kaneData.showName || !titleData.seasonNum || !titleData.episodeNum) return null;
      data.show = {
        title: this._unescape(kaneData.showName),
        year: year,
      };
      data.episode = {
        season: titleData.seasonNum,
        number: titleData.episodeNum,
        title: this._unescape(titleData.title),
      };
    
    } else {
      return null;
    }
    
    return data;
  }
}
