{#if authorized}
    <slot />
{/if}

<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/store";

    let accessToken = localStorage.getItem("access_token");
    let authorized = false;
	
    if($user !== null || accessToken !== null){
        goto("/");
    } else {
        authorized = true;
    }
</script>