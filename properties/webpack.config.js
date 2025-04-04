const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                    mangle: true,
                    module: true, // <--- wichtig für ES Modules
                    format: {
                        comments: false, // <--- entfernt Kommentare
                    },
                },
            }),
        ],
    },
    entry: {
        background: path.resolve(__dirname, "..", "src", "typescript", "background.ts"),
        options: path.resolve(__dirname, "..", "src", "typescript", "optionsLoader.tsx"), // Options-Seite
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"], // React & TypeScript-Erweiterungen
    },
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
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..",  "src", "html", "options.html"),
            filename: "options.html",
            chunks: ["options"], // Nur das Options-Skript einfügen
        }),
    ],
};

module.exports = (env, argv) => {
    if (env.manifestVersion){
        console.log(`Manifest version ${env.manifestVersion} enabled`)
        config.plugins.push(new CopyPlugin({
            patterns: [{ from: `manifest.${env.manifestVersion}.json`, to: "manifest.json", context: "properties" }],
        }));
    }
    if (argv.mode === "development"){
        console.log("Development mode enabled")
        config.devtool = "cheap-source-map";
    }
    if (env.release){
        config.plugins.push(new WebpackZipPlugin({
            path: path.resolve(__dirname, "..", "release"),
            filename: `gitlab-notifications.${env.manifestVersion ?? "v3"}`,
            extension: "zip"
        }))
    }
    if (env.analyze){
        config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
};
