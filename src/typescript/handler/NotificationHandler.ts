import MergeRequestEventEmitter from "../events/MergeRequestEventEmitter";
import MergeRequestDto from "../gitlab/api/v4/Dtos/MergeRequestDto";
import ConfigurationSettings from "../storage/ConfigurationSettings";
import GitlabApiClient from "../gitlab/api/v4/GitlabClient";
import MergeRequests from "../storage/MergeRequests";
import {t} from "i18next"
import MergeRequestNoteEventEmitter from "../events/MergeRequestNoteEventEmitter";

export default class NotificationHandler {


    public async start() {
        const mergeRequestEventEmitter = MergeRequestEventEmitter.getInstance();
        mergeRequestEventEmitter.onNewMergeRequest(mr => this.notify(mr.id, mr, "notify.title.new_merge_commit", "notify.message.new_merge_commit"));
        mergeRequestEventEmitter.onNewMergeRequestCommit(mr => this.notify(mr.id, mr, "notify.title.new_merge_commit", "notify.message.new_merge_commit"));

        const mergeRequestNoteEventEmitter = MergeRequestNoteEventEmitter.getInstance();
        mergeRequestNoteEventEmitter.onNewMergeRequestNote(note => {
            console.log(note);
            this.notify(note.id, note.MergeRequest!, "notify.title.new_merge_request_note", "notify.message.new_merge_request_note")
        });
        mergeRequestNoteEventEmitter.onUpdateMergeRequestNote(note => {
            console.log(note);
            this.notify(note.id, note.MergeRequest!, "notify.title.new_merge_request_note", "notify.message.new_merge_request_note")
        });

        chrome.notifications.onClicked.addListener(this.notificationClicked);
    }

    private async notificationClicked(notificationId: string) {

        if (!notificationId.startsWith("new-merge-commit-")) {
            return;
        }

        const settings = await ConfigurationSettings.Load();
        const ids = notificationId.substring("new-merge-commit-".length);
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
        console.log(`Create notification: new-merge-commit-${mergeRequest.id}-${uid}`);
        chrome.notifications.create(
            `new-merge-commit-${mergeRequest.id}-${uid}`,
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
