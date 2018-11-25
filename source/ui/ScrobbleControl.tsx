import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import { ITraktScrobbleData } from "../TraktApi";
import Button from "./Button";

import Preact, { Component } from "preact";
import { css } from "emotion";
import styled from "preact-emotion";
const h = Preact.h;

interface ScrobbleControlProps {
  scrobble: TraktScrobble;
}

interface ScrobbleControlState {
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

export default class ScrobbleControl extends Component<ScrobbleControlProps, ScrobbleControlState> {
  constructor(props) {
    super(props);
  }

  render() {
    let title = this.props.scrobble.error || "";
    return (
      <div className={ className }>
        <div class="state" title={ title }>{ TraktScrobbleState[this.props.scrobble.state] }</div>
        <ScrobbleNowButton text="Scrobble Now" onClick={ null } />
        <PauseScrobbleButton text="Pause Scrobble" onClick={ null } />
      </div>
    );
  }
}