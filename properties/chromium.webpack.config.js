const {
    ModuleBuilder,
    TerserPluginOptions,
    OutputOptions,
    ExperimentalOptions,
    HtmlWebPluginOptions,
    GenerateManifestPluginOptions
} = require("./webpack-builder");

TerserPluginOptions.terserOptions.module = true;
ExperimentalOptions.outputModule = true;
OutputOptions.module = true;
OutputOptions.library = {type: "module"}; // Set to default value
HtmlWebPluginOptions.scriptLoading =  "module";
GenerateManifestPluginOptions.manifestTemplatePath = "manifest.v3.json";

module.exports = ModuleBuilder;
