export default class MergeRequestDto {
    public id: number = 0;
    public iid: number = 0;
    public project_id: number = 0;
    public title: string = "";
    public sha: string = "";
}

export const MergeRequestDtoScheme = new MergeRequestDto();
