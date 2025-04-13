export type Notification = "new-review-merge-request"|"update-review-merge-request"|"new-comment-on-own-merge-request" | "updated-comment-on-own-merge-request";

export default class NotificationSettings{
    public registeredNotifications: Notification[] = [
        "new-review-merge-request",
        "new-comment-on-own-merge-request",
        "update-review-merge-request"
    ];

    public async AddNotification(notification: Notification, liveMode: boolean = false){
        if (!await this.IsNotificationEnabled(notification, liveMode)){
            this.registeredNotifications.push(notification);

            if (liveMode){
                await this.Store();
            }
        }
    }

    public async SetEnabled(notification: Notification, enabled: boolean, liveMode: boolean = false){
        if (enabled){
            await this.AddNotification(notification, liveMode);
        } else {
            await this.RemoveNotification(notification, liveMode);
        }
    }

    public async RemoveNotification(notification: Notification, liveMode: boolean = false){
        this.registeredNotifications = this.registeredNotifications.filter(n => n !== notification);
        if (liveMode){
            await this.Store();
        }
    }

    public async IsNotificationEnabled(notification: Notification, liveMode: boolean = false) {
        let settings: NotificationSettings = this;
        if (liveMode){
            settings = await NotificationSettings.Load();
            console.log("reloaded from disk ");
        }
        return settings.registeredNotifications.includes(notification);
    }

    public async Store(){
        return NotificationSettings.Store(this);
    }

    public static async Load(){
        return await new Promise<NotificationSettings>((resolve, reject) => {
            chrome.storage.local.get("notifications", (item) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                if(item["notifications"]){
                    const config = Object.setPrototypeOf(item["notifications"], NotificationSettings.prototype);

                    return resolve(config);
                }

                return resolve(new NotificationSettings());
            })
        });
    }
    public static async Store(configurationSettings: NotificationSettings){
        return await new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({notifications: configurationSettings}, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve();
            })
        });
    }
}
