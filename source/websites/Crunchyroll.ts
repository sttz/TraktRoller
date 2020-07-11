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
    let player = document.getElementById('vilos-player');
    if (!player) {
      const container = document.getElementById('showmedia_video_player');
      if (!container) {
        throw new Error('Current page doesn\'t appear to be a video page ("#showmedia_video_player" container is missing)');
      }
      // The player iframe hasn't been created yet, wait for it to appear
      console.log("TraktRoller: Waiting for player iframe to be added to container...");
      await new Promise((resolve) => {
        const observer = new MutationObserver((mutationList, observer) => {
          player = document.getElementById('vilos-player');
          if (player) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(container, { childList: true });
      });
    }
    return new playerjs.Player(player!);
  }
  
  getConnectButtonParent(): HTMLElement | null {
    const footer = document.querySelector('#social_media');
    if (!footer) return null;
    
    const container = document.createElement('div');
    container.className = "footer-column";
    footer.appendChild(container);
    
    const shadow = container.attachShadow({ mode: 'closed' });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);

    return shadowContainer;
  }
  
  getStatusButtonParent(): HTMLElement | null {
    const submenu = document.querySelector('.showmedia-submenu');
    if (!submenu) return null;
    
    const container = document.createElement('div');
    container.className = "right";
    submenu.appendChild(container);

    const shadow = container.attachShadow({ mode: 'closed' });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);

    return shadowContainer;
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
