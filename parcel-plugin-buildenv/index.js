const path = require("path");
const loadEnv = require.main.require("../src/utils/env");
const config = require.main.require("../src/utils/config");

module.exports = async function(bundler) {
  let relative = path.join(bundler.options.rootDir, 'index');
  let pkg = await config.load(relative, ['package.json']);
  if (!pkg) {
    console.error("parcel-plugin-buildenv: Could not find package.json.");
    return;
  }

  let env = bundler.options.env;
  if (!env) {
    await loadEnv(path.join(bundler.options.rootDir, "index"));
    env = process.env;
  }

  env["VERSION"] = pkg.version;
  env["BUILD_DATE"] = new Date().toISOString();

  bundler.options.env = env;
}