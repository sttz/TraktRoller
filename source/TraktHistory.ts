import TraktApi, { ITraktHistoryItem } from "./TraktApi";

interface History {
  traktId: number;
  items: ITraktHistoryItem[] | null, 
  subscribers: Array<(history: ITraktHistoryItem[]) => void>;
}

/** Load a manage Trakt watched history */
export default class TraktHistory {
  private _api: TraktApi;
  private _histories: { [key: string]: History } = {};

  constructor(api: TraktApi) {
    this._api = api;
  }

  /** Load history for a movie or episode */
  public async load(type: 'movies' | 'episodes', traktId: number, reload: boolean = false): Promise<ITraktHistoryItem[]> {
    if (!reload && this._histories[traktId] && this._histories[traktId].items) {
      return this._histories[traktId].items!;
    }

    let result = await this._api.history(type, traktId);
    if (TraktApi.isError(result)) {
      console.error(`TraktRoller: Error loading scrobble history (${result.error})`)
      return [];
    }

    this._update(traktId, result);
    return result;
  }

  /** Add a new item to the history */
  public add(traktId: number, item: ITraktHistoryItem) {
    let history = this._getOrCreateHistory(traktId);
    if (!history.items) history.items = [];
    history.items.push(item);
    history.items.sort((a, b) => new Date(b.watched_at).valueOf() - new Date(a.watched_at).valueOf());
    this._update(traktId, history.items);
  }

  /** Remove a watched entry by its id */
  public async remove(historyId: number): Promise<void> {
    let result = await this._api.historyRemove(historyId);
    if (TraktApi.isError(result)) {
      console.error(`TraktRoller: Error removing scrobble (${result.error})`)
      return;
    } else if (result.not_found.ids.indexOf(historyId) >= 0) {
      console.warn(`TraktRoller: Could not remove history id ${historyId}, not found on server`);
    }

    outer:
    for (let traktId of Object.keys(this._histories)) {
      let history = this._histories[traktId];
      if (!history.items) continue;
      for (let i = 0; i < history.items.length; i++) {
        if (history.items[i].id === historyId) {
          history.items.splice(i, 1);
          this._update(history.traktId, history.items);
          break outer;
        }
      }
    }
  }

  /** Get notified when the history changes */
  public sub(traktId: number, callback: (history: ITraktHistoryItem[]) => void) {
    let history = this._getOrCreateHistory(traktId);
    history.subscribers.push(callback);
  }

  /** Remove a history subscriber */
  public unsub(traktId: number, callback: (history: ITraktHistoryItem[]) => void) {
    let history = this._histories[traktId];
    if (!history) return;

    let index = history.subscribers.indexOf(callback);
    if (index >= 0) history.subscribers.splice(index, 1);
  }

  private _getOrCreateHistory(traktId: number) {
    let history = this._histories[traktId];
    if (!history) {
      history = this._histories[traktId] = { traktId: traktId, items: null, subscribers: [] };
    }
    return history;
  }

  private _update(traktId: number, items: ITraktHistoryItem[]) {
    let history = this._getOrCreateHistory(traktId);
    history.items = items;
    for (let sub of history.subscribers) { sub(items); }
  }
}
