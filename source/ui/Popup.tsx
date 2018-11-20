import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import ScrobbleInfo from "./ScrobbleInfo";
import Button from "./Button";
import ScrobbleHistory from "./ScrobbleHistory";

import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface PopupProps {
  scrobble: TraktScrobble;
}

interface PopupState {
  //
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
`;

const controlButtonsClass = css`
  display: flex;
  margin: 5px -5px;
  justify-content: space-between;
`;

export default class Popup extends Component<PopupProps, PopupState> {
  render() {
    let scrobble = this.props.scrobble;

    return (
      <div className={ className }>
        <ScrobbleInfo scrobble={ scrobble } />
        <div className={ controlButtonsClass }>
          <Button text="Skip Scrobble" onClick={ null } />
          <Button text="Scrobble Now" onClick={ null } />
        </div>
        <ScrobbleHistory scrobble={ scrobble } />
      </div>
    );
  }
}