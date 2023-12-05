import type { ITask } from "./ITask";
import type { IUser } from "./IUser";

export interface IComment {
    id?: number;
    task_id: number;
    user_id: number;
    comment: string;
    created_at: string;
    task?: ITask;
    user?: IUser;
}
