import { writable } from "svelte/store";
import type { IUser } from "../interfaces/IUser";

export const user = writable<IUser|null>(null);