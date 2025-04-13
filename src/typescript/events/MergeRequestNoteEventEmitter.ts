import EventEmitter from "./EventEmitter";
import NoteDto from "../gitlab/api/v4/Dtos/Note";

type UpdateMergeRequestNoteEvent = (newValue: NoteDto, oldValue: NoteDto) => void | Promise<void>;
type NewMergeRequestNoteEvent = (newValue: NoteDto) => void | Promise<void>;

export default class MergeRequestNoteEventEmitter extends EventEmitter {
    private static instance: MergeRequestNoteEventEmitter;

    private constructor() {
        super();
    }

    public static getInstance(): MergeRequestNoteEventEmitter {
        if (!MergeRequestNoteEventEmitter.instance) {
            MergeRequestNoteEventEmitter.instance = new MergeRequestNoteEventEmitter();
        }
        return MergeRequestNoteEventEmitter.instance;
    }

    public onNewMergeRequestNote(listener: NewMergeRequestNoteEvent){
        this.on("new-merge-request-note", listener);
    }

    public async emitNewMergeRequestNote(newMergeRequestNote: NoteDto){
        await this.emit("new-merge-request-note", newMergeRequestNote)
    }

    public onUpdateMergeRequestNote(listener: UpdateMergeRequestNoteEvent){
        this.on("update-merge-request-note", listener);
    }

    public async emitUpdateMergeRequestNote(newMergeRequestNote: NoteDto, oldMergeRequestNote: NoteDto){
        await this.emit("update-merge-request-note", newMergeRequestNote, oldMergeRequestNote);
    }
}
