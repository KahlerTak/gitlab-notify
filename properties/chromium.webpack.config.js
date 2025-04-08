const {ModuleBuilder, TerserPluginOptions, OutputOptions, ExperimentalOptions, HtmlWebPluginOptions} = require("./webpack-builder");

TerserPluginOptions.terserOptions.module = true;
ExperimentalOptions.outputModule = true;
OutputOptions.module = true;
OutputOptions.library = {type: "module"}; // Set to default value
HtmlWebPluginOptions.scriptLoading =  "module";

module.exports = ModuleBuilder;
