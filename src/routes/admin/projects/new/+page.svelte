<svelte:head>
    <title>Novo Projeto</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Novo Projeto</h1>
        </div>
    </div>
    <div class="card shadow border-0">
        <div class="card-body">
            <form on:submit={submitForm}>
                <div class="row">
                    <div class="col-12 col-lg-6 mb-3">
                        <div class="form-floating">
                            <input type="text" name="label" id="label" class="form-control" placeholder="Nome do Projeto" required={true} bind:value={project.label}>
                            <label for="label">Nome do Projeto</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 mb-3">
                        <div class="form-floating">
                            <select name="user_id" id="user_id" class="form-select" placeholder="Gerente de Operações" required={true} bind:value={project.user_id}>
                                {#each managers as manager}
                                <option value={manager.id} selected={project.user_id == manager.id}>{ manager.first_name } { manager.last_name }</option>
                                {/each}
                            </select>
                            <label for="user_id">Gerente de Operações</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-success" disabled={isSubmitting}>
                            {#if isSubmitting}
                                <div class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">Salvando</span>
                                </div>
                            {:else}
                                <FontAwesomeIcon icon={faSave} fixedWidth /> Salvar Projeto
                            {/if}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</main>

<script lang="ts">
	import type { AxiosError, AxiosResponse } from "axios";
	import type { IUser } from "../../../../interfaces/IUser";
	import { PrivateApi } from "../../../../services/ApiService";
	import type { IPaginatedResult } from "../../../../interfaces/IPaginatedResult";
	import type { IApiError } from "../../../../interfaces/IApiError";
	import { Alert } from "../../../../helpers/Alert";
	import type { IProject } from "../../../../interfaces/IProject";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import { faSave } from "@fortawesome/free-solid-svg-icons";
	import { goto } from "$app/navigation";

    let managers: IUser[] = [];
    let isSubmitting: boolean = false;

    let project: IProject = {
        label: "",
        user_id: null
    };

    const loadUsers = () => {
        PrivateApi.get("users?filters=role:manager&per_page=100").then((res: AxiosResponse<IPaginatedResult<IUser>>) => {
            managers = res.data.data;
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento dos gerentes de projeto. Por favor, tente novamente."
            });
        });
    }

    const submitForm = (e: SubmitEvent) => {
        e.preventDefault();
        isSubmitting = true;

        PrivateApi.post("/projects", project).then((res: AxiosResponse<IProject>) => {
            Alert({
                icon: "success",
                title: "Sucesso",
                text: `O projeto ${project.label} foi adicionado com sucesso.`
            }).then(() => {
                goto("/admin/projects");
            });
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o cadastro do projeto. Por favor, tente novamente."
            });
        }).finally(() => {
            isSubmitting = false;
        })
    }

    loadUsers();
</script>