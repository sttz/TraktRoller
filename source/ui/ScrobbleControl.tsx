import TraktRoller, { TraktRollerCombinedState } from "../TraktRoller";
import Button from "./Button";

import { Component, h } from "preact";
import { css } from "emotion";
import { TraktScrobbleState } from "../TraktScrobble";

interface ScrobbleControlProps {
  roller: TraktRoller;
}

interface ScrobbleControlState {
  scrobbleState: TraktRollerCombinedState;
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
    text-transform: capitalize;
  }
`;

const scrobbleNowStyles = css`
  color: #8e44ad;
  border: 1px solid #8e44ad;
  background: none;

  &:hover {
    background-color: #8e44ad;
    color: #fff;
  }
`;

const enableScrobbleStyles = css`
  color: #16a085;
  border: 1px solid #16a085;
  background: none;

  &:hover {
    background-color: #16a085;
    color: #fff;
  }
`;

const EnabledStates: TraktRollerCombinedState[] = [
  TraktScrobbleState.Idle,
  TraktScrobbleState.Started,
  TraktScrobbleState.Paused
];

export default class ScrobbleControl extends Component<ScrobbleControlProps, ScrobbleControlState> {
  constructor(props: ScrobbleControlProps) {
    super(props);
    this.state = { scrobbleState: this.props.roller.state, scrobblingEnabled: this.props.roller.enabled };

    this._onScrobbleStateChanged = this._onScrobbleStateChanged.bind(this);
    this._onEnabledChanged = this._onEnabledChanged.bind(this);
    this._handleScrobbleNowClick = this._handleScrobbleNowClick.bind(this);
    this._handleEnableScrobbleClick = this._handleEnableScrobbleClick.bind(this);
  }

  componentWillMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  }

  private _onScrobbleStateChanged(state: TraktRollerCombinedState) {
    this.setState({ scrobbleState: state });
  }

  private _onEnabledChanged(enabled: boolean) {
    this.setState({ scrobblingEnabled: enabled });
  }

  private _handleScrobbleNowClick() {
    this.props.roller.scrobble.scrobbleNow();
  }

  private _handleEnableScrobbleClick() {
    this.props.roller.enabled = !this.props.roller.enabled;
  }

  render() {
    let state = this.props.roller.enabled ? "Disabled" : this.props.roller.state;
    let title = this.props.roller.error || "";

    let disabled = !(EnabledStates.indexOf(this.state.scrobbleState) >= 0);
    let label = this.props.roller.enabled ? "Enable Scrobbling" : "Disable Scrobbling";

    return (
      <div className={ className }>
        <div class="state" title={ title }>{ state }</div>
        <Button className={ scrobbleNowStyles } text="Scrobble Now" onClick={ this._handleScrobbleNowClick } disabled={ disabled } />
        <Button className={ enableScrobbleStyles } text={ label } onClick={ this._handleEnableScrobbleClick } />
      </div>
    );
  }
}
