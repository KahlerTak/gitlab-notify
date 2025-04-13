import MergeRequestEventEmitter from "../events/MergeRequestEventEmitter";
import MergeRequestDto from "../gitlab/api/v4/Dtos/MergeRequestDto";
import ConfigurationSettings from "../storage/ConfigurationSettings";
import GitlabApiClient from "../gitlab/api/v4/GitlabClient";
import MergeRequests from "../storage/MergeRequests";
import {t} from "i18next"
import MergeRequestNoteEventEmitter from "../events/MergeRequestNoteEventEmitter";
import NotificationSettings from "../storage/NotificationSettings";

const notificationPrefix:string = "merge-request-notification-";
export default class NotificationHandler {
    public async start() {
        const mergeRequestEventEmitter = MergeRequestEventEmitter.getInstance();
        const notificationSettings = await NotificationSettings.Load();
        mergeRequestEventEmitter.onNewMergeRequest(async mr => {
            if (await notificationSettings.IsNotificationEnabled("new-review-merge-request", true)) {
                console.log("new review merge request");
                await this.notify(mr.id, mr, "notify.title.new_merge_request", "notify.message.new_merge_request")
            }
        });
        mergeRequestEventEmitter.onNewMergeRequestCommit(async mr => {
            if (await notificationSettings.IsNotificationEnabled("update-review-merge-request", true)) {
                console.log("update review merge request");
                await this.notify(mr.id, mr, "notify.title.new_merge_commit", "notify.message.new_merge_commit")
            }
        });

        const mergeRequestNoteEventEmitter = MergeRequestNoteEventEmitter.getInstance();
        mergeRequestNoteEventEmitter.onNewMergeRequestNote(async note => {
            if (await notificationSettings.IsNotificationEnabled("new-comment-on-own-merge-request", true)) {
                console.log("new comment on own merge request");
                await this.notify(note.id, note.MergeRequest!, "notify.title.new_merge_request_note", "notify.message.new_merge_request_note")
            }
        });
        mergeRequestNoteEventEmitter.onUpdateMergeRequestNote(async note => {
            if (await notificationSettings.IsNotificationEnabled("updated-comment-on-own-merge-request", true)) {
                console.log("updated comment on own merge request");
                await this.notify(note.id, note.MergeRequest!, "notify.title.update_merge_request_note", "notify.message.update_merge_request_note")
            }
        });

        chrome.notifications.onClicked.addListener(this.notificationClicked);
    }

    private async notificationClicked(notificationId: string) {

        if (!notificationId.startsWith(notificationPrefix)) {
            return;
        }

        const settings = await ConfigurationSettings.Load();
        const ids = notificationId.substring(notificationPrefix.length);
        const mrId = parseInt(ids.split("-")[0]);

        const mergeRequests = await MergeRequests.Load();
        const mergeRequest = mergeRequests.find(mr => mr.id === mrId);
        if (!mergeRequest) {
            return;
        }

        const gitlabClient = new GitlabApiClient();
        await gitlabClient.load();

        try {
            const project = await gitlabClient.getProject(mergeRequest.project_id);
            console.log(`https://${settings.Hostname}/${project.path_with_namespace}/-/merge_requests/${mergeRequest.iid}`);
            await chrome.tabs.create({url: `https://${settings.Hostname}/${project.path_with_namespace}/-/merge_requests/${mergeRequest.iid}`}); // Link öffnen
        } catch (e) {
            console.error(e);
        }
    }

    private async notify(uid: number, mergeRequest: MergeRequestDto, titleKey: string, messageKey: string) {
        console.log(`Create notification: ${notificationPrefix}${mergeRequest.id}-${uid}`);
        const data: Record<string, boolean> = await new Promise(resolve => { chrome.notifications.getAll((notifications: Object) => {
            resolve(notifications as Record<string, boolean>);
        }) });

        if (data[`${notificationPrefix}${mergeRequest.id}-${uid}`]){
            __DEV__ && console.log("do not resend notification");
            return;
        }
        chrome.notifications.create(
            `${notificationPrefix}${mergeRequest.id}-${uid}`,
            {
                type: "basic",
                title: t(titleKey).replace(/\{\s*mrTitle\s*}/, mergeRequest.title),
                message: t(messageKey).replace(/\{\s*mrTitle\s*}/, mergeRequest.title),
                iconUrl: "extension-icon-128.png"
            },
            function () {
            }
        );
    }
}
