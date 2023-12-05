<style lang="scss">
    aside {
        width: 350px;
    }
</style>

<div class="admin-panel vh-100 vw-100 d-flex flex-column">
    <header class="p-3 bg-{color} flex-grow-0 flex-shrink-0">
        <div class="d-flex flex-row justify-content-between align-items-center">
            <div class="d-lg-none">
                <button class="btn btn-outline-light py-2 px-3 border-0" data-bs-toggle="offcanvas" data-bs-target="#mobile-menu" aria-controls="mobile-menu">
                    <FontAwesomeIcon icon={faBars} fixedWidth />
                </button>
            </div>
            <div>
                <img src="/assets/images/easytask-logo-light.traced.svg" alt="EasyTask Logo" class="img-fluid">
            </div>
            <div>
                <a href="/logout" class="btn btn-outline-light px-3">
                    <FontAwesomeIcon icon={faSignOutAlt} fixedWidth />
                    <span class="d-none d-lg-inline">Sair</span>
                </a>
            </div>
        </div>
    </header>
    <div class="content-wrapper flex-grow-1 d-flex flex-row overflow-hidden">
        <aside class="bg-{color} d-none d-lg-block flex-grow-0 flex-shrink-0 overflow-y-auto overflow-x-hidden">
            {#each links as link}
            <a href={link.link} class="btn btn-{color} text-start w-100">
                <FontAwesomeIcon icon={link.icon} fixedWidth /> { link.label }
            </a>
            {/each}
        </aside>
        <main class="flex-grow-1 p-3 overflow-y-auto overflow-x-hidden">
            <slot />
        </main>
    </div>
</div>

<div class="offcanvas offcanvas-start bg-{color}" tabindex="-1" id="mobile-menu" aria-labelledby="mobile-menu-label" bind:this={offcanvasEl}>
    <div class="offcanvas-header">
        <h3 class="offcanvas-title text-light" id="mobile-menu-label">Menu</h3>
        <button type="button" class="btn btn-outline-light btn-lg border-0" data-bs-dismiss="offcanvas" aria-label="Fechar">
            <FontAwesomeIcon icon={faTimes} fixedWidth />
        </button>
    </div>
    <div class="offcanvas-body px-0">
        {#each links as link}
            <a href={link.link} class="btn btn-{color} text-start w-100" on:click={() => closeMenu()}>
                <FontAwesomeIcon icon={link.icon} fixedWidth /> { link.label }
            </a>
        {/each}
    </div>
</div>

<script lang="ts">
	import { faBars, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import type { IAdminSidebarLink } from "../interfaces/IAdminSidebarLink";
	import { Offcanvas } from "bootstrap";

    export let color: string = "primary";
    export let links: IAdminSidebarLink[] = [];

    let offcanvasEl: HTMLElement|null;

    const closeMenu = () => {
        Offcanvas.getInstance(offcanvasEl).hide();
    }
</script>