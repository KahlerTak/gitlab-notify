import PeriodicExec from "./periodic-exec";
import ConfigurationSettings from "./storage/ConfigurationSettings";
import NotificationHandler from "./handler/NotificationHandler";
import i18next from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import MergeRequestNotes from "./storage/MergeRequestNotes";
import MergeRequests from "./storage/MergeRequests";
import Alarm = chrome.alarms.Alarm;

class Main{
    private notificationHandler: NotificationHandler;
    private periodicExec: PeriodicExec;

    constructor(){
        this.notificationHandler = new NotificationHandler();
        this.periodicExec = new PeriodicExec();
    }

    private async execPeriodically(info: Alarm) {
        if (info.name !== "periodic-exec") {
            return;
        }

        await this.periodicExec.exec();
    }

    async main(){
        console.log("Background script loaded");
        await i18next
            .use(i18nextHttpBackend)
            .init({
                debug: true,
                lng: "en",
                fallbackLng: 'en',
                backend: {
                    loadPath: ([lng]: string[]) => chrome.runtime.getURL(`i18n/${lng}.json`),
                }
            });

        const action = chrome.action ? chrome.action : chrome.browserAction;

        action.onClicked.addListener(async () => {
            await chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
        });

        await this.notificationHandler.start();


        chrome.runtime.onInstalled.addListener(async () => {
            const config = await ConfigurationSettings.Load();
            await config.Store();
            await i18next.changeLanguage(config.Language ?? "en");
            const periodicExec = new PeriodicExec();
            await periodicExec.exec();
            console.log("Installed the plugin successfully")
        });

        chrome.storage.local.onChanged.addListener(async changes => {
            if (!changes.changes){
                // Ignore non config changes
                return;
            }

            const config = changes.changes as ConfigurationSettings;
            await i18next.changeLanguage(config.Language);

            // Alarm direkt beim Laden setzen (5 Minuten Wiederholungsintervall)
            await chrome.alarms.create('periodic-exec', {
                delayInMinutes: 0,
                periodInMinutes: 1//config.RefreshTimeInSeconds,
            });
        })


        chrome.alarms.onAlarm.addListener(info => this.execPeriodically(info));
        await chrome.alarms.create('periodic-exec', {
            delayInMinutes: 0,
            periodInMinutes: 1,
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log(message);
            if (message.action === 'refreshChecks') {
                this.periodicExec.exec().finally(() => {
                    sendResponse({ status: 'done' });
                });
                return true;
            }

            if (message.action === 'clearData') {
                const clear = async () => {
                    await MergeRequestNotes.Store([]);
                    await MergeRequests.Store([]);
                }

                clear().finally(() => {
                    sendResponse({ status: 'cleared' });
                });
                return true;
            }

            return false;
        });
        console.log("Main loop started successfully")

    }
}
//
export const main = new Main();
main.main().then()
