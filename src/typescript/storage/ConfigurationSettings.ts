export type Language = "de"|"en";

export default class ConfigurationSettings{
    public ApiToken: string = "";
    public RefreshTimeInSeconds: number = 10;
    public Hostname: string = "";
    public Language: Language = "en";

    public async Store(){
        return ConfigurationSettings.Store(this);
    }

    public static async Load(){
        return await new Promise<ConfigurationSettings>((resolve, reject) => {
            chrome.storage.local.get("settings", (item) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                if(item["settings"]){
                    const config = Object.setPrototypeOf(item["settings"], ConfigurationSettings.prototype);

                    return resolve(config);
                }

                return resolve(new ConfigurationSettings());
            })
        });
    }
    public static async Store(configurationSettings: ConfigurationSettings){
        return await new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({settings: configurationSettings}, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve();
            })
        });
    }
}
