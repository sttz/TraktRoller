import TraktApi from "../TraktApi";
import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import TraktIcon from "./TraktIcon";

import Preact, { Component } from "preact";
import { css } from "emotion";
import styled from "preact-emotion";
const h = Preact.h;

interface StatusButtonProps {
  api: TraktApi;
  scrobble: TraktScrobble;
}

interface StatusButtonState {
  scrobbleState: TraktScrobbleState;
}

const popupClassName = css`
  background: #000000;
  border: 1px solid #fff;
  position: absolute;
  width: 400px;
  height: 300px;
  z-index: 100;
  left: -185px;
  border-radius: 10px;
  transition: all 0.2s ease-in;
  transition-delay: 0.2s;
  visibility: hidden;
  opacity: 0;
  bottom: 55px;

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
    border-width: 30px;
    margin-left: -30px;
  }
  &:before {
    border-color: rgba(255, 255, 255, 0);
    border-top-color: #fff;
    border-width: 32px;
    margin-left: -32px;
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

  &:hover .${popupClassName} {
    visibility: visible;
    opacity: 1;
    bottom: 63px;
  }
`;

const buttonClassName = css`
  width: 38px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;

  &.state-lookup, &.state-found {
    filter: opacity(0.5);
  }
  &.state-scrobbled {
    filter: hue-rotate(150deg) brightness(1.3);
  }
  &.state-error, &.state-notfound {
    filter: grayscale(1) brightness(2);
  }
`;

const Icon = styled(TraktIcon)`
  height: 100%;
`;

export default class StatusButton extends Component<StatusButtonProps, StatusButtonState> {
  constructor(props) {
    super(props);
    this.state = { scrobbleState: TraktScrobbleState.Undefined };

    this._handleScrobbleStatusChanged = this._handleScrobbleStatusChanged.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  componentWillMount() {
    this.props.scrobble.onStateChanged.sub(this._handleScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._handleScrobbleStatusChanged);
  }

  private _handleScrobbleStatusChanged(state: TraktScrobbleState) {
    this.setState({ scrobbleState: state });
  }

  private _handleClick() {
    window.open(this.props.scrobble.scrobbleUrl(), '_blank');
  }

  render() {
    let stateClass = "state-" + TraktScrobbleState[this.props.scrobble.state].toLowerCase();
    let title = this.props.scrobble.error || TraktScrobbleState[this.props.scrobble.state];
    return (
      <div className={ `${className} right` }>
        <button className={ `${buttonClassName} ${stateClass}` } title={ title } onClick={ this._handleClick }>
          <Icon />
        </button>
        <div className={ popupClassName }>
          <div class="hover-blocker"></div>
        </div>
      </div>
    );
  }
}