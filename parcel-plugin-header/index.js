const path = require('path');
const json5 = require('json5');
const fs = require('fs');

function lineCounter(string) {
    let lines = 1;
    for (let i = 0; i < string.length; i++) {
        if (string.charAt(i) === '\n') {
        lines++;
        }
    }
    return lines;
}

module.exports = function(bundler) {
    let jsPackager = bundler.packagers.get('js');
    if (!jsPackager) {
        console.error("parcel-plugin-header: Could not get parcel's base JS loader.");
        return;
    }

    class HeaderJSPackager extends jsPackager {
        async start() {
            let cwd = process.cwd();

            let header = "";
            let pkgPath = path.join(cwd, "package.json");
            if (fs.existsSync(pkgPath)) {
                let pkgData = fs.readFileSync(pkgPath).toString();
                let pkg = json5.parse(pkgData);
                let headerField = pkg.header;
                if (headerField) {
                    if (fs.existsSync(headerField)) {
                        header = fs.readFileSync(headerField).toString();
                    } else {
                        header = headerField;
                    }
                }
            }

            await this.dest.write(header);
            await super.start();
            this.lineOffset += lineCounter(header);
        }
    }

    bundler.packagers.add('js', HeaderJSPackager);
}