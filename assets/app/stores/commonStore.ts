import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

import { User } from "../models/user";

export default class CommonStore {
    error: ServerError | null = null;
    auth: boolean = false;
    token: string | null = window.sessionStorage.getItem('app_token');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.sessionStorage.setItem('app_token', token)
                }
                else {
                    window.localStorage.removeItem('app_token')
                }
                    
            }
        );

    }

    setServerError = (error : ServerError) => {
        this.error = error;
    }

    setToken = (token: any |null) => {
        this.token =token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}
