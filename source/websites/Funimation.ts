import { ITraktRollerWebsite, IWebsiteData } from "../TraktRoller";
import { ITraktScrobbleData } from "../TraktApi";

import * as playerjs from "player.js";

interface TitleData {
  id?: string;
  seriesId?: string;
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
    const player = document.getElementById('player');
    if (!player) throw new Error('Player not found');
    return new playerjs.Player(player);
  }
  
  getConnectButtonParent(): HTMLElement | null {
    const footer = document.querySelector('.social-media');
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
  
  loadData(): IWebsiteData | null {
    const data: IWebsiteData = {
      id: null,
      series_id: null,
      season_id: null,
      scrobble: {}
    };
    
    let titleData = (unsafeWindow as any)['TITLE_DATA'] as TitleData;
    let kaneData = (unsafeWindow as any)['KANE_customdimensions'] as KaneDimensions;
    if (!titleData || !kaneData) {
      console.error(`TraktRoller: Either TITLE_DATA or KANE_customdimensions not defined:`, titleData, kaneData);
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
      if (!titleData.title || !titleData.id) {
        console.error(`TraktRoller: Missing title or id in data`, titleData);
        return null;
      }
      data.id = titleData.id;
      data.scrobble.movie = {
        title: kaneData.showName,
        year: year,
      };
    
    } else if (kaneData.videoType == 'Episode') {
      if (!kaneData.showName 
          || !titleData.seasonNum 
          || !titleData.episodeNum
          || !titleData.id
          || !titleData.seriesId) {
        console.error(`TraktRoller: Missing website data`, kaneData, titleData);
        return null;
      }
      data.id = titleData.id;
      data.series_id = titleData.seriesId;
      data.scrobble.show = {
        title: this._unescape(kaneData.showName),
        year: year,
      };
      data.scrobble.episode = {
        season: titleData.seasonNum,
        number: titleData.episodeNum,
        title: this._unescape(titleData.title),
      };
    
    } else {
      console.error(`TraktRoller: Unknown KANE video type: ${kaneData.videoType}`);
      return null;
    }
    
    return data;
  }
}
