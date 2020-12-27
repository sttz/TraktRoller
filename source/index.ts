import TraktRoller, { ITraktRollerOptions } from "./TraktRoller";
import { GreaseMonkeyStorageAdapter } from "./TraktApi";

import Crunchyroll from "./websites/Crunchyroll";
import Funimation from "./websites/Funimation";

const options: ITraktRollerOptions = {
  client_id: "5ac1bf2ba188fc93f941eb0788ef5cb6e0e4bf96b882e914e6d0c17dacc8e7f2",
  client_secret: "3712241a1c467769e6c03336abb5fb9911f8665354d2aaffaa9f817e147a34ca",
  storage: new GreaseMonkeyStorageAdapter(),
  redirect_url: "",
  website: undefined,
};

const origin = window.location.origin;
if (origin == "https://www.crunchyroll.com") {
  options.redirect_url = "https://www.crunchyroll.com";
  options.website = new Crunchyroll();

} else if (origin == "https://www.funimation.com") {
  if (unsafeWindow.videojs) {
    Funimation.createPlayerAdapter(unsafeWindow.videojs);
  } else {
    options.redirect_url = "https://www.funimation.com";
    options.website = new Funimation();
  }
}

if (options.website) {
  new TraktRoller(options);
}
