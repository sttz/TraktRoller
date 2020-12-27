import TraktRoller, { TraktRollerCombinedState, TraktRollerState } from "../TraktRoller";
import { ITraktScrobbleData } from "../TraktApi";

import { Component } from "react";
import { jsx, css } from "@emotion/react";

interface ScrobbleInfoProps {
  roller: TraktRoller;
}

interface ScrobbleInfoState {
  scrobbleData?: ITraktScrobbleData;
  scrobbleState: TraktRollerCombinedState;
  error?: string;
  isEditing: boolean;
  lookupUrl: string;
}

const className = css`
& .info h2 {
  font-size: 17px;
  padding-bottom: 4px;
}
& .info a {
  text-decoration: none;
}
& .info p {
  margin: 0;
}
& .editbutton {
  position: absolute;
  top: 7px;
  right: 7px;
  background: none;
  border: none;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
& .edit {
  display: flex;
  flex-wrap: wrap;
}
& .edit div {
  flex: 0 0 100%;
  margin: 0 5px;
}
& .edit input {
  padding: 5px;
  margin: 5px;
}
& .edit button {
  padding: 5px 10px;
  margin: 5px;
}
& .edit input {
  flex-grow: 1;
}
`;

export default class ScrobbleInfo extends Component<ScrobbleInfoProps, ScrobbleInfoState> {
  _focusUrlInput = false;

  constructor(props: ScrobbleInfoProps) {
    super(props);

    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);

    this.state = {
      scrobbleData: this.props.roller.scrobble.data,
      scrobbleState: this.props.roller.state,
      error: this.props.roller.error,
      isEditing: false,
      lookupUrl: '',
    };
  }

  componentDidMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  private _onScrobbleStatusChanged(state: TraktRollerCombinedState) {
    this.setState({ 
      scrobbleData: this.props.roller.scrobble.data,
      scrobbleState: this.props.roller.state,
      error: this.props.roller.error
    });
  }

  private async _lookUpUrl() {
    let lookupUrl = this.state.lookupUrl;
    this.setState({
      lookupUrl: "",
      isEditing: false
    });

    try {
      await this.props.roller.lookupTraktUrl(lookupUrl);
    } catch (e) {
      this.setState({
        error: e.message
      });
    }
  }

  render() {
    let data = this.state.scrobbleData;
    let info;

    // Editing
    if (this.state.isEditing) {
      info = (
        <div className="edit">
          <div>Enter the Trakt URL of the correct movie, show or episode:</div>
          <input 
            type="text" 
            value={ this.state.lookupUrl } 
            ref={ ref => { if (this._focusUrlInput && ref) { ref.focus(); this._focusUrlInput = false; } } } 
            onChange={ e => this.setState({ lookupUrl: e.currentTarget.value }) }
          />
          <button title="Update" onClick={ () => this._lookUpUrl() }>Update</button>
        </div>
      );

    // Still looking up
    } else if (this.state.scrobbleState == TraktRollerState.Undefined || this.state.scrobbleState == TraktRollerState.Lookup) {
      info = (
        <div className="lookup">Loading…</div>
      );
    
    // Not found
    } else if (this.state.scrobbleState == TraktRollerState.NotFound) {
      info = (
        <div className="error">
          <h2>Failed to scrobble:</h2>
          <p>Could not find matching episode on Trakt</p>
        </div>
      );

    // Error
    } else if (this.state.scrobbleState == TraktRollerState.Error) {
      info = (
        <div className="error">
          <h2>Failed to scrobble:</h2>
          <p>{ this.state.error }</p>
        </div>
      );

    // Lookup succeeded
    } else if (data) {
      
      if (data.movie && data.movie.ids) {
        let movieUrl = `https://trakt.tv/movies/${data.movie.ids.slug}`;
        info = (
          <div className="info">
            <h2><a href={ movieUrl } target="_blank">{ data.movie.title } ({ data.movie.year })</a></h2>
          </div>
        );
      } else if (data.show && data.show.ids && data.episode && data.episode.ids) {
        let showUrl = `https://trakt.tv/shows/${data.show.ids.slug}`;
        let episodeUrl = `${showUrl}/seasons/${data.episode.season}/episodes/${data.episode.number}`;
        let episodeTitle = data.episode.title ? `: ${data.episode.title}` : null;
        info = (
          <div className="info">
            <h2><a href={ showUrl } target="_blank">{ data.show.title } ({ data.show.year })</a></h2>
            <p><a href={ episodeUrl } target="_blank">
              Season { data.episode.season } Episode { data.episode.number }{ episodeTitle }
            </a></p>
          </div>
        );
      } else {
        info = (
          <div className="error">
            <h2>Internal error:</h2>
            <p>Missing data</p>
          </div>
        );
      }
    }

    return (
      <div css={ className }>
        <button 
            className="editbutton" 
            title={ this.state.isEditing ? "Cancel" : "Edit" } 
            onClick={ () => { this.setState({ isEditing: !this.state.isEditing }); this._focusUrlInput = true; } }>
          { this.state.isEditing ? "✕" : "✍︎" }
        </button>
        { info }
      </div>
    );
  }
}
