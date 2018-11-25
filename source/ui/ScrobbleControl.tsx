import TraktScrobble, { TraktScrobbleState, PlaybackState } from "../TraktScrobble";
import Button from "./Button";

import Preact, { Component } from "preact";
import { css } from "emotion";
import styled from "preact-emotion";
const h = Preact.h;

interface ScrobbleControlProps {
  scrobble: TraktScrobble;
}

interface ScrobbleControlState {
  scrobbleState: TraktScrobbleState;
}

const className = css`
  display: flex;
  margin: 5px -5px;
  justify-content: space-between;

  & > div, & > button {
    width: 33%;
  }

  & .state {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    background-color: #ed1c24;
    border: none;
    border-radius: 3px;
    margin: 5px;
    padding: 5px 10px 5px 10px;
    width: 20%;
  }
`;

const ScrobbleNowButton = styled(Button)`
  color: #8e44ad;
  border: 1px solid #8e44ad;
  background: none;

  &:hover {
    background-color: #8e44ad;
    color: #fff;
  }
`;

const PauseScrobbleButton = styled(Button)`
  color: #16a085;
  border: 1px solid #16a085;
  background: none;

  &:hover {
    background-color: #16a085;
    color: #fff;
  }
`;

const EnabledStates = [
  TraktScrobbleState.Found,
  TraktScrobbleState.Started,
  TraktScrobbleState.Paused
];

export default class ScrobbleControl extends Component<ScrobbleControlProps, ScrobbleControlState> {
  constructor(props) {
    super(props);
    this.state = { scrobbleState: this.props.scrobble.state };

    this._onScrobbleStateChanged = this._onScrobbleStateChanged.bind(this);
    this._handleScrobbleNowClick = this._handleScrobbleNowClick.bind(this);
    this._handlePauseScrobbleClick = this._handlePauseScrobbleClick.bind(this);
  }

  componentWillMount() {
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStateChanged);
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStateChanged);
  }

  private _onScrobbleStateChanged(state: TraktScrobbleState) {
    this.setState({ scrobbleState: state });
  }

  private _handleScrobbleNowClick() {
    this.props.scrobble.setPlaybackState(PlaybackState.Ended, 100);
  }

  private _handlePauseScrobbleClick() {
    //
  }

  render() {
    let title = this.props.scrobble.error || "";
    let disabled = !EnabledStates.includes(this.state.scrobbleState);
    return (
      <div className={ className }>
        <div class="state" title={ title }>{ TraktScrobbleState[this.props.scrobble.state] }</div>
        <ScrobbleNowButton text="Scrobble Now" onClick={ this._handleScrobbleNowClick } disabled={ disabled } />
        <PauseScrobbleButton text="Pause Scrobble" onClick={ this._handlePauseScrobbleClick } disabled={ disabled } />
      </div>
    );
  }
}