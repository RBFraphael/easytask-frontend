export interface ITableDataColumn<T>
{
    title: string;
    property: string;
    value(item: T): string;
    sortable: boolean;
}