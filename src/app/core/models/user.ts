export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    refresh_token?: string;
    access_token?: string;
}