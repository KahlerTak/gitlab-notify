import MergeRequestEventEmitter from "../events/MergeRequestEventEmitter";
import MergeRequestDto from "../gitlab/api/v4/Dtos/MergeRequestDto";
import ConfigurationSettings from "../storage/ConfigurationSettings";
import GitlabApiClient from "../gitlab/api/v4/GitlabClient";
import MergeRequests from "../storage/MergeRequests";
import {t} from "i18next"

export default class NotificationHandler {


    public async start() {
        const emitter = MergeRequestEventEmitter.getInstance();
        emitter.onNewMergeRequest(this.notify);
        emitter.onNewMergeRequestCommit(this.notify);

        chrome.notifications.onClicked.addListener(this.notificationClicked);
    }

    private async notificationClicked(notificationId: string) {

        if (!notificationId.startsWith("new-merge-commit-")) {
            return;
        }

        const settings = await ConfigurationSettings.Load();
        const id = parseInt(notificationId.substring("new-merge-commit-".length));

        const mergeRequests = await MergeRequests.Load();
        const mergeRequest = mergeRequests.find(mr => mr.id === id);
        if (!mergeRequest) {
            return;
        }

        const gitlabClient = new GitlabApiClient();
        await gitlabClient.load();

        try {
            const project = await gitlabClient.getProject(mergeRequest.project_id);
            await chrome.tabs.create({url: `https://${settings.Hostname}/${project.path_with_namespace}/-/merge_requests/${mergeRequest.iid}`}); // Link öffnen
        } catch (e) {
            console.error(e);
        }
    }

    private async notify(newMergeRequest: MergeRequestDto, _: MergeRequestDto) {
        chrome.notifications.create(
            `new-merge-commit-${newMergeRequest.id}`,
            {
                type: "basic",
                title: t("notify.title.new_merge_commit").replace(/\{\s*mrTitle\s*}/, newMergeRequest.title),
                message: t("notify.message.new_merge_commit").replace(/\{\s*mrTitle\s*}/, newMergeRequest.title),
                iconUrl: "extension-icon-128.png"
            },
            function () {
            }
        );
    }
}
