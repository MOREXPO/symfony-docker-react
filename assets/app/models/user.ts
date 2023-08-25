export interface User {
    id: string;
    username: string;
    roles: string[];
    token?: string;
    borrado?:boolean;
}
export class UserFormRoles {
    id: string;
    error?:any;
    username: string;
    roles: string[];
    constructor (account?: User) {
        if (account) {
            this.id = account.id;
            
            this.username = account.username;
            this.roles = account.roles;
        }
    }
}

export interface UserFormValues {
    password: string;
    username: string;
    error?:any;
}
export interface UserPasswordFormValues {
    id: string;
    password: string;
    newPassword: string;
    newPasswordConfirm: string;
    error?:any;
}
export interface UserRegistrationValues {
    password: string;
    email: string;
}
