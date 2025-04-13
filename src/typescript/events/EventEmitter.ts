export default class EventEmitter {
    private events: Record<string, Function[]> = {};

    protected on(event: string, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    protected async emit(event: string, ...args: any[]) {
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
