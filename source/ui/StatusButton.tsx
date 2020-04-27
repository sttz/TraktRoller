import TraktRoller, { TraktRollerCombinedState } from "../TraktRoller";
import TraktIcon from "./TraktIcon";
import Popup from "./Popup";

import { Component, h } from "preact";
import { css } from "emotion";

interface StatusButtonProps {
  roller: TraktRoller;
}

interface StatusButtonState {
  scrobbleState: TraktRollerCombinedState;
  enabled: boolean;
}

const popupClassName = css`
  background: #161616;
  border: 1px solid #fff;
  position: absolute;
  width: 450px;
  z-index: 10000;
  left: -209px;
  border-radius: 4px;
  transition: all 0.2s ease-in;
  transition-delay: 0.2s;
  visibility: hidden;
  opacity: 0;
  bottom: 55px;

  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 12px;
  line-height: normal;
  font-weight: 400;

  & h2 {
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 17px !important;
    font-weight: 700;
  }

  &:after, &:before {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  &:after {
    border-color: rgba(0, 0, 0, 0);
    border-top-color: #000000;
    border-width: 15px;
    margin-left: -15px;
  }
  &:before {
    border-color: rgba(255, 255, 255, 0);
    border-top-color: #fff;
    border-width: 17px;
    margin-left: -17px;
  }
  & .hover-blocker {
    position: absolute;
    bottom: -75px;
    left: 33%;
    width: 33%;
    height: 75px;
  }
`;

const className = css`
  position: relative;

  &:hover .popup {
    visibility: visible;
    opacity: 1;
    bottom: 44px;
  }
`;

const buttonClassName = css`
  width: 38px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 101;

  &.state-disabled {
    filter: opacity(0.5);
  }
  &.state-scrobbled {
    filter: hue-rotate(150deg) brightness(1.3);
  }
  &.state-error, &.state-notfound {
    filter: grayscale(1) brightness(2);
  }
`;

const iconStyles = css`
  height: 100%;
`;

export default class StatusButton extends Component<StatusButtonProps, StatusButtonState> {
  constructor(props: StatusButtonProps) {
    super(props);
    this.state = { scrobbleState: this.props.roller.state, enabled: this.props.roller.enabled };

    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
    this._onEnabledChanged = this._onEnabledChanged.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  componentWillMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  }

  private _onScrobbleStatusChanged(state: TraktRollerCombinedState) {
    this.setState({ scrobbleState: state });
  }

  private _onEnabledChanged(enabled: boolean) {
    this.setState({ enabled: enabled });
  }

  private _handleClick() {
    const url = this.props.roller.scrobble.scrobbleUrl();
    if (url != '') {
      window.open(this.props.roller.scrobble.scrobbleUrl(), '_blank');
    }
  }

  render() {
    let state = this.state.enabled ? "disabled" : this.state.scrobbleState;
    let stateClass = "state-" + state;
    let title = this.props.roller.error || this.state.scrobbleState;
    return (
      <div className={ `${className}` }>
        <button className={ `${buttonClassName} ${stateClass}` } title={ title } onClick={ this._handleClick }>
          <TraktIcon className={ iconStyles } />
        </button>
        <div className={ `${popupClassName} popup` }>
          <Popup roller={ this.props.roller } />
          <div class="hover-blocker"></div>
        </div>
      </div>
    );
  }
}
