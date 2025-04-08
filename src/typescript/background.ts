import PeriodicExec from "./periodic-exec";
import ConfigurationSettings from "./storage/ConfigurationSettings";
import Alarm = chrome.alarms.Alarm;
import NotificationHandler from "./handler/NotificationHandler";
import i18next from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import {initReactI18next} from "react-i18next";

class Main{
    private notificationHandler: NotificationHandler;

    constructor(){
        this.notificationHandler = new NotificationHandler();
    }

    private async execPeriodically(info: Alarm) {
        if (info.name !== "periodic-exec") {
            return;
        }

        const periodicExec = new PeriodicExec();
        await periodicExec.exec();
    }

    async main(){
        console.log("Background script loaded");
        await i18next
            .use(i18nextHttpBackend)
            .use(initReactI18next)
            .init({
                lng: 'en', // Standard-Sprache
                fallbackLng: 'en', // Fallback-Sprache, wenn keine Übersetzung für die gewählte Sprache vorhanden ist
                backend: {
                    loadPath: '/i18n/{{lng}}.json', // Pfad zu den Übersetzungsdateien
                },
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


        chrome.alarms.onAlarm.addListener(this.execPeriodically);
        await chrome.alarms.create('periodic-exec', {
            delayInMinutes: 0,
            periodInMinutes: 1,
        });
        console.log("Main loop started successfully")

    }
}
//
export const main = new Main();
main.main().then()
