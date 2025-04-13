import NoteDto from "./Note";


export default class DiscussionDto {
    public id: string = "";
    public notes: NoteDto[] = [];
}

export const DiscussionDtoScheme = new DiscussionDto();
DiscussionDtoScheme.notes.push(new NoteDto());
