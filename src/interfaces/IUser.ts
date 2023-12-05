import type { UserRole } from "../enums/UserRole";
import type { IComment } from "./IComment";
import type { IProject } from "./IProject";
import type { ITask } from "./ITask";

export interface IUser {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    role: UserRole;
    projects?: IProject[];
    tasks?: ITask[];
    comments?: IComment[];
}
