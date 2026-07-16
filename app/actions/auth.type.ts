export type AuthState = {
    errors?: {
        nickname?: string[];
        password?: string[];
    },
    message?:string;
}