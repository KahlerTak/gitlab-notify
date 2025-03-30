import MergeRequestDto from "../gitlab/api/v4/Dtos/MergeRequestDto";
import GitlabApiClient from "../gitlab/api/v4/GitlabClient";
import MergeRequestEventEmitter from "../events/MergeRequestEventEmitter";


export default class MergeRequests{
    private mergeRequestEmitter: MergeRequestEventEmitter;

    public constructor() {
        this.mergeRequestEmitter = MergeRequestEventEmitter.getInstance();
    }

    public async Update(){
        const oldMergeRequests = await MergeRequests.Load();
        const client = new GitlabApiClient();
        await client.configure()
        const newMergeRequests = await client.getMergeRequests();
        await MergeRequests.Store(newMergeRequests);
        console.log(oldMergeRequests)
        console.log(newMergeRequests)
        for (const newMergeRequest of newMergeRequests){
            const existingMergeRequest = oldMergeRequests.find(mr => mr.id === newMergeRequest.id);
            if (existingMergeRequest && newMergeRequest.sha !== existingMergeRequest.sha){
                await this.mergeRequestEmitter.emitNewMergeRequestCommit(newMergeRequest, existingMergeRequest);
            }

            if (!existingMergeRequest){
                await this.mergeRequestEmitter.emitNewMergeRequest(newMergeRequest);
            }
        }

        oldMergeRequests.filter(mergeRequest => !newMergeRequests.find(newMr => newMr.id === mergeRequest.id))
            .forEach(mergeRequest => this.mergeRequestEmitter.emitDeleteMergeRequest(mergeRequest));

    }

    public static async Load(): Promise<MergeRequestDto[]>{
        return await new Promise<MergeRequestDto[]>((resolve, reject) => {
            chrome.storage.local.get("MergeRequests", (item) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve(item["MergeRequests"] ?? []);
            })
        });
    }
    public static async Store(mergeRequests: MergeRequestDto[]){
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
