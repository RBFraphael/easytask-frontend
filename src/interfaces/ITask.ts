import type { TaskStatus } from "../enums/TaskStatus";
import type { IComment } from "./IComment";
import type { IProject } from "./IProject";
import type { IUser } from "./IUser";

export interface ITask {
    id?: number;
    project_id: number|null;
    title: string;
    description: string;
    user_id: number|null;
    status: TaskStatus;
    project?: IProject;
    user?: IUser;
    comments?: IComment[];
}
