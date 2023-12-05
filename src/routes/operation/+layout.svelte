<AuthGuard role={UserRole.OPERATIONAL}>
    <AdminPanel color="dark" links={links}>
        <slot/>
    </AdminPanel>
</AuthGuard>

<script lang="ts">
    import AuthGuard from "../../guard/AuthGuard.svelte";
    import AdminPanel from "../../components/AdminPanel.svelte";
	import { UserRole } from "../../enums/UserRole";
	import type { IAdminSidebarLink } from "../../interfaces/IAdminSidebarLink";
	import { faCubesStacked, faGauge, faListCheck } from "@fortawesome/free-solid-svg-icons";

    let links: IAdminSidebarLink[] = [
        { icon: faGauge, label: "Dashboard", link: "/operation/dashboard" },
        { icon: faCubesStacked, label: "Projetos", link: "/operation/projects" },
        { icon: faListCheck, label: "Tarefas", link: "/operation/tasks" }
    ];
</script>