export function greetings(user: IUser): string
{
    const hours = (new Date()).getHours();

    if(hours >= 6 && hours <= 11){
        return `Bom dia, ${user.first_name}!`;
    } else if(hours >= 12 && hours <= 17){
        return `Boa tarde, ${user.first_name}!`;
    } else {
        return `Boa noite, ${user.first_name}!`;
    }
}
