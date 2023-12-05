<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<h1>{ greetings($user) }</h1>
<h3 class="text-muted">Bem-vindo ao seu Dashboard.</h3>

<script>
	import { user } from "$lib/store";
	import { greetings } from "../../../helpers/Greetings";
</script>