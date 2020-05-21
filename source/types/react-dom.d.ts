// Remaps "preact/compat" to "react-dom" for Typescript,
// for bundling, Parcel's aliasing is defined in package.json
declare module "react-dom" {
    export { render, hydrate, unmountComponentAtNode, findDOMNode, createPortal } from "preact/compat";
}