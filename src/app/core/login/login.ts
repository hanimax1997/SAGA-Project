export class Login {
    username: string;
    password: string;
    email: string | undefined;

    constructor(username = `Entrez votre nom d'utilisateur`, password = `Entrez votre mot de passe`) {
        this.username = username;
        this.password = password;
    }
}