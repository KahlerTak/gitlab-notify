import MergeRequestDto from "../gitlab/api/v4/Dtos/MergeRequestDto";

type MergeRequestUpdateEvent = (newValue: MergeRequestDto, oldValue: MergeRequestDto) => void | Promise<void>;
type MergeRequestEvent = (newValue: MergeRequestDto, oldValue: MergeRequestDto) => void | Promise<void>;

export default class MergeRequestEventEmitter {
    private static instance: MergeRequestEventEmitter;
    private events: Record<string, Function[]> = {};

    private constructor() {}

    // Singleton-Instanz abrufen
    public static getInstance(): MergeRequestEventEmitter {
        if (!MergeRequestEventEmitter.instance) {
            MergeRequestEventEmitter.instance = new MergeRequestEventEmitter();
        }
        return MergeRequestEventEmitter.instance;
    }

    public onNewMergeRequestCommit(listener: MergeRequestUpdateEvent){
        this.on("new-merge-request-commit", listener);
    }

    public async emitNewMergeRequestCommit(newMergeRequest: MergeRequestDto, oldMergeRequest: MergeRequestDto){
        await this.emit("new-merge-request-commit", newMergeRequest, oldMergeRequest)
    }

    public onNewMergeRequest(listener: MergeRequestEvent){
        this.on("new-merge-request", listener);
    }

    public async emitNewMergeRequest(mergeRequest: MergeRequestDto){
        await this.emit("new-merge-request", mergeRequest);
    }

    public async emitDeleteMergeRequest(mergeRequest: MergeRequestDto){
        await this.emit("delete-merge-request", mergeRequest);
    }

    public onDeletedMergeRequest(listener: MergeRequestEvent){
        this.on("delete-merge-request", listener);
    }


    private on(event: string, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    private async emit(event: string, ...args: any[]) {
        const listeners = this.events[event];
        console.log("emitted event", event);
        if (listeners) {
            for (const listener of listeners){
                const result = listener(...args);
                if (result instanceof Promise){
                    await result;
                }
            }
        }
    }
}
