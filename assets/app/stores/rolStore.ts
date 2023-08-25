import { store } from "./store";
import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import { history } from "../../app";
import agent from "../api/agent";
import { Rol } from "../models/rol";

export default class RolStore {
    roles: Rol[] | null = null;
    rolesRegistry = new Map<string, Rol>();
    loadingInitial = false;
    loaded = false;
    constructor() {
        makeAutoObservable(this);
    }
    load = async () => {
        this.setLoadingInitial(true);
        try {
            var roles = await agent.Roles.list();
            runInAction(() => {
                this.rolesRegistry = new Map<string, Rol>();
                roles.forEach(empleado => {
                    this.setRol(empleado);
                });
                //console.log(roles);
                this.setLoadingInitial(false);
                this.setLoaded(true);
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
              this.setLoadingInitial(false);
              this.setLoaded(true);
            });
        }
    }
    get getRoles() {
        return Array.from(this.rolesRegistry.values());
    }
    private setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
      };
    private setRol = (rol: Rol) => {
        this.rolesRegistry.set(rol.id, rol);
    }
    private setLoaded(state: boolean) {
        this.loaded = state;
    }
    public reset = () => {
        this.rolesRegistry = new Map<string, Rol>();
        this.setLoaded(false);
    }
}
