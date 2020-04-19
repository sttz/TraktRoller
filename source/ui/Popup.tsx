import TraktScrobble from "../TraktScrobble";
import ScrobbleInfo from "./ScrobbleInfo";
import ScrobbleHistory from "./ScrobbleHistory";
import { ITraktScrobbleData } from "../TraktApi";
import ScrobbleControl from "./ScrobbleControl";
import TraktRoller, { TraktRollerCombinedState } from "../TraktRoller";

import { Component, h } from "preact";
import { css } from "emotion";

interface PopupProps {
  roller: TraktRoller;
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
  constructor(props: PopupProps) {
    super(props);

    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
  }

  componentWillMount() {
    this.setState({ scrobbleData: this.props.roller.scrobble.data });
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  private _onScrobbleStatusChanged(state: TraktRollerCombinedState) {
    this.setState({ scrobbleData: this.props.roller.scrobble.data });
  }

  render() {
    return (
      <div className={ className }>
        <ScrobbleInfo roller={ this.props.roller } />
        <ScrobbleHistory 
          scrobbleData={ this.state.scrobbleData } 
          history={ this.props.roller.history } 
          key={ TraktScrobble.traktIdFromData(this.state.scrobbleData) }
        />
        <ScrobbleControl roller={ this.props.roller } />
      </div>
    );
  }
}
