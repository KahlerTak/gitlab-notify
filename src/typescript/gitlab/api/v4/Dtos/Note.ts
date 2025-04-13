import MergeRequestDto from "./MergeRequestDto";
import UserDto from "./User";

export default class NoteDto {
    public id: number = 0;
    public author: UserDto = new UserDto();
    public body: string = "";
    public resolvable: boolean = false;
    public resolved?: boolean = false;
    public system: boolean = false;
    public MergeRequest?: MergeRequestDto;
}

export const NoteDtoScheme = new NoteDto();
