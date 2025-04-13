const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");
const webpack = require("webpack");

const DefaultOptions = {
    manifestTemplatePath: "manifest.json",
    manifestVersion: packageJson.version,
    manifestVersionExt: undefined,
};

class GenerateManifestPlugin {
    constructor(options) {
        this.options = {...DefaultOptions, ...options};
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap("GenerateJsonPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: "GenerateJsonPlugin",
                    stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                () => {
                    const manifestTemplatePath = path.resolve(__dirname, this.options.manifestTemplatePath);
                    const manifestFileContent = fs.readFileSync(manifestTemplatePath);
                    const manifest = JSON.parse(manifestFileContent);
                    const extendedTitle = `${manifest.name} (${this.options.manifestVersionExt})`;
                    const hasTitleExtension = !!this.options.manifestVersionExt;
                    manifest.name = (hasTitleExtension ? extendedTitle : manifest.name);
                    manifest.version = this.options.manifestVersion;
                    compilation.emitAsset("manifest.json", new webpack.sources.RawSource(JSON.stringify(manifest, null, 2)));

                });
        });
    }
}

module.exports = GenerateManifestPlugin;
