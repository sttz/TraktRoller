/** Used by parcel to insert environment variables */
declare module process {
    var env: { [index: string]: string };
}
