import TraktRoller from "../TraktRoller";
import TraktScrobble, { TraktScrobbleState, PlaybackState } from "../TraktScrobble";
import Button from "./Button";

import Preact, { Component } from "preact";
import { css } from "emotion";
import styled from "preact-emotion";
const h = Preact.h;

interface ScrobbleControlProps {
  roller: TraktRoller;
  scrobble: TraktScrobble;
}

interface ScrobbleControlState {
  scrobbleState: TraktScrobbleState;
  scrobblingEnabled: boolean;
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

const EnableScrobbleButton = styled(Button)`
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
    this.state = { scrobbleState: this.props.scrobble.state, scrobblingEnabled: this.props.roller.enabled };

    this._onScrobbleStateChanged = this._onScrobbleStateChanged.bind(this);
    this._onEnabledChanged = this._onEnabledChanged.bind(this);
    this._handleScrobbleNowClick = this._handleScrobbleNowClick.bind(this);
    this._handleEnableScrobbleClick = this._handleEnableScrobbleClick.bind(this);
  }

  componentWillMount() {
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  }

  private _onScrobbleStateChanged(state: TraktScrobbleState) {
    this.setState({ scrobbleState: state });
  }

  private _onEnabledChanged(enabled: boolean) {
    this.setState({ scrobblingEnabled: enabled });
  }

  private _handleScrobbleNowClick() {
    this.props.scrobble.scrobbleNow();
  }

  private _handleEnableScrobbleClick() {
    this.props.roller.enabled = !this.props.roller.enabled;
  }

  render() {
    let state = this.props.scrobble.enabled ? "Disabled" : TraktScrobbleState[this.props.scrobble.state];
    let title = this.props.scrobble.error || "";

    let disabled = !EnabledStates.includes(this.state.scrobbleState);
    let label = this.props.roller.enabled ? "Enable Scrobbling" : "Disable Scrobbling";

    return (
      <div className={ className }>
        <div class="state" title={ title }>{ state }</div>
        <ScrobbleNowButton text="Scrobble Now" onClick={ this._handleScrobbleNowClick } disabled={ disabled } />
        <EnableScrobbleButton text={ label } onClick={ this._handleEnableScrobbleClick } />
      </div>
    );
  }
}