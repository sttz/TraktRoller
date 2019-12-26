import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import TraktApi, { ITraktHistoryItem, ITraktScrobbleData } from "../TraktApi";
import TraktHistory from "../TraktHistory";
import Button from "./Button";

import { Component, h } from "preact";
import { css } from "emotion";

interface ScrobbleHistoryProps {
  scrobbleData: ITraktScrobbleData;
  history: TraktHistory;
}

interface ScrobbleHistoryState {
  historyItems: ITraktHistoryItem[];
}

const className = css`
  & div {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #666;
    height: 24px;
    align-items: flex-end;
  }

  & button {
    flex-grow: 0;
    font-size: 9px;
    padding: 2px 10px;
    margin-right: 0;
    font-weight: normal;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
  }

  & button:hover {
    background-color: #eb3b14;
  }

  & div:hover button {
    opacity: 1;
    visibility: visible;
  }
`;

const ActionMap = {
  scrobble: "Scrobbled",
  checkin: "Checked in",
  watch: "Watched"
};

export default class ScrobbleHistory extends Component<ScrobbleHistoryProps, ScrobbleHistoryState> {
  private _traktId: number;
  private _formatter: Intl.DateTimeFormat;

  constructor(props: ScrobbleHistoryProps) {
    super(props);
    this._formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "short",
      day: "numeric", 
      hour: "numeric", 
      minute: "numeric"
    });
    this.state = { historyItems: null };

    this._handleHistoryChanged = this._handleHistoryChanged.bind(this);
  }

  componentWillMount() {
    let data = this.props.scrobbleData;
    this._traktId = TraktScrobble.traktIdFromData(data);
    if (this._traktId !== 0) {
      let type = TraktScrobble.typeFromData(data);
      this.props.history.sub(this._traktId, this._handleHistoryChanged);
      this.props.history.load(type === "movie" ? "movies" : "episodes", this._traktId);
    }
  }

  componentWillUnmount() {
    this.props.history.unsub(this._traktId, this._handleHistoryChanged);
  }

  private _handleHistoryChanged(items: ITraktHistoryItem[]) {
    this.setState({ historyItems: items });
  }

  private async _handleRemove(e: MouseEvent, item: ITraktHistoryItem) {
    let el = e.target as HTMLElement;
    el.classList.add("disabled");
    el.innerText = "Removing...";

    await this.props.history.remove(item.id);

    el.classList.remove("disabled");
    el.innerText = "Remove";
  }
  
  render() {
    if (this.state.historyItems && this.state.historyItems.length > 0) {
      let rows = [];
      for (let item of this.state.historyItems) {
        rows.push(
          <div>
            <span>{ ActionMap[item.action] } at { this._formatter.format(new Date(item.watched_at)) }</span>
            <Button text="Remove" onClick={ (e) => this._handleRemove(e, item) } />
          </div>
        );
      }
      return (
        <div className={ className }>
          <h2>Watch History</h2>
          { rows }
        </div>
      );
    } else {
      return null;
    }
  }
}
