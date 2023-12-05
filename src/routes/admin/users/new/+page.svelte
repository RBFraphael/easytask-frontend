<svelte:head>
    <title>Novo Usuário</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Novo Usuário</h1>
        </div>
    </div>
    <div class="card shadow border-0">
        <div class="card-body">
            <form on:submit={submitForm}>
                <div class="row">
                    <div class="col-12 col-lg-6 mb-3">
                        <div class="form-floating">
                            <input type="text" name="first_name" id="first_name" class="form-control" placeholder="Nome" required={true} bind:value={user.first_name}>
                            <label for="first_name">Nome</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 mb-3">
                        <div class="form-floating">
                            <input type="text" name="last_name" id="last_name" class="form-control" placeholder="Sobrenome" required={true} bind:value={user.last_name}>
                            <label for="last_name">Sobrenome</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3">
                        <div class="form-floating">
                            <input type="email" name="email" id="email" class="form-control" placeholder="E-mail" required={true} bind:value={user.email}>
                            <label for="email">E-mail</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3">
                        <div class="form-floating">
                            <input type="password" name="password" id="password" class="form-control" placeholder="Senha" required={true} bind:value={user.password}>
                            <label for="password">Senha</label>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 mb-3">
                        <div class="form-floating">
                            <select name="role" id="role" class="form-select" placeholder="Perfil de Acesso" required={true} bind:value={user.role}>
                                {#each Object.values(UserRole) as role}
                                <option value={role} selected={user.role == role}>{ UserRoleLabel(role) }</option>
                                {/each}
                            </select>
                            <label for="role">Perfil de Acesso</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-success" disabled={isSubmitting}>
                            {#if isSubmitting}
                                <div class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">Salvando</span>
                                </div>
                            {:else}
                                <FontAwesomeIcon icon={faSave} fixedWidth /> Salvar Usuário
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
	import { UserRole, UserRoleLabel } from "../../../../enums/UserRole";
	import type { IUser } from "../../../../interfaces/IUser";
	import { PrivateApi } from "../../../../services/ApiService";
	import type { AxiosError, AxiosResponse } from "axios";
	import { Alert } from "../../../../helpers/Alert";
	import { goto } from "$app/navigation";
	import type { IApiError } from "../../../../interfaces/IApiError";

    let user: IUser = {
        email: "", first_name: "", last_name: "",
        role: UserRole.ADMIN, password: ""
    };
    let isSubmitting: boolean = false;

    const submitForm = (e: SubmitEvent) => {
        e.preventDefault();
        isSubmitting = true;

        PrivateApi.post(`/users`, user).then((res: AxiosResponse<IUser>) => {
            Alert({
                icon: "success",
                title: "Sucesso",
                text: `O usuário ${user.first_name} ${user.last_name} foi adicionado com sucesso.`
            }).then(() => {
                goto(`/admin/users`);
            });
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o salvamento do usuário. Por favor, tente novamente."
            });
        }).finally(() => {
            isSubmitting = false;
        });
    };
</script>