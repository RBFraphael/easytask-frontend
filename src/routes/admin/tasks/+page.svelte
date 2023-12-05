<svelte:head>
    <title>Tarefas</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Tarefas</h1>
        </div>
        <div>
            <a href="/admin/tasks/new" class="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} fixedWidth />
                <span class="d-none d-lg-inline">Nova Tarefa</span>
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
            <TableData data={tasks} columns={columns} on:itemClick={onOpenTask} on:changePage={onChangePage} on:changePerPage={onChangePerPage} on:sort={onSort} />
            {/if}
        </div>
    </div>
</main>

<script lang="ts">
	import type { AxiosError, AxiosResponse } from "axios";
	import { PrivateApi } from "../../../services/ApiService";
	import type { IApiError } from "../../../interfaces/IApiError";
	import { Alert } from "../../../helpers/Alert";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import { faPlus } from "@fortawesome/free-solid-svg-icons";
	import type { IPaginatedResult } from "../../../interfaces/IPaginatedResult";
    import TableData from "../../../components/TableData.svelte";
	import { goto } from "$app/navigation";
	import type { ITableDataColumn } from "../../../interfaces/ITableDataColumn";
	import type { ITask } from "../../../interfaces/ITask";
	import { TaskStatusColor, TaskStatusLabel } from "../../../enums/TaskStatus";

    const columns: ITableDataColumn<ITask>[] = [
        {
            property: "id",
            title: "ID",
            sortable: true,
            value: (item: ITask) => item.id!.toString()
        },
        {
            property: "title",
            title: "Título",
            sortable: true,
            value: (item: ITask) => item.title
        },
        {
            property: "user.first_name",
            title: "Responsável",
            sortable: false,
            value: (item: ITask) => `${item.user!.first_name} ${item.user!.last_name}`
        },
        {
            property: "status",
            title: "Status",
            sortable: true,
            value: (item: ITask) => `<span class="fw-bold" style="color:${TaskStatusColor(item.status)};">${TaskStatusLabel(item.status)}</span>`
        },
        {
            property: "project.label",
            title: "Projeto",
            sortable: false,
            value: (item: ITask) => item.project!.label
        },
    ];

    let isLoading: boolean = false;
    let show: boolean = false;

    let tasks: IPaginatedResult<ITask> = {
        current_page: 1, data: [], from: 1, last_page: 1,
        order: "ASC", order_by: "id", per_page: 10, to: 1, total: 0
    };

    const onOpenTask = (event: CustomEvent): void => {
        goto(`/admin/tasks/${event.detail.item.id}`);
    }

    const onChangePage = (event: CustomEvent): void => {
        tasks.current_page = event.detail.page;
        loadTasks();
    }

    const onSort = (event: CustomEvent): void => {
        tasks.order = event.detail.order;
        tasks.order_by = event.detail.column;
        loadTasks();
    }

    const onChangePerPage = (event: CustomEvent): void => {
        tasks.per_page = event.detail.items;
        loadTasks();
    }

    const loadTasks = () => {
        isLoading = true;

        let queryParams = [
            "with=user,project",
            `page=${tasks.current_page}`,
            `per_page=${tasks.per_page}`,
            `order=${tasks.order}`,
            `order_by=${tasks.order_by}`,
        ];

        PrivateApi.get(`/tasks?${queryParams.join("&")}`).then((res: AxiosResponse<IPaginatedResult<ITask>>) => {
            tasks = res.data;
            if(tasks.current_page > tasks.last_page){
                tasks.current_page = tasks.last_page;
                loadTasks();
            }
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento das tarefas. Por favor, tente novamente."
            });
        }).finally(() => {
            isLoading = false;
            show = true;
        });
    }

    loadTasks();
</script>