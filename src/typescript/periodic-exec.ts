import MergeRequests from "./storage/MergeRequests";

export default class PeriodicExec{
    private mergeRequest: MergeRequests;
    public constructor() {
        this.mergeRequest = new MergeRequests();
    }
    public async exec(): Promise<void>{
        await this.mergeRequest.Update();
    }

}
