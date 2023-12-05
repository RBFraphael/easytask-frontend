export enum TaskStatus {
    PLANNING = "planning",
    PENDING = "pending",
    WAITING = "waiting",
    BLOCKED = "blocked",
    ACTIVE = "active",
    FINISHED = "finished"
}

export function TaskStatusLabel(key: string): string {
    switch(key){
        case TaskStatus.PLANNING:
            return "Em Planejamento";
        case TaskStatus.PENDING:
            return "Pendente";
        case TaskStatus.WAITING:
            return "Aguardando Insumo";
        case TaskStatus.BLOCKED:
            return "Bloqueado";
        case TaskStatus.ACTIVE:
            return "Em Desenvolvimento";
        case TaskStatus.FINISHED:
            return "Concluído";
        default:
            return key;
    }
}

export function TaskStatusColor(key: string): string {
    
    /**
     * Color palette from https://flatuicolors.com/palette/defo
     */

    switch(key){
        case TaskStatus.PLANNING:
            return "#8e44ad"; // Wisteria
        case TaskStatus.PENDING:
            return "#2980b9"; // Belize Hole
        case TaskStatus.WAITING:
            return "#f39c12"; // Orange
        case TaskStatus.BLOCKED:
            return "#e74c3c"; // Alizarin
        case TaskStatus.ACTIVE:
            return "#16a085"; // Green sea
        case TaskStatus.FINISHED:
            return "#27ae60"; // Nephritis
        default:
            return "#000000"; // Black
    }
}