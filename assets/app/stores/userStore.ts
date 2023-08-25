import { store } from "./store";
import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues, UserPasswordFormValues, UserRegistrationValues } from "../models/user";
import { history } from "../../app";
import { toast } from "react-toastify";
import agent from "../api/agent";



export default class UserStore {
  user: User | null = null;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    if (!this.user) {
      var sessionToken = sessionStorage.getItem("app_token");
      var sessionUser = sessionStorage.getItem("app_user");
      if (sessionToken !== null && sessionUser !== null) {
        this.getAccount(sessionUser, sessionToken);
      }
    }
    return !!this.user;
  }


  login = async (creds: UserFormValues) => {

    try {
      const token = await agent.Account.login(creds);
      //console.log(user);
      runInAction(() => {
        //this.getAccount(creds.username, token['token']);
        sessionStorage.setItem('app_user', creds.username);
        store.commonStore.setToken(token['token']);
      }
      );
    } catch (error) {
      //console.log(error.error);
      throw error;
    }
  }
  register = async (creds: UserRegistrationValues) => {
    console.log(creds);
    try {
      const response = await agent.Account.register(creds);
      runInAction(() => {
        //this.user = response;
        //window.sessionStorage.setItem('app_user_info', JSON.stringify(this.user));
        toast.success("Usuario creado correctamente, verifique que es usted por favor");
      }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  private setLoading(state: boolean) {
    this.loading = state;
  }
  updatePassword = async (creds: UserPasswordFormValues) => {
    this.setLoading(true);
    try {
      await agent.Account.updatePassword(creds);
      runInAction(() => {
        this.setLoading(false);
      }
      );
    } catch (error) {
      runInAction(() => {
        this.setLoading(false);
        console.log(error);
      })
      throw error;
    }
  }
  getAccount = async (name: string, token: string) => {
    var data = new FormData();
    data.append('username', name);
    try {
      const user = await agent.Account.get(data, token);
      runInAction(() => { this.user = user['data']; });
    } catch (error) {
      console.log(error);
    }
  };

  logout = async () => {
    await agent.Account.logout();
    runInAction(() => {
      this.destroy();
    })
  };
  destroy = async () => {
    window.sessionStorage.removeItem("app_token");
    window.sessionStorage.removeItem("app_user");
    //await this.resetStores();
    this.user = null;
    history.push("/");
  }


  checkCreds = async () => {
    if (!window.sessionStorage.getItem("app_token")) {
      window.sessionStorage.removeItem("app_token");
      this.user = null;
      //await this.resetStores();
      store.commonStore.setAppLoaded();
      return false;
    } else {
      const token = window.sessionStorage.getItem("app_token");
      const username = window.sessionStorage.getItem("app_user");
      await this.getAccount(username, token);
      store.commonStore.setAppLoaded();
      return true;
    }
  }
  getId = () => {
    return this.user.id;
  }
}
