import MergeRequests from "./storage/MergeRequests";
import ConfigurationSettings from "./storage/ConfigurationSettings";
import i18next from "i18next";
import StringUtils from "./uitls/StringUtils";
import MergeRequestNotes from "./storage/MergeRequestNotes";

export default class PeriodicExec{
    private mergeRequest: MergeRequests;
    private mergeRequestNotes: MergeRequestNotes;
    public constructor() {
        this.mergeRequest = new MergeRequests();
        this.mergeRequestNotes = new MergeRequestNotes();
    }
    public async exec(): Promise<void>{
        console.log("start exec");
        const config = await ConfigurationSettings.Load();
        console.log("change language", config);
        await i18next.changeLanguage(config.Language);
        console.log("done changing language");
        if (StringUtils.isNullOrWhitespace(config.ApiToken) || StringUtils.isNullOrWhitespace(config.Hostname)){
            console.log("config is not valid");
            return;
        }
        console.log("update merge request");
        await this.mergeRequest.Update();

        console.log("update notest");
        await this.mergeRequestNotes.Update();
        console.log("done exec");
    }

}
