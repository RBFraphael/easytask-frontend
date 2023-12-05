<svelte:head>
    <title>Projetos</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Projetos</h1>
        </div>
        <div>
            <a href="/admin/projects/new" class="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} fixedWidth />
                <span class="d-none d-lg-inline">Novo Projeto</span>
            </a>
        </div>
    </div>
    <div class="card shadow border-0">
        <div class="card-body">
            {#if isLoading}
            <div class="progress" role="progressbar" aria-label="Carregando" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
            </div>
            {/if}

            {#if show}
            <TableData data={projects} columns={columns} on:itemClick={onOpenProject} on:changePage={onChangePage} on:changePerPage={onChangePerPage} on:sort={onSort} />
            {/if}
        </div>
    </div>
</main>

<script lang="ts">
	import type { AxiosError, AxiosResponse } from "axios";
	import type { IProject } from "../../../interfaces/IProject";
	import { PrivateApi } from "../../../services/ApiService";
	import type { IApiError } from "../../../interfaces/IApiError";
	import { Alert } from "../../../helpers/Alert";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import { faPlus } from "@fortawesome/free-solid-svg-icons";
	import type { IPaginatedResult } from "../../../interfaces/IPaginatedResult";
    import TableData from "../../../components/TableData.svelte";
	import { goto } from "$app/navigation";
	import type { ITableDataColumn } from "../../../interfaces/ITableDataColumn";

    const columns: ITableDataColumn<IProject>[] = [
        {
            property: "id",
            title: "ID",
            sortable: true,
            value: (item: IProject) => item.id!.toString()
        },
        {
            property: "label",
            title: "Nome",
            sortable: true,
            value: (item: IProject) => item.label
        },
        {
            property: "user.first_name",
            title: "Responsável",
            sortable: false,
            value: (item: IProject) => `${item.user!.first_name} ${item.user!.last_name}`
        },
        {
            property: "id",
            title: "Tarefas",
            sortable: false,
            value: (item: IProject) => item.tasks!.length.toString()
        },
    ];

    let isLoading: boolean = false;
    let show: boolean = false;

    let projects: IPaginatedResult<IProject> = {
        current_page: 1, data: [], from: 1, last_page: 1,
        order: "ASC", order_by: "id", per_page: 10, to: 1, total: 0
    };

    const onOpenProject = (event: CustomEvent): void => {
        goto(`/admin/projects/${event.detail.item.id}`);
    }

    const onChangePage = (event: CustomEvent): void => {
        projects.current_page = event.detail.page;
        loadProjects();
    }

    const onSort = (event: CustomEvent): void => {
        projects.order = event.detail.order;
        projects.order_by = event.detail.column;
        loadProjects();
    }

    const onChangePerPage = (event: CustomEvent): void => {
        projects.per_page = event.detail.items;
        loadProjects();
    }

    const loadProjects = () => {
        isLoading = true;

        let queryParams = [
            "with=user,tasks",
            `page=${projects.current_page}`,
            `per_page=${projects.per_page}`,
            `order=${projects.order}`,
            `order_by=${projects.order_by}`,
        ];

        PrivateApi.get(`/projects?${queryParams.join("&")}`).then((res: AxiosResponse<IPaginatedResult<IProject>>) => {
            projects = res.data;
            if(projects.current_page > projects.last_page){
                projects.current_page = projects.last_page;
                loadProjects();
            }
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento dos projetos. Por favor, tente novamente."
            });
        }).finally(() => {
            isLoading = false;
            show = true;
        });
    }

    loadProjects();
</script>