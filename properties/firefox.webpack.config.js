const {
    ModuleBuilder,
    TerserPluginOptions,
    OutputOptions,
    ExperimentalOptions,
    HtmlWebPluginOptions,
    GenerateManifestPluginOptions
} = require("./webpack-builder");

TerserPluginOptions.terserOptions.module = false;
ExperimentalOptions.outputModule = false;
OutputOptions.module = false;
GenerateManifestPluginOptions.manifestTemplatePath = "manifest.v2.json";
delete OutputOptions.library; // Set to default value
delete HtmlWebPluginOptions.scriptLoading; // Set to default value

module.exports = ModuleBuilder;
