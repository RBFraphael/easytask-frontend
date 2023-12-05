<AuthGuard role={UserRole.ADMIN}>
    <AdminPanel color="primary" links={links}>
        <slot/>
    </AdminPanel>
</AuthGuard>

<script lang="ts">
    import AuthGuard from "../../guard/AuthGuard.svelte";
    import AdminPanel from "../../components/AdminPanel.svelte";
	import { UserRole } from "../../enums/UserRole";
	import type { IAdminSidebarLink } from "../../interfaces/IAdminSidebarLink";
	import { faCubesStacked, faGauge, faListCheck, faUsers } from "@fortawesome/free-solid-svg-icons";

    let links: IAdminSidebarLink[] = [
        { icon: faGauge, label: "Dashboard", link: "/admin/dashboard" },
        { icon: faCubesStacked, label: "Projetos", link: "/admin/projects" },
        { icon: faListCheck, label: "Tarefas", link: "/admin/tasks" },
        { icon: faUsers, label: "Usuários", link: "/admin/users" },
    ];
</script>