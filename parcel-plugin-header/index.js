const path = require('path');
const fs = require('fs');
const config = require.main.require("../src/utils/config");

function lineCounter(string) {
  let lines = 1;
  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) === '\n') {
      lines++;
    }
  }
  return lines;
}

module.exports = async function(bundler) {
  let jsPackager = bundler.packagers.get('js');
  if (!jsPackager) {
    console.error("parcel-plugin-header: Could not get parcel's base JS loader.");
    return;
  }

  let relative = path.join(bundler.options.rootDir, 'index');
  let pkg = await config.load(relative, ['package.json']);
  if (!pkg) {
    console.error("parcel-plugin-header: Could not find package.json.");
    return;
  }

  let header;
  let headerField = pkg.header;
  if (headerField) {
    if (fs.existsSync(headerField)) {
      header = fs.readFileSync(headerField).toString();
    } else {
      header = headerField;
    }
  }

  if (!header) {
    console.error("parcel-plugin-header: Header field not set in package.json.");
    return;
  }

  let headerLines = lineCounter(header);
  
  class HeaderJSPackager extends jsPackager {
    async start() {
      await this.dest.write(header);
      await super.start();
      this.lineOffset += headerLines;
    }
  }
  
  bundler.packagers.add('js', HeaderJSPackager);
}