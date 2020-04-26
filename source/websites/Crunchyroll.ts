import { ITraktRollerWebsite } from "../TraktRoller";
import { ITraktScrobbleData } from "../TraktApi";

import * as playerjs from "player.js";

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

export default class Crunchyroll implements ITraktRollerWebsite {
  async loadPlayer(): Promise<playerjs.Player> {
    return new playerjs.Player('vilos-player');
  }
  
  getConnectButtonParent(): Element | null {
    const footer = document.querySelector('#social_media');
    if (!footer) return null;
    
    const container = document.createElement('div');
    container.className = "footer-column";
    footer.appendChild(container);
    
    return container;
  }
  
  getStatusButtonParent(): Element | null {
    const submenu = document.querySelector('.showmedia-submenu');
    if (!submenu) return null;
    
    const container = document.createElement('div');
    container.className = "right";
    submenu.appendChild(container);
    
    return container;
  }
  
  loadScrobbleData(): Partial<ITraktScrobbleData> | null {
    const data: Partial<ITraktScrobbleData> = {};
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
}