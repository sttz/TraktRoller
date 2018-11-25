import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import { ITraktScrobbleData } from "../TraktApi";

import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface ScrobbleInfoProps {
  scrobbleData: ITraktScrobbleData;
}

interface ScrobbleInfoState {
}

const className = css`
& .info h2 {
  font-size: 17px;
  padding-bottom: 4px;
}
`;

export default class ScrobbleInfo extends Component<ScrobbleInfoProps, ScrobbleInfoState> {
  constructor(props) {
    super(props);
  }

  render() {
    let data = this.props.scrobbleData;
    let info;

    // Still looking up
    if (!data) {
      info = (
        <div class="lookup">Loading…</div>
      );
    
    // Lookup succeeded
    } else {
      
      if (data.movie && data.movie.ids) {
        let movieUrl = `https://trakt.tv/movies/${data.movie.ids.slug}`;
        info = (
          <div class="info">
            <h2><a href={ movieUrl } target="_blank">{ data.movie.title } ({ data.movie.year })</a></h2>
          </div>
        );
      } else if (data.show && data.show.ids && data.episode && data.episode.ids) {
        let showUrl = `https://trakt.tv/shows/${data.show.ids.slug}`;
        let episodeUrl = `${showUrl}/seasons/${data.episode.season}/episodes/${data.episode.number}`;
        let episodeTitle = data.episode.title ? [ <br/>, data.episode.title ] : null;
        info = (
          <div class="info">
            <h2><a href={ showUrl } target="_blank">{ data.show.title } ({ data.show.year })</a></h2>
            <p><a href={ episodeUrl } target="_blank">
              Season { data.episode.season } Episode { data.episode.number }{ episodeTitle }
            </a></p>
          </div>
        );
      } else {
        info = (
          <div class="error">
            <h2>Failed to scrobble:</h2>
            <p>Missing data</p>
          </div>
        );
      }
    }

    return (
      <div className={ className }>
        { info }
      </div>
    );
  }
}