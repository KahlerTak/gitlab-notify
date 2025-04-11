const fs = require("fs");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const packageJson = require("../package.json");

const TerserPluginOptions = {
    extractComments: false,
    terserOptions: {
        compress: false,
        mangle: true,
        module: true,
        format: {
            comments: false,
        },
    },
};

const OutputOptions = {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
    module: true,
    library: {
        type: "module"
    }
};

const ExperimentalOptions = {
    outputModule: true
};

const ResolveOptions = {
    extensions: [".tsx", ".ts", ".js"], // React & TypeScript-Erweiterungen
    mainFields: ['browser', 'module', 'main'], //
};

const HtmlWebPluginOptions = {
    template: path.resolve(__dirname, "..", "src", "html", "options.html"),
    filename: "options.html",
    chunks: ["options"], // Nur das Options-Skript einfügen
    scriptLoading: "module"
}

const ModuleBuilder = (env, argv) => {
    const config = {
        optimization: {
            splitChunks: false,
            minimize: true,
            minimizer: [
                new TerserPlugin(TerserPluginOptions)
            ],
        },
        entry: {
            background: path.resolve(__dirname, "..", "src", "typescript", "background.ts"),
            options: path.resolve(__dirname, "..", "src", "typescript", "optionsLoader.tsx"), // Options-Seite
        },
        output: OutputOptions,
        experiments: ExperimentalOptions,
        resolve: ResolveOptions,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*', '!manifest.json']
            }),
            new CopyPlugin({
                patterns: [{
                    from: ".",
                    to: ".",
                    context: "public"
                }],
            }),
            new CopyPlugin({
                patterns: [{
                    from: ".",
                    to: "i18n",
                    context: "i18n"
                }],
            }),
            new HtmlWebpackPlugin(HtmlWebPluginOptions),
        ],
    };

    if (env.manifestVersion) {
        const manifestFileContent = fs.readFileSync(path.resolve(__dirname, `manifest.${env.manifestVersion}.json`));
        const manifestOutputPath = path.resolve(__dirname, "../dist/manifest.json");
        const manifest = JSON.parse(manifestFileContent);

        console.log(`Manifest version ${env.manifestVersion} enabled`)
        manifest.version = packageJson.version;
        fs.writeFileSync(manifestOutputPath, JSON.stringify(manifest, null, 2));
    }
    if (argv.mode === "development") {
        console.log("Development mode enabled")
        config.devtool = "cheap-source-map";
    }
    if (env.release) {
        console.log("Compile for release");
        config.plugins.push(new WebpackZipPlugin({
            path: path.resolve(__dirname, "..", "release"),
            filename: `gitlab-notifications.${packageJson.version}-${env.manifestVersion}`,
            extension: "zip"
        }))
    }
    if (env.analyze) {
        console.log("Analyze webpack builds...");
        config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
}

// noinspection WebpackConfigHighlighting
module.exports = {
    TerserPluginOptions: TerserPluginOptions,
    OutputOptions: OutputOptions,
    ModuleBuilder: ModuleBuilder,
    ExperimentalOptions: ExperimentalOptions,
    ResolveOptions: ResolveOptions,
    HtmlWebPluginOptions: HtmlWebPluginOptions,
};
