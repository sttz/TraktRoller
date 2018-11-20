import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import { ITraktScrobbleData } from "../TraktApi";

import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface ScrobbleInfoProps {
  scrobble: TraktScrobble;
}

interface ScrobbleInfoState {
  scrobbleState: TraktScrobbleState;
  data: ITraktScrobbleData;
}

const className = css`
`;

export default class ScrobbleInfo extends Component<ScrobbleInfoProps, ScrobbleInfoState> {
  constructor(props) {
    super(props);
    this.state = { data: null, scrobbleState: TraktScrobbleState.Undefined };

    this._handleScrobbleStatusChanged = this._handleScrobbleStatusChanged.bind(this);
  }

  componentWillMount() {
    this.props.scrobble.onStateChanged.sub(this._handleScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._handleScrobbleStatusChanged);
  }

  private _handleScrobbleStatusChanged(state: TraktScrobbleState) {
    this.setState({ scrobbleState: state, data: this.props.scrobble.data });
  }

  render() {
    let state = this.state.scrobbleState;
    let scrobble = this.props.scrobble;
    let info;

    // Still looking up
    if (state === TraktScrobbleState.Undefined || state === TraktScrobbleState.Lookup) {
      info = (
        <div class="lookup">Loading…</div>
      );

    // Lookup or scrobble failed
    } else if (state === TraktScrobbleState.Error || state === TraktScrobbleState.NotFound) {
      info = (
        <div class="error">
          <h2>Failed to scrobble:</h2>
          <p>{ scrobble.error || TraktScrobbleState[state] }</p>
        </div>
      );
    
    // Lookup succeeded
    } else {
      let data = this.state.data;
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
        let episodeTitle = data.episode.title ? `: ${ data.episode.title }` : '';
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