<svelte:head>
    <title>Login</title>
</svelte:head>

<main>
    <div class="container-fluid bg-dark">
        <div class="container">
            <div class="row align-items-center justify-content-center vh-100">
                <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                    <div class="card shadow border-0 p-3">
                        <div class="card-body">
                            <div class="d-flex flex-row justify-content-between align-items-center mb-4">
                                <h3 class="text-dark">Login</h3>
                                <img src="/assets/images/easytask-logo.traced.svg" alt="EasyTask Logo" class="img-fluid">
                            </div>
                            <form on:submit={submitForm}>
                                <div class="form-floating mb-3">
                                    <input type="email" name="email" id="email" class="form-control" placeholder="Endereço de e-mail" bind:value={login.email} required>
                                    <label for="email">Endereço de e-mail</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="password" name="password" id="password" class="form-control" placeholder="Senha" bind:value={login.password} required>
                                    <label for="password">Senha</label>
                                </div>
                                <button type="submit" class="btn btn-success" disabled={isSubmitting}>
                                    {#if isSubmitting}
                                        <div class="spinner-border spinner-border-sm" role="status">
                                            <span class="visually-hidden">Entrando</span>
                                        </div>
                                    {:else}
                                        <FontAwesomeIcon icon={faLock} fixedWidth /> Entrar
                                    {/if}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<script lang="ts">
	import type { AxiosError, AxiosResponse } from "axios";
	import { PrivateApi } from "../../services/ApiService";
	import type { IUserLogin } from "../../interfaces/IUserLogin";
	import { Alert } from "../../helpers/Alert";
	import type { IApiError } from "../../interfaces/IApiError";
	import { user } from "$lib/store";
	import { UserRole } from "../../enums/UserRole";
	import { goto } from "$app/navigation";
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import { faLock } from "@fortawesome/free-solid-svg-icons";

    let isSubmitting = false;
    let login = {
        email: "",
        password: ""
    };

    const submitForm = (event: SubmitEvent) => {
        event.preventDefault();

        isSubmitting = true;

        PrivateApi.post("/auth/login", login).then((res: AxiosResponse<IUserLogin>) => {
            let data = res.data;
            localStorage.setItem("access_token", data.access_token);
            user.set(res.data.user);
            switch(data.user.role){
                case UserRole.ADMIN:
                    goto("/admin/dashboard");
                    break;
                case UserRole.MANAGER:
                    goto("/manager/dashboard");
                    break;
                case UserRole.OPERATIONAL:
                    goto("/operation/dashboard");
                    break;
            }
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o seu login. Por favor, tente novamente mais tarde."
            });
        }).finally(() => {
            isSubmitting = false;
        });
    }

    if($user !== null || localStorage.getItem("access_token") !== null){
        goto("/");
    }

</script>