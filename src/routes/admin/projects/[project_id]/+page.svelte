<svelte:head>
    <title>Detalhes do Projeto</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Detalhes do Projeto</h1>
        </div>
        <div class="d-flex flex-row align-items-center gap-1">
            <a href="/admin/projects/{project_id}/edit" class="btn btn-primary">
                <FontAwesomeIcon icon={faPencil} fixedWidth />
                <span class="d-none d-lg-inline">Editar</span>
            </a>
            <button class="btn btn-danger" on:click={deleteProject}>
                <FontAwesomeIcon icon={faTrash} fixedWidth />
                <span class="d-none d-lg-inline">Excluir</span>
            </button>
        </div>
    </div>

    <div class="card shadow border-0">
        <div class="card-body">
            {#if isLoading}
            <div class="progress" role="progressbar" aria-label="Carregando" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
            </div>
            {:else}
            <div class="row mb-3">
                <div class="col-12">
                    <h3 class="fw-bold">{ project?.label }</h3>
                    <h4 class="text-secondary">Responsável: { project?.user?.first_name } { project?.user?.last_name }</h4>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-12">
                    <h4 class="mb-3">Tasks</h4>
                    <TableData data={tasks} columns={tasksColumns} on:itemClick={onOpenTask} on:changePage={onChangeTasksPage} on:changePerPage={onChangeTasksPerPage} on:sort={onTasksSort} />
                </div>
            </div>
            {/if}
        </div>
    </div>
</main>

<script lang="ts">
    import { page } from "$app/stores";
	import type { AxiosError, AxiosResponse } from "axios";
	import { PrivateApi } from "../../../../services/ApiService";
	import type { IProject } from "../../../../interfaces/IProject";
	import type { IApiError } from "../../../../interfaces/IApiError";
	import { Alert } from "../../../../helpers/Alert";
	import { goto } from "$app/navigation";
	import type { IPaginatedResult } from "../../../../interfaces/IPaginatedResult";
	import type { ITask } from "../../../../interfaces/ITask";
	import type { ITableDataColumn } from "../../../../interfaces/ITableDataColumn";
	import { TaskStatusColor, TaskStatusLabel } from "../../../../enums/TaskStatus";
	import TableData from "../../../../components/TableData.svelte";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
	import type { SweetAlertResult } from "sweetalert2";

    let project_id = $page.params.project_id;
    let project: IProject|null = null;
    let isLoading: boolean = false;
    let tasks: IPaginatedResult<ITask> = {
        current_page: 1, data: [], from: 1, last_page: 1,
        order: "ASC", order_by: "id", per_page: 10, to: 1, total: 0
    };

    const tasksColumns: ITableDataColumn<ITask>[] = [
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
        }
    ];

    const loadProject = () => {
        isLoading = true;

        PrivateApi.get(`/projects/${project_id}?with=user`).then((res: AxiosResponse<IProject>) => {
            project = res.data;
            loadTasks();
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento dos dados do projeto. Por favor, tente novamente."
            }).then(() => {
                goto("/admin/projects");
            });
        }).finally(() => {
            isLoading = false;
        });
    };

    const loadTasks = () => {
        let queryParams = [
            "with=user",
            `filters=project_id:${project_id}`,
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
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento das tarefas do projeto. Por favor, tente novamente."
            });
        });
    }

    const onOpenTask = (event: CustomEvent): void => {
        goto(`/admin/tasks/${event.detail.item.id}`);
    }

    const onChangeTasksPage = (event: CustomEvent): void => {
        tasks.current_page = event.detail.page;
        loadTasks();
    }

    const onTasksSort = (event: CustomEvent): void => {
        tasks.order = event.detail.order;
        tasks.order_by = event.detail.column;
        loadTasks();
    }

    const onChangeTasksPerPage = (event: CustomEvent): void => {
        tasks.per_page = event.detail.items;
        loadTasks();
    }

    const deleteProject = () => {
        Alert({
            icon: "question",
            title: "Tem certeza?",
            text: `Tem certeza que deseja excluir o projeto ${project?.label}? Essa ação é IRREVERSÍVEL.`,
            showCancelButton: true,
            cancelButtonText: "Não",
            showConfirmButton: true,
            confirmButtonText: "Sim"
        }).then((res: SweetAlertResult) => {
            if(res.isConfirmed){
                PrivateApi.delete(`/projects/${project_id}`).then((res: AxiosResponse) => {
                    Alert({
                        icon: "success",
                        title: "Sucesso",
                        text: `O projeto ${project?.label} foi excluído com sucesso.`
                    }).then(() => {
                        goto("/admin/projects");
                    });
                }).catch((err: AxiosError<IApiError>) => {
                    Alert({
                        icon: "error",
                        title: "Erro",
                        text: `Ocorreu um erro durante a exclusão do projeto. Por favor, tente novamente mais tarde.`
                    })
                })
            }
        })
    }

    loadProject();
</script>