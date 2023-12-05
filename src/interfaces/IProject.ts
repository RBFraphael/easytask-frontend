import type { ITask } from "./ITask";
import type { IUser } from "./IUser";

export interface IProject {
    id?: number;
    user_id: number|null;
    label: string;
    user?: IUser;
    tasks?: ITask[];
}
