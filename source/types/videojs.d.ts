interface Window {
  readonly videojs?: videojs;
}

declare interface videojs {
    (id: string, options?: any, ready?: ()=>void): void;
}
