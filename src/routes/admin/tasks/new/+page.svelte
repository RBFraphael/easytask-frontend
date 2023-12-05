<svelte:head>
    <title>Nova Tarefa</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Nova Tarefa</h1>
        </div>
    </div>
    <div class="card shadow border-0">
        <div class="card-body">
            <form on:submit={submitForm}>
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="form-floating">
                            <input type="text" name="label" id="label" class="form-control" placeholder="Título da Tarefa" required={true} bind:value={task.title}>
                            <label for="label">Título da Tarefa</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3">
                        <div class="form-floating">
                            <select name="user_id" id="user_id" class="form-select" placeholder="Responsável Operacional" required={true} bind:value={task.user_id}>
                                {#each operators as operator}
                                <option value={operator.id} selected={task.user_id == operator.id}>{ operator.first_name } { operator.last_name }</option>
                                {/each}
                            </select>
                            <label for="user_id">Responsável Operacional</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3">
                        <div class="form-floating">
                            <select name="project_id" id="project_id" class="form-select" placeholder="Projeto" required={true} bind:value={task.project_id}>
                                {#each projects as project}
                                <option value={project.id} selected={task.project_id == project.id}>#{ project.id } - { project.label }</option>
                                {/each}
                            </select>
                            <label for="project_id">Projeto</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3">
                        <div class="form-floating">
                            <select name="status" id="status" class="form-select" placeholder="Status" required={true} bind:value={task.status}>
                                {#each Object.values(TaskStatus) as status}
                                <option value={status} selected={task.status == status}>{ TaskStatusLabel(status) }</option>
                                {/each}
                            </select>
                            <label for="status">Status</label>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <div class="form-floating">
                            <textarea name="description" id="description" class="form-control" required style="height:160px;" bind:value={task.description} placeholder="Descrição da Tarefa"></textarea>
                            <label for="description">Descrição da Tarefa</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-success" disabled={isSubmitting}>
                            {#if isSubmitting}
                                <div class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">Salvando</span>
                                </div>
                            {:else}
                                <FontAwesomeIcon icon={faSave} fixedWidth /> Salvar Tarefa
                            {/if}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</main>

<script lang="ts">
	import { faSave } from "@fortawesome/free-solid-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import type { ITask } from "../../../../interfaces/ITask";
	import { TaskStatus, TaskStatusLabel } from "../../../../enums/TaskStatus";
	import type { IUser } from "../../../../interfaces/IUser";
	import type { IProject } from "../../../../interfaces/IProject";
	import { PrivateApi } from "../../../../services/ApiService";
	import type { AxiosError, AxiosResponse } from "axios";
	import type { IPaginatedResult } from "../../../../interfaces/IPaginatedResult";
	import type { IApiError } from "../../../../interfaces/IApiError";
	import { Alert } from "../../../../helpers/Alert";
	import { goto } from "$app/navigation";

    let task: ITask = {
        description: "", project_id: null, status: TaskStatus.PLANNING,
        title: "", user_id: null
    };
    let operators: IUser[] = [];
    let projects: IProject[] = [];
    let isSubmitting: boolean = false;

    const loadProjects = () => {
        PrivateApi.get(`/projects?per_page=100&page=1`).then((res: AxiosResponse<IPaginatedResult<IProject>>) => {
            projects = res.data.data;
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento dos projetos. Por favor, tente novamente."
            });
        });
    }

    const loadOperators = () => {
        PrivateApi.get(`/users?filters=role:operational&per_page=100&page=1`).then((res: AxiosResponse<IPaginatedResult<IUser>>) => {
            operators = res.data.data;
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento dos projetos. Por favor, tente novamente."
            });
        });
    }

    const submitForm = (e: SubmitEvent) => {
        e.preventDefault();
        isSubmitting = true;

        PrivateApi.post("/tasks", task).then((res: AxiosResponse<ITask>) => {
            Alert({
                icon: "success",
                title: "Sucesso",
                text: `A tarefa ${task.title} foi adicionada com sucesso.`
            }).then(() => {
                goto(`/admin/projects/${task.project_id}`);
            });
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o salvamento da tarefa. Por favor, tente novamente."
            });
        }).finally(() => {
            isSubmitting = false;
        });
    }

    loadProjects();
    loadOperators();
</script>