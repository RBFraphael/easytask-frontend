<AuthGuard role={UserRole.MANAGER}>
    <AdminPanel color="secondary" links={links}>
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
        { icon: faGauge, label: "Dashboard", link: "/manager/dashboard" },
        { icon: faCubesStacked, label: "Projetos", link: "/manager/projects" },
        { icon: faListCheck, label: "Tarefas", link: "/manager/tasks" }
    ];
</script>