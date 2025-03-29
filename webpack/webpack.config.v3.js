const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: {
        background: path.resolve(__dirname, "..", "src", "background.ts"),
        options: path.resolve(__dirname, "..", "src", "optionsLoader.tsx"), // Options-Seite
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
            patterns: [{ from: ".", to: ".", context: "public" }],
        }),
        new CopyPlugin({
            patterns: [{ from: "manifest.v3.json", to: "manifest.json", context: "public" }],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "src", "html", "options.html"),
            filename: "options.html",
            chunks: ["options"], // Nur das Options-Skript einfügen
        }),
    ],
};
