{#if authorized}
    <slot/>
{/if}

<script lang="ts">
	import { user } from "$lib/store";
	import type { AxiosResponse } from "axios";
	import { PrivateApi } from "../services/ApiService";
	import type { IUser } from "../interfaces/IUser";
	import type { UserRole } from "../enums/UserRole";
	import { goto } from "$app/navigation";

    export let role: UserRole;

    let authorized = false;
    let savedToken = localStorage.getItem("access_token");

    if($user == null){
        if(savedToken){
            PrivateApi.get("/auth/me").then((res: AxiosResponse<IUser>) => {
                user.set(res.data);
                if(res.data.role == role){
                    authorized = true;
                } else {
                    goto("/");
                }
            });
        } else {
            goto("/login");
        }
    } else {
        if($user?.role == role){
            authorized = true;
        } else {
            goto("/");
        }
    }
</script>