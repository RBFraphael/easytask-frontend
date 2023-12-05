<svelte:head>
    <title>Usuários</title>
</svelte:head>

<main>
    <div class="d-flex flex-row justify-content-between align-items-center mb-3">
        <div>
            <h1>Usuários</h1>
        </div>
        <div>
            <a href="/admin/users/new" class="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} fixedWidth />
                <span class="d-none d-lg-inline">Novo Usuário</span>
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
            <TableData data={users} columns={columns} on:itemClick={onOpenUser} on:changePage={onChangePage} on:changePerPage={onChangePerPage} on:sort={onSort} />
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
	import type { IUser } from "../../../interfaces/IUser";
	import { UserRoleLabel } from "../../../enums/UserRole";

    const columns: ITableDataColumn<IUser>[] = [
        {
            property: "id",
            title: "ID",
            sortable: true,
            value: (item: IUser) => item.id!.toString()
        },
        {
            property: "first_name",
            title: "Nome",
            sortable: true,
            value: (item: IUser) => `${item.first_name} ${item.last_name}`
        },
        {
            property: "email",
            title: "E-mail",
            sortable: false,
            value: (item: IUser) => item.email
        },
        {
            property: "role",
            title: "Perfil",
            sortable: true,
            value: (item: IUser) => UserRoleLabel(item.role)
        }
    ];

    let isLoading: boolean = false;
    let show: boolean = false;

    let users: IPaginatedResult<IUser> = {
        current_page: 1, data: [], from: 1, last_page: 1,
        order: "ASC", order_by: "id", per_page: 10, to: 1, total: 0
    };

    const onOpenUser = (event: CustomEvent): void => {
        goto(`/admin/users/${event.detail.item.id}`);
    }

    const onChangePage = (event: CustomEvent): void => {
        users.current_page = event.detail.page;
        loadUsers();
    }

    const onSort = (event: CustomEvent): void => {
        users.order = event.detail.order;
        users.order_by = event.detail.column;
        loadUsers();
    }

    const onChangePerPage = (event: CustomEvent): void => {
        users.per_page = event.detail.items;
        loadUsers();
    }

    const loadUsers = () => {
        isLoading = true;

        let queryParams = [
            `page=${users.current_page}`,
            `per_page=${users.per_page}`,
            `order=${users.order}`,
            `order_by=${users.order_by}`,
        ];

        PrivateApi.get(`/users?${queryParams.join("&")}`).then((res: AxiosResponse<IPaginatedResult<IUser>>) => {
            users = res.data;
            if(users.current_page > users.last_page){
                users.current_page = users.last_page;
                loadUsers();
            }
        }).catch((err: AxiosError<IApiError>) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro durante o carregamento dos usuários. Por favor, tente novamente."
            });
        }).finally(() => {
            isLoading = false;
            show = true;
        });
    }

    loadUsers();
</script>