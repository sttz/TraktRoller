import TraktScrobble, { TraktScrobbleState } from "../TraktScrobble";
import TraktApi, { ITraktHistoryItem } from "../TraktApi";
import Button from "./Button";

import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface ScrobbleHistoryProps {
  scrobble: TraktScrobble;
}

interface ScrobbleHistoryState {
  scrobbleState: TraktScrobbleState;
  history: ITraktHistoryItem[];
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
    padding: 1px 10px;
    margin-right: 0;
    background-color: #eb3b14;
    border: none;
    visibility: hidden;
  }

  & div:hover button {
    visibility: visible;
  }
`;

export default class ScrobbleHistory extends Component<ScrobbleHistoryProps, ScrobbleHistoryState> {
  private _loadingHistory = false;

  constructor(props) {
    super(props);
    this.state = { scrobbleState: TraktScrobbleState.Undefined, history: null };

    this._handleScrobbleStatusChanged = this._handleScrobbleStatusChanged.bind(this);
  }

  componentWillMount() {
    this.props.scrobble.onStateChanged.sub(this._handleScrobbleStatusChanged);
    this._loadHistory();
  }

  componentWillUnmount() {
    this.props.scrobble.onStateChanged.unsub(this._handleScrobbleStatusChanged);
  }

  private async _handleScrobbleStatusChanged(state: TraktScrobbleState) {
    this.setState({ scrobbleState: state });
    this._loadHistory();
  }

  private async _loadHistory() {
    if (this._loadingHistory || this.state.history) return;
    let data = this.props.scrobble.data;
    let movieId = data.movie && data.movie.ids && data.movie.ids.trakt || null;
    let episodeId = data.episode && data.episode.ids && data.episode.ids.trakt || null;
    console.log(`TraktRoller: Loading history?`);
    if (movieId === null && episodeId === null) return;

    let type: 'movies' | 'episodes';
    let id: number;
    if (movieId) {
      type = 'movies';
      id = movieId;
    } else {
      type = 'episodes';
      id = episodeId;
    }
    console.log(`TraktRoller: Loading ${type} ${id}`);
    this._loadingHistory = true;
    let result = await this.props.scrobble.api.history(type, id);
    if (TraktApi.isError(result)) {
      console.error(`TraktRoller: Error loading scrobble history (${result.error})`);
      return;
    }
    console.log(`TraktRoller: Loaded`, result);
    this.setState({ history: result });
  }
  
  render() {
    let rows = [(
      <div>
        <span>Now</span>
        <span>{ this.props.scrobble.error || TraktScrobbleState[this.state.scrobbleState] }</span>
      </div>
    )];

    if (this.state.history) {
      for (let item of this.state.history) {
        rows.push(
          <div>
            <span>{ new Date(item.watched_at).toLocaleString() }</span>
            <Button text="Remove" onClick={ null } />
          </div>
        );
      }
    }

    return (
      <div className={ className }>
        { rows }
      </div>
    );
  }
}