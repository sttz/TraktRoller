import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import ScrobbleInfo from "./ScrobbleInfo";
import ScrobbleHistory from "./ScrobbleHistory";
import { ITraktScrobbleData } from "../TraktApi";
import TraktHistory from "../TraktHistory";
import ScrobbleControl from "./ScrobbleControl";
import TraktRoller from "../TraktRoller";

import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface PopupProps {
  roller: TraktRoller;
  scrobble: TraktScrobble;
  history: TraktHistory;
}

interface PopupState {
  scrobbleData: ITraktScrobbleData;
}

const className = css`
  color: #eee;

  & > div {
    padding: 15px;
  }

  & a, & p a {
    color: #eee;
    transition: color 0.2s ease;
  }

  & h2 {
    font-size: 13px;
    margin: 0;
  }

  & h2 a:hover, & p a:hover {
    color: #ed1c24;
    text-decoration: none;
  }

  button.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

export default class Popup extends Component<PopupProps, PopupState> {
  constructor(props) {
    super(props);

    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
  }

  componentWillMount() {
    this.setState({ scrobbleData: this.props.scrobble.data });
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  private _onScrobbleStatusChanged(state: TraktScrobbleState) {
    this.setState({ scrobbleData: this.props.scrobble.data });
  }

  render() {
    let scrobble = this.props.scrobble;

    return (
      <div className={ className }>
        <ScrobbleInfo scrobble={ this.props.scrobble } />
        <ScrobbleHistory 
          scrobbleData={ this.state.scrobbleData } 
          history={ this.props.history } 
          key={ TraktScrobble.traktIdFromData(this.state.scrobbleData) }
        />
        <ScrobbleControl scrobble={ this.props.scrobble } roller={ this.props.roller } />
      </div>
    );
  }
}