import MergeRequestDto from "./MergeRequestDto";

export default class NoteDto {
    public id: number = 0;
    public body: string = "";
    public resolvable: boolean = false;
    public resolved?: boolean = false;
    public system: boolean = false;
    public MergeRequest?: MergeRequestDto;
}

export const NoteDtoScheme = new NoteDto();
