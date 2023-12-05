export enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    OPERATIONAL = "operational"
};

export function UserRoleLabel(key: string): string{
    switch(key){
        case UserRole.ADMIN:
            return "Administrador";
        case UserRole.MANAGER:
            return "Gerente de Operações";
        case UserRole.OPERATIONAL:
            return "Operacional";
        default:
            return key;
    }
}
