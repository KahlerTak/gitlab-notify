import MergeRequests from "./storage/MergeRequests";
import ConfigurationSettings from "./storage/ConfigurationSettings";
import i18next from "i18next";
import StringUtils from "./uitls/StringUtils";

export default class PeriodicExec{
    private mergeRequest: MergeRequests;
    public constructor() {
        this.mergeRequest = new MergeRequests();
    }
    public async exec(): Promise<void>{
        const config = await ConfigurationSettings.Load();
        await i18next.changeLanguage(config.Language);
        if (StringUtils.isNullOrWhitespace(config.ApiToken) || StringUtils.isNullOrWhitespace(config.Hostname)){
            return;
        }
        await this.mergeRequest.Update();
    }

}
