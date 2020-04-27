import TraktScrobble from "../TraktScrobble";
import ScrobbleInfo from "./ScrobbleInfo";
import ScrobbleHistory from "./ScrobbleHistory";
import { ITraktScrobbleData } from "../TraktApi";
import ScrobbleControl from "./ScrobbleControl";
import TraktRoller, { TraktRollerCombinedState } from "../TraktRoller";

import { Component } from "react";
import { jsx, css } from "@emotion/core";

interface PopupProps {
  roller: TraktRoller;
}

interface PopupState {
  scrobbleData?: ITraktScrobbleData;
}

const className = css`
  color: #eee;
  z-index: 10000;

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

    this.state = {
      scrobbleData: this.props.roller.scrobble.data 
    };
  }

  componentDidMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  private _onScrobbleStatusChanged(state: TraktRollerCombinedState) {
    this.setState({ scrobbleData: this.props.roller.scrobble.data });
  }

  render() {
    let history = null;
    if (this.state.scrobbleData) {
      history = <ScrobbleHistory 
        scrobbleData={ this.state.scrobbleData } 
        history={ this.props.roller.history } 
        key={ TraktScrobble.traktIdFromData(this.state.scrobbleData) }
      />;
    }

    return (
      <div css={ className }>
        <ScrobbleInfo roller={ this.props.roller } />
        { history }
        <ScrobbleControl roller={ this.props.roller } />
      </div>
    );
  }
}
