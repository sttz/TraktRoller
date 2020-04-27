declare module 'player.js' {
  enum EVENTS {
    /** fired when the media is ready to receive commands */
    READY = 'ready',
    /** fires when the video starts to play */
    PLAY = 'play',
    /** fires when the video is paused */
    PAUSE = 'pause',
    /** fires when the video is finished */
    ENDED = 'ended',
    /** fires during playback (arg: {seconds: number, duration: number}) */
    TIMEUPDATE = 'timeupdate',
    /** fires when the media is loading additional media for playback (arg: {percent: number}) */
    PROGRESS = 'progress',
    /** fires when an error occurs */
    ERROR = 'error'
  }
  
  class Player {
    /** Create a new player with an iframe id */
    constructor(id: string | HTMLElement);
    /** Play the media */
    play(): void;
    /** Pause the media */
    pause(): void;
    /** Determine if the media is paused */
    getPaused(callback: (paused: boolean)=> void): void;
    /** Mute the media */
    mute(): void;
    /** Unmute the media */
    unmute(): void;
    /** Determine if the media is muted */
    getMuted(callback: (muted: boolean)=> void): void;
    /** Set the volume. Value needs to be between 0-100 */
    setVolume(volume: number): void;
    /** Get the volume. Value will be between 0-100 */
    getVolume(callback: (volume: number)=> void): void;
    /** Get the duration of the media is seconds */
    getDuration(callback: (duration: number)=> void): void;
    /** Perform a seek to a particular time in seconds */
    setCurrentTime(time: number): void;
    /** Get the current time in seconds of the video */
    getCurrentTime(callback: (time: number)=> void): void;
    /** Remove an event listener. If the listener is specified it should remove only that listener, otherwise remove all listeners */
    off(event: string, callback?: Function): void;
    /** Add an event listener */
    on(event: string, callback: Function): void;
    /** Determines if the player supports a given event or method */
    supports(type: 'method' | 'event', name: string): boolean;
  }

  class VideoJSAdapter {
    constructor(videojs: any);
    ready(): void;
  }
}