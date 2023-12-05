<script lang="ts">
	import { user } from "$lib/store";
	import type { AxiosResponse } from "axios";
	import { PrivateApi } from "../../services/ApiService";
	import { goto } from "$app/navigation";

    PrivateApi.post("/auth/logout", {}).then((res: AxiosResponse) => {
        user.set(null);
        localStorage.removeItem("access_token");
        goto("/");
    });
</script>