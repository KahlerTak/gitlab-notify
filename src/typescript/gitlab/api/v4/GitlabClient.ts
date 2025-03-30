import ConfigurationSettings from "../../../storage/ConfigurationSettings";
import MergeRequestDto from "./Dtos/MergeRequestDto";
import UserDto from "./Dtos/User";
import ProjectDto from "./Dtos/Project";

export default class GitlabApiClient{
    private host: string = "";
    private apiToken: string = "";

    public async configure() {
        const config = await ConfigurationSettings.Load();
        this.host = config.Hostname;
        this.apiToken = config.ApiToken;

    }

    public async getProject(id: number){
        const project = await this.apiGetRequest<ProjectDto>(`projects/${id}`);
        if (project === null){
            throw new Error("Unable to get project");
        }
        return project;
    }

    public async getCurrentUser(): Promise<UserDto> {
        const user = await this.apiGetRequest<UserDto>("user");
        if (user === null){
            throw new Error("Unable to get user");
        }
        return user;
    }

    public async getMergeRequests(): Promise<MergeRequestDto[]>{
        const user = await this.getCurrentUser();
        const mrs = await this.apiGetRequest<MergeRequestDto[]>(`merge_requests?reviewer_username=${user.username}&scope=all&state=opened`);
        if (mrs === null){
            throw new Error("Unable to get merge requests");
        }
        return Array.from(mrs);
    }

    private async apiGetRequest<T>(request: string): Promise<T|null>{
        try {
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

        if(!response.ok){
            console.error("Unable to get request: " + request);
            return null;
        }

        const data = await response.json();
        return data as T;


        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
