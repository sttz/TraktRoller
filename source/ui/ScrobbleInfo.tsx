import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import { ITraktScrobbleData } from "../TraktApi";

import { Component, h } from "preact";
import { css } from "emotion";

interface ScrobbleInfoProps {
  scrobble: TraktScrobble;
}

interface ScrobbleInfoState {
  scrobbleData: ITraktScrobbleData;
  scrobbleState: TraktScrobbleState;
  error: string;
}

const className = css`
& .info h2 {
  font-size: 17px;
  padding-bottom: 4px;
}
`;

export default class ScrobbleInfo extends Component<ScrobbleInfoProps, ScrobbleInfoState> {
  constructor(props: ScrobbleInfoProps) {
    super(props);

    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
  }

  componentWillMount() {
    this.setState({ 
      scrobbleData: this.props.scrobble.data,
      scrobbleState: this.props.scrobble.state,
      error: this.props.scrobble.error
    });
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  private _onScrobbleStatusChanged(state: TraktScrobbleState) {
    this.setState({ 
      scrobbleData: this.props.scrobble.data,
      scrobbleState: this.props.scrobble.state,
      error: this.props.scrobble.error
    });
  }

  render() {
    let data = this.state.scrobbleData;
    let info;

    // Still looking up
    if (this.state.scrobbleState == TraktScrobbleState.Lookup) {
      info = (
        <div class="lookup">Loading…</div>
      );
    
    // Not found
    } else if (this.state.scrobbleState == TraktScrobbleState.NotFound) {
      info = (
        <div class="error">
          <h2>Failed to scrobble:</h2>
          <p>Could not find matching episode on Trakt</p>
        </div>
      );

    // Error
    } else if (this.state.scrobbleState == TraktScrobbleState.Error) {
      info = (
        <div class="error">
          <h2>Failed to scrobble:</h2>
          <p>{ this.state.error }</p>
        </div>
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
        let episodeTitle = data.episode.title ? `: ${data.episode.title}` : null;
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
            <h2>Internal error:</h2>
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
