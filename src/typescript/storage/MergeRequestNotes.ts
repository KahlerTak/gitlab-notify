import NoteDto from "../gitlab/api/v4/Dtos/Note";
import GitlabApiClient from "../gitlab/api/v4/GitlabClient";
import MergeRequestNoteEventEmitter from "../events/MergeRequestNoteEventEmitter";

export default class MergeRequestNotes {
    private mergeRequestNoteEmitter: MergeRequestNoteEventEmitter;

    public constructor() {
        this.mergeRequestNoteEmitter = MergeRequestNoteEventEmitter.getInstance();
    }

    public async Update() {
        try {
            const firstRun = !(await MergeRequestNotes.IsInitialized());
            const oldMergeRequests = await MergeRequestNotes.Load();
            const client = new GitlabApiClient();
            await client.load();
            const newMergeRequestNotes = await client.getAssignedMergeRequestNotes();
            const user = await client.getCurrentUser();
            await MergeRequestNotes.Store(newMergeRequestNotes);

            if (firstRun){
                return;
            }

            for (const newMergeRequestNote of newMergeRequestNotes.filter(x => !x.system && x.author.id !== user.id )) {
                const existingMergeRequestNote = oldMergeRequests.find(mrn => mrn.id === newMergeRequestNote.id);
                if (!existingMergeRequestNote) {
                    await this.mergeRequestNoteEmitter.emitNewMergeRequestNote(newMergeRequestNote);
                }

                if (existingMergeRequestNote && existingMergeRequestNote.body !== newMergeRequestNote.body) {
                    await this.mergeRequestNoteEmitter.emitUpdateMergeRequestNote(newMergeRequestNote, existingMergeRequestNote);
                }
            }

        } catch (e) {
            console.error(e);
        }
    }


    public static async IsInitialized(): Promise<boolean> {
        return await new Promise<boolean>((resolve) => {
            chrome.storage.local.get("MergeRequestNotes", (item) => {
                if (chrome.runtime.lastError) {
                    return resolve(false);
                }
                resolve(!!item["MergeRequestNotes"]);
            })
        });
    }

    public static async Load(): Promise<NoteDto[]> {
        return await new Promise<NoteDto[]>((resolve, reject) => {
            chrome.storage.local.get("MergeRequestNotes", (item) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve(item["MergeRequestNotes"] ?? []);
            })
        });
    }

    public static async Store(mergeRequestNotes: NoteDto[]) {
        return await new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({MergeRequestNotes: mergeRequestNotes}, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve();
            })
        });
    }
}
