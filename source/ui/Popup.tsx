import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import ScrobbleInfo from "./ScrobbleInfo";
import Button from "./Button";
import ScrobbleHistory from "./ScrobbleHistory";
import { ITraktScrobbleData } from "../TraktApi";
import TraktHistory from "../TraktHistory";

import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface PopupProps {
  scrobble: TraktScrobble;
  history: TraktHistory;
}

interface PopupState {
  scrobbleData: ITraktScrobbleData;
}

const className = css`
  padding: 8px;
  color: #eee;

  & a, & p a {
    color: #eee;
  }

  & h2 {
    font-size: 14px;
    margin: 0;
  }

  & h2 a:hover {
    text-decoration: underline;
  }

  button.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const controlButtonsClass = css`
  display: flex;
  margin: 5px -5px;
  justify-content: space-between;
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
        <ScrobbleInfo scrobbleData={ this.state.scrobbleData } />
        <div className={ controlButtonsClass }>
          <Button text="Scrobble Now" onClick={ null } />
          <Button text="Pause Scrobble" onClick={ null } />
        </div>
        <ScrobbleHistory 
          scrobbleData={ this.state.scrobbleData } 
          history={ this.props.history } 
          key={ TraktScrobble.traktIdFromData(this.state.scrobbleData) }
        />
      </div>
    );
  }
}