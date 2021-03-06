import TraktApi from "../TraktApi";
import TraktIcon from "./TraktIcon";

import { Component } from "react";
import { jsx, css } from "@emotion/react";

interface ConnectButtonProps {
  api: TraktApi;
}

interface ConnectButtonState {
  isConnected: boolean;
}

let className = css`
  background-color: black;
  border: 1px solid #222;
  border-radius: 5px;
  padding: 2px 7px;
  color: white;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 11px;
  font-weight: normal;
  line-height: normal;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const iconStyles = css`
  height: 14px;
  width: 14px;
  margin-right: 5px;
`;

export default class ConnectButton extends Component<ConnectButtonProps, ConnectButtonState> {
  constructor(props: ConnectButtonProps) {
    super(props);
    this.state = { isConnected: this.props.api.isAuthenticated() };

    this._handleAuthenticationChanged = this._handleAuthenticationChanged.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  componentDidMount() {
    this.props.api.onAuthenticationChanged.sub(this._handleAuthenticationChanged);
  }

  componentWillUnmount() {
    this.props.api.onAuthenticationChanged.unsub(this._handleAuthenticationChanged);
  }

  private _handleAuthenticationChanged() {
    this.setState({ isConnected: this.props.api.isAuthenticated() });
  }

  private _handleClick() {
    let api = this.props.api;
    if (api.isAuthenticated()) {
      api.disconnect();
    } else {
      api.authenticate();
    }
  }

  render() {
    return (
      <div css={ className } onClick={ this._handleClick }>
        <TraktIcon className={ iconStyles } />
        <div css="text">{ this.state.isConnected ? "Disconnect from Trakt" : "Connect with Trakt" }</div>
      </div>
    );
  }
}
