import ConfigurationSettings from "../../../storage/ConfigurationSettings";
import MergeRequestDto, {MergeRequestDtoScheme} from "./Dtos/MergeRequestDto";
import UserDto, {UserDtoScheme} from "./Dtos/User";
import ProjectDto, {ProjectDtoScheme} from "./Dtos/Project";
import DiscussionDto from "./Dtos/Discussion";
import NoteDto, {NoteDtoScheme} from "./Dtos/Note";
import ObjectSanitizer from "../../../uitls/ObjectSanitizer";

export default class GitlabApiClient {
    private host: string = "";
    private apiToken: string = "";

    public configure(host: string, apiToken: string) {
        this.host = host;
        this.apiToken = apiToken;
    }

    public async load() {
        const config = await ConfigurationSettings.Load();
        this.configure(config.Hostname, config.ApiToken);
    }

    public async getProject(id: number) {
        const project = await this.apiGetRequest<ProjectDto>(`projects/${id}`);
        if (project === null) {
            throw new Error("Unable to get project");
        }
        return ObjectSanitizer.sanitizeObject(project, ProjectDtoScheme);
    }

    public async getCurrentUser(): Promise<UserDto> {
        const user = await this.apiGetRequest<UserDto>("user");
        if (user === null) {
            throw new Error("Unable to get user");
        }
        return ObjectSanitizer.sanitizeObject(user, UserDtoScheme);
    }

    public async getReviewerMergeRequests(): Promise<MergeRequestDto[]> {
        const user = await this.getCurrentUser();
        const mrs = await this.apiGetRequest<MergeRequestDto[]>(`merge_requests?reviewer_username=${user.username}&scope=all&state=opened&wip=no`);
        if (mrs === null) {
            throw new Error("Unable to get merge requests");
        }
        return ObjectSanitizer.sanitizeObject(Array.from(mrs), [MergeRequestDtoScheme]);
    }

    public async getAssignedMergeRequests(): Promise<MergeRequestDto[]> {
        const mrs = await this.apiGetRequest<MergeRequestDto[]>(`merge_requests?scope=assigned_to_me&state=opened`);
        if (mrs === null) {
            throw new Error("Unable to get merge requests");
        }
        return ObjectSanitizer.sanitizeObject(Array.from(mrs), [MergeRequestDtoScheme]);
    }

    public async getAssignedMergeRequestNotes() {
        const mergeRequests = await this.getAssignedMergeRequests();
        let mergeRequestNotes: NoteDto[] = [];
        for (const mergeRequestDto of mergeRequests) {
            const projectId = mergeRequestDto.project_id;
            const mergeRequestIid = mergeRequestDto.iid;
            const discussion = await this.apiGetRequest<DiscussionDto>(`/projects/${projectId}/merge_requests/${mergeRequestIid}/discussions`);
            const extraNotes = await this.apiGetRequest<NoteDto[]>(`/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`) ?? [];
            const discussionNotes = discussion?.notes ?? [];
            discussionNotes.forEach(note => note.MergeRequest = mergeRequestDto);
            extraNotes.forEach(note => note.MergeRequest = mergeRequestDto);
            mergeRequestNotes = [...mergeRequestNotes, ...discussionNotes, ...extraNotes];
        }

        return ObjectSanitizer.sanitizeObject(Array.from(mergeRequestNotes), [NoteDtoScheme]);
    }

    private async apiGetRequest<T>(request: string): Promise<T | null> {
        const response = await fetch(
            `https://${this.host}/api/v4/${request}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiToken}`,
                },
            }
        )

        if (!response.ok) {
            console.error("Unable to get request: " + request);
            return null;
        }

        const data = await response.json();
        return data as T;
    }
}
