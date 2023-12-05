<svelte:head>
    <title>Detalhes da Tarefa</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Detalhes da Tarefa</h1>
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
                <div class="col-12 col-lg-9">
                    <h5>#{ task?.id }</h5>
                    <h3 class="fw-bold">{ task?.title }</h3>
                    <h4 class="text-secondary">Responsável: { task?.user?.first_name } { task?.user?.last_name }</h4>
                    <h4 class="text-secondary">Projeto: { task?.project?.label }</h4>
                </div>
                <div class="col-12 col-lg-3 text-lg-end">
                    <span>Status:</span>
                    <h4 class="fw-bold" style="color:{ TaskStatusColor(task?.status ?? "") }">{ TaskStatusLabel(task?.status ?? "") }</h4>
                    
                    <div class="form-floating">
                        <select name="status" id="status" class="form-select" placeholder="Status" required={true} bind:value={task.status} on:change={updateTaskStatus}>
                            {#each Object.values(TaskStatus) as status}
                            <option value={status} selected={task.status == status}>{ TaskStatusLabel(status) }</option>
                            {/each}
                        </select>
                        <label for="status">Status</label>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12">
                    <h5 class="fw-bold m-0">Descrição:</h5>
                    <p>{ task?.description }</p>
                </div>
            </div>
            <hr />
            <div class="row">
                {#if task?.comments}
                    <div class="col-12 mb-3">
                        <h5 class="fw-bold mb-3">Comentários</h5>
                        {#if task.comments.length > 0}
                        {#each task?.comments as comment}
                            <div class="card shadow border-0 mb-1">
                                <div class="card-body">
                                    <p class="fw-bold">Em { dayjs(comment.created_at).format("DD/MM/YYYY HH:mm") }, { comment.user?.first_name } { comment.user?.last_name } comentou:</p>
                                    <p>{ comment.comment }</p>
                                </div>
                            </div>
                        {/each}
                        {:else}
                        <h4 class="text-muted">Nenhum comentário</h4>
                        {/if}
                    </div>
                {/if}
                <div class="col-12">
                    <h5 class="fw-bold mb-3">Adicionar Comentário</h5>
                    <form on:submit={addComment}>
                        <div class="form-floating mb-2">
                            <textarea name="comment" id="comment" class="form-control" style="height:96px;" required placeholder="Comentário" bind:value={comment}></textarea>
                            <label for="comment">Comentário</label>
                        </div>

                        <button type="submit" class="btn btn-success">
                            <FontAwesomeIcon icon={faComment} fixedWidth /> Comentar
                        </button>
                    </form>
                </div>
            </div>
            {/if}
        </div>
    </div>
</main>

<script lang="ts">
	import { page } from "$app/stores";
	import { faComment } from "@fortawesome/free-solid-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import type { ITask } from "../../../../interfaces/ITask";
	import { PrivateApi } from "../../../../services/ApiService";
	import type { AxiosError, AxiosResponse } from "axios";
	import { Alert } from "../../../../helpers/Alert";
	import type { IApiError } from "../../../../interfaces/IApiError";
	import { TaskStatus, TaskStatusColor, TaskStatusLabel } from "../../../../enums/TaskStatus";
    import dayjs from "dayjs";
	import { user } from "$lib/store";
	import type { IComment } from "../../../../interfaces/IComment";

    let task_id = $page.params.task_id;
    let task: ITask = {
        description: "", project_id: null, status: TaskStatus.PLANNING,
        title: "", user_id: null
    };
    let isLoading: boolean = false;
    let comment: string = "";

    const loadTask = () => {
        isLoading = true;

        PrivateApi.get(`/tasks/${task_id}?with=project,user,comments.user`).then((res: AxiosResponse<ITask>) => {
            task = res.data;
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento da tarefa. Por favor, tente novamente."
            });
        }).finally(() => {
            isLoading = false;
        });
    };

    const addComment = (e: SubmitEvent) => {
        e.preventDefault();

        let payload = {
            task_id,
            user_id: $user?.id,
            comment
        };

        PrivateApi.post(`/comments`, payload).then((res: AxiosResponse<IComment>) => {
            Alert({
                icon: "success",
                title: "Sucesso",
                text: "Comentário adicionado com sucesso."
            }).then(() => {
                comment = "";
                loadTask();
            });
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante a adição do comentário. Por favor, tente novamente."
            });
        });
    }

    const updateTaskStatus = () => {
        let payload = { status: task.status };
        PrivateApi.put(`/tasks/${task_id}`, payload).then((res: AxiosResponse<ITask>) => {
            Alert({
                icon: "success",
                title: "Sucesso",
                text: `A tarefa ${task.title} foi atualizada com sucesso.`
            }).then(() => {
                loadTask();
            });
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante a atualização da tarefa. Por favor, tente novamente."
            });
        });
    };

    loadTask();
</script>