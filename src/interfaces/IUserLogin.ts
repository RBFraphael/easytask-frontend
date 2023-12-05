import type { IUser } from "./IUser";

export interface IUserLogin {
    access_token: string;
    token_type: string;
    user: IUser;
    expires_in: number;
}
