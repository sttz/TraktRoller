import { ITraktRollerWebsite } from "../TraktRoller";
import { ITraktScrobbleData } from "../TraktApi";

import { css } from "emotion";
import * as playerjs from "player.js";

const connectButtonClassName = css`
  float: right;
  clear: both;
`;

const statusButtonClassName = css`
  float: right;
  margin: 12px 0;
`;

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

  async loadPlayer(): Promise<playerjs.Player> {
    return new playerjs.Player('player');
  }
  
  getConnectButtonParent(): Element | null {
    const footer = document.querySelector('footer > .container > .row > .col-md-10 > .row:nth-child(2) > .col-sm-4');
    if (!footer) return null;
    
    const container = document.createElement('div');
    container.className = connectButtonClassName;
    footer.appendChild(container);
    
    return container;
  }
  
  getStatusButtonParent(): Element | null {
    const submenu = document.querySelector('#video-details > .row > .col-md-10 > .row > .col-sm-6:nth-child(2)');
    if (!submenu) return null;

    const container = document.createElement('div');
    container.className = statusButtonClassName;
    submenu.appendChild(container);

    return container;
  }
  
  loadScrobbleData(): Partial<ITraktScrobbleData> | null {
    const data: Partial<ITraktScrobbleData> = {};
    
    var titleData = (window as any)['TITLE_DATA'] as TitleData;
    var kaneData = (window as any)['KANE_customdimensions'] as KaneDimensions;
    if (!titleData || !kaneData) {
      return null;
    }
    
    if (kaneData.videoType == 'Movie') {
      if (!titleData.title) return null;

      let year = undefined;
      if (kaneData.dateAdded) {
        let parts = kaneData.dateAdded.split('/');
        if (parts.length == 3) {
          year = parseInt(parts[2]);
        }
      }

      data.movie = {
        title: kaneData.showName,
        year: year,
      };
    
    } else if (kaneData.videoType == 'Episode') {
      if (!kaneData.showName || !titleData.seasonNum || !titleData.episodeNum) return null;
      data.show = {
        title: kaneData.showName
      };
      data.episode = {
        season: titleData.seasonNum,
        number: titleData.episodeNum,
        title: titleData.title,
      };
    
    } else {
      return null;
    }
    
    return data;
  }
}
