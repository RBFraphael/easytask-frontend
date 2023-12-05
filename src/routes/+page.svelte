<script lang="ts">
    import { user } from "$lib/store";
	import type { AxiosResponse } from "axios";
	import { PrivateApi } from "../services/ApiService";
	import type { IUser } from "../interfaces/IUser";
	import { UserRole } from "../enums/UserRole";
	import { goto } from "$app/navigation";
	
    let savedToken = localStorage.getItem("access_token");

    if($user == null){
        if(savedToken){
            PrivateApi.get("/auth/me").then((res: AxiosResponse<IUser>) => {
                user.set(res.data);

                switch(res.data.role){
                    case UserRole.ADMIN:
                        goto("/admin");
                        break;
                    case UserRole.MANAGER:
                        goto("/manager");
                        break;
                    case UserRole.OPERATIONAL:
                        goto("/operation");
                        break;
                }
            });
        } else {
            goto("/login");
        }
    } else {
        switch($user.role){
            case UserRole.ADMIN:
                goto("/admin");
                break;
            case UserRole.MANAGER:
                goto("/manager");
                break;
            case UserRole.OPERATIONAL:
                goto("/operation");
                break;
        }
    }
</script>