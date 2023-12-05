export interface IPaginatedResult<T>
{
    current_page: number;
    data: T[];
    from: number|null;
    last_page: number;
    order: "ASC"|"DESC";
    order_by: string;
    per_page: number;
    to: number|null;
    total: number;
}
