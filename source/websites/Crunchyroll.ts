import { ITraktRollerWebsite, IWebsiteData } from "../TraktRoller";

import * as playerjs from "player.js";

const PlayerMetadataRegex = /vilos\.config\.media = (.*);$/m;

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

const DubSubSuffix = / \((?:\w+ )?(?:Dub|Dubbed|Sub|Subbed|Subtitled)\)/;

interface PlayerMetadata {
  metadata: {
    id: string,
    series_id: string,
    type: string,
    title: string,
    episode_number: string,
  }
}

interface LinkedData {
  partOfSeason: {
    name: string,
    seasonNumber: string,
  },
  partOfSeries: {
    name: string,
  }
}

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

  loadPlayerMetadata(): PlayerMetadata | null {
    const playerBox = document.querySelector('#showmedia_video_box, #showmedia_video_box_wide');
    if (!playerBox) {
      console.error("TraktRoller: Could not find #showmedia_video_box element");
      return null;
    }

    const script = Array.from(playerBox.querySelectorAll('script')).filter(s => s.src == "" && s.type == "");
    if (script.length != 1) {
      console.error(`TraktRoller: Could not find player initialization inline script (${script.length})`);
      return null;
    }

    const match = PlayerMetadataRegex.exec(script[0].innerText);
    if (!match) {
      console.error(`TraktRoller: Could not find player metadata in inline script`);
      return null;
    }

    let metadata;
    try {
      metadata = JSON.parse(match[1]) as PlayerMetadata;
    } catch (e) {
      console.error(`TraktRoller: Error parsing player metadata: ${e}`);
      return null;
    }

    if (   !metadata.metadata 
        || !metadata.metadata.id 
        || !metadata.metadata.series_id 
        || !metadata.metadata.type
        || metadata.metadata.title === undefined
        || metadata.metadata.episode_number === undefined) {
        console.error(`TraktRoller: Incomplete player metadata:`, metadata);
        return null;
      }

    return metadata;
  }

  loadLinkedData(): LinkedData | null {
    const linkedData = Array.from(document.getElementsByTagName('script'))
      .filter(s => s.type == "application/ld+json" && s.innerText.indexOf('seasonNumber') >= 0);
    if (linkedData.length != 1) {
      console.error(`TraktRoller: Could not find JSON-LD script (${linkedData.length})`);
      return null;
    }

    let metadata;
    try {
      metadata = JSON.parse(linkedData[0].innerText) as LinkedData;
    } catch (e) {
      console.error(`TraktRoller: Error parsing JSON-LD metadata: ${e}`);
      return null;
    }

    if (   !metadata.partOfSeason 
        || !metadata.partOfSeason.name 
        || !metadata.partOfSeason.seasonNumber
        || !metadata.partOfSeries
        || !metadata.partOfSeries.name) {
      console.error(`TraktRoller: Incomplete JSON-lD metadata:`, metadata);
      return null;
    }

    return metadata;
  }

  loadDataFromJson(): IWebsiteData | null {
    let playerMetadata = this.loadPlayerMetadata();
    let linkedMetadata = this.loadLinkedData();
    if (!playerMetadata || !linkedMetadata) return null;

    const data: IWebsiteData = {
      id: null,
      series_id: null,
      scrobble: {}
    };
    if (playerMetadata.metadata.type == "movie" 
        || playerMetadata.metadata.episode_number == ""
        || playerMetadata.metadata.episode_number == "Movie"
        || MovieRegexes.some(r => r.test(playerMetadata!.metadata.title))) {
      data.id = playerMetadata.metadata.id;
      data.scrobble.movie = {
        title: linkedMetadata.partOfSeason.name.replace(DubSubSuffix, ''),
      };
    } else {
      data.id = playerMetadata.metadata.id;
      data.series_id = playerMetadata.metadata.id;
      data.scrobble.show = {
        title: linkedMetadata.partOfSeries.name,
      };
      data.scrobble.episode = {
        season: parseFloat(linkedMetadata.partOfSeason.seasonNumber) || 1,
        number: parseFloat(playerMetadata.metadata.episode_number),
        title: playerMetadata.metadata.title.replace(DubSubSuffix, ''),
      };
    }

    return data;
  }

  loadDataFromDom(): IWebsiteData | null {
    const data: IWebsiteData = {
      id: "",
      series_id: "",
      scrobble: {}
    };
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
      data.scrobble.movie = {
        title: showTitle
      };
    } else {
      data.scrobble.show = {
        title: showTitle
      };
      data.scrobble.episode = {
        season: seasonNumber,
        number: episodeNumber,
        title: episodeTitle
      };
    }
    return data;
  }

  loadData(): IWebsiteData | null {
    let jsonData = this.loadDataFromJson();
    let domData = this.loadDataFromDom();

    if (JSON.stringify(jsonData?.scrobble) != JSON.stringify(domData?.scrobble)) {
      console.warn(`TraktRoller: Dom and Json data do not match`, jsonData, domData);
    }

    return jsonData;
  }
}
}
