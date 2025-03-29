import PeriodicExec from "./periodic-exec";
import ConfigurationSettings from "./storage/ConfigurationSettings";
import Alarm = chrome.alarms.Alarm;
import NotificationHandler from "./handler/NotificationHandler";

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
        if (chrome.alarms) {
            console.log(chrome.alarms);
        } else {
            console.error("chrome.alarms ist nicht verfügbar!");
        }

        await this.notificationHandler.start();

        chrome.runtime.onInstalled.addListener(async () => {
            console.log("installed")
            const config = new ConfigurationSettings();
            await config.Store();
            const periodicExec = new PeriodicExec();
            await periodicExec.exec();
        });

        chrome.storage.local.onChanged.addListener(async changes => {
            if (!changes.changes){
                // Ignore non config changes
                return;
            }

            const config = changes.changes as ConfigurationSettings;
            // Alarm direkt beim Laden setzen (5 Minuten Wiederholungsintervall)
            await chrome.alarms.create('periodic-exec', {
                delayInMinutes: 0,
                periodInMinutes: 1//config.RefreshTimeInSeconds,
            });
        })


        chrome.alarms.onAlarm.addListener(this.execPeriodically);
// Alarm direkt beim Laden setzen (5 Minuten Wiederholungsintervall)
        await chrome.alarms.create('periodic-exec', {
            delayInMinutes: 0,
            periodInMinutes: 1,
        });
        console.log("started")

    }
}

new Main().main().then();
