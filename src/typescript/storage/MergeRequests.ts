import MergeRequestDto from "../gitlab/api/v4/Dtos/MergeRequestDto";
import GitlabApiClient from "../gitlab/api/v4/GitlabClient";
import MergeRequestEventEmitter from "../events/MergeRequestEventEmitter";


export default class MergeRequests {
    private mergeRequestEmitter: MergeRequestEventEmitter;

    public constructor() {
        this.mergeRequestEmitter = MergeRequestEventEmitter.getInstance();
    }

    public async Update() {
        try {
            const firstRun = !(await MergeRequests.IsInitialized());
            const oldMergeRequests = await MergeRequests.Load();
            const client = new GitlabApiClient();
            await client.load();
            const newMergeRequests = await client.getReviewerMergeRequests();
            await MergeRequests.Store(newMergeRequests);
            if (firstRun){
                return;
            }

            for (const newMergeRequest of newMergeRequests) {
                const existingMergeRequest = oldMergeRequests.find(mr => mr.id === newMergeRequest.id);
                if (existingMergeRequest && newMergeRequest.sha !== existingMergeRequest.sha) {
                    await this.mergeRequestEmitter.emitNewMergeRequestCommit(newMergeRequest, existingMergeRequest);
                } else if (!existingMergeRequest) {
                    await this.mergeRequestEmitter.emitNewMergeRequest(newMergeRequest);
                }

                await new Promise(r => setTimeout(r, 50));
            }

            oldMergeRequests.filter(mergeRequest => !newMergeRequests.find(newMr => newMr.id === mergeRequest.id))
                .forEach(mergeRequest => this.mergeRequestEmitter.emitDeleteMergeRequest(mergeRequest));
        } catch (e) {
            console.error(e);
        }
    }

    public static async IsInitialized(): Promise<boolean> {
        return await new Promise<boolean>((resolve) => {
            chrome.storage.local.get("MergeRequests", (item) => {
                if (chrome.runtime.lastError) {
                    return resolve(false);
                }
                resolve(!!item["MergeRequests"]);
            })
        });
    }

    public static async Load(): Promise<MergeRequestDto[]> {
        return await new Promise<MergeRequestDto[]>((resolve, reject) => {
            chrome.storage.local.get("MergeRequests", (item) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve(Array.from(item["MergeRequests"] ?? []));
            })
        });
    }

    public static async Store(mergeRequests: MergeRequestDto[]) {
        return await new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({MergeRequests: mergeRequests}, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve();
            })
        });
    }

}
