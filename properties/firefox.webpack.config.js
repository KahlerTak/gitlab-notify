const {ModuleBuilder, TerserPluginOptions, OutputOptions, ExperimentalOptions, HtmlWebPluginOptions} = require("./webpack-builder");

TerserPluginOptions.terserOptions.module = false;
ExperimentalOptions.outputModule = false;
OutputOptions.module = false;
delete OutputOptions.library; // Set to default value
delete HtmlWebPluginOptions.scriptLoading; // Set to default value

module.exports = ModuleBuilder;
