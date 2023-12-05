<style lang="scss">
    table.table  {
        thead tr th.sortable { cursor: pointer; }
        tbody tr { cursor: pointer; }
    }
</style>

{#if data.data.length > 0}
<div class="table-component">
    <div class="border rounded-3 overflow-hidden mb-3">
        <div class="table-responsive">
            <table class="table table-striped table-hover table-bordered m-0">
                <thead class="table-dark">
                    <tr>
                        {#each columns as c}
                            {#if c.sortable}
                            <th class="sortable" on:click={() => sort(c.property, data.order == "ASC" ? "DESC" : "ASC")}>
                                { c.title }
                                {#if data.order_by == c.property}
                                    {#if data.order == "ASC"}
                                    <FontAwesomeIcon icon={faArrowUpWideShort} fixedWidth />
                                    {:else}
                                    <FontAwesomeIcon icon={faArrowDownWideShort} fixedWidth />
                                    {/if}
                                {/if}
                            </th>
                            {:else}
                            <th>{ c.title }</th>
                            {/if}
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each data.data as item}
                    <tr on:click={() => itemClick(item)}>
                        {#each columns as c}
                        <td>{@html c.value(item) }</td>
                        {/each}
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
    <div class="d-flex flex-row justify-content-between">
        <div>
            <p>{data.from}-{data.to} de {data.total} itens.</p>
        </div>
        <div class="d-flex flex-row gap-1 align-items-center">
            <div class="items-per-page">
                <select name="per_page" id="per_page" class="form-select" bind:value={itemsPerPage} on:change={perPage}>
                    {#each perPageOptions as option}
                    <option value={option} selected={data.per_page == option}>{option}</option>
                    {/each}
                </select>
            </div>
            <div class="items-pagination">
                <div class="btn-group">
                    <button class="btn btn-outline-primary px-2 py-1" on:click={() => goToFirstPage()} disabled={data.current_page == 1}><FontAwesomeIcon icon={faAnglesLeft} fixedWidth /></button>
                    <button class="btn btn-outline-primary px-2 py-1" on:click={() => goToPreviousPage()} disabled={data.current_page == 1}><FontAwesomeIcon icon={faAngleLeft} fixedWidth /></button>
                    {#each Array(data.last_page) as _, i}
                    <button class={`btn btn${data.current_page != i+1 ? "-outline" : ""}-primary px-2 py-1`} on:click={() => goToPage(i+1)}>{ i+1 }</button>
                    {/each}
                    <button class="btn btn-outline-primary px-2 py-1" on:click={() => goToNextPage()} disabled={data.current_page == data.last_page}><FontAwesomeIcon icon={faAngleRight} fixedWidth /></button>
                    <button class="btn btn-outline-primary px-2 py-1" on:click={() => goToLastPage()} disabled={data.current_page == data.last_page}><FontAwesomeIcon icon={faAnglesRight} fixedWidth /></button>
                </div>
            </div>
        </div>
    </div>
</div>
{:else}
<div class="py-5">
    <p class="text-center">Nenhum item disponível</p>
</div>
{/if}

<script lang="ts">
	import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
	import type { IPaginatedResult } from "../interfaces/IPaginatedResult";
	import type { ITableDataColumn } from "../interfaces/ITableDataColumn";
	import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faArrowDownWideShort, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
	import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    let itemsPerPage = 10;

    export let columns: ITableDataColumn<any>[] = [];
    export let data: IPaginatedResult<any> = {
        current_page: 1, data: [], from: 1, last_page: 1,
        order: "ASC", order_by: "", per_page: 10, to: 1, total: 0
    };
    export let perPageOptions: number[] = [5, 10, 20, 50, 100];

    const itemClick = (item: any) => {
        dispatch("itemClick", { item });
    }

    const sort = (column: string, order: "ASC"|"DESC") => {
        dispatch("sort", { column, order });
    }

    const perPage = () => {
        dispatch("changePerPage", { items: itemsPerPage })
    }

    const goToFirstPage = () => {
        dispatch("changePage", { page: 1 });
    }

    const goToLastPage = () => {
        goToPage(data.last_page);
        dispatch("changePage", { page: data.last_page });
    }

    const goToPreviousPage = () => {
        dispatch("changePage", { page: data.current_page - 1 });
    }

    const goToNextPage = () => {
        dispatch("changePage", { page: data.current_page + 1 });
    }

    const goToPage = (page: number) => {
        if(page >= 1 && page <= data.last_page){
            dispatch("changePage", { page });
        }
    }
</script>