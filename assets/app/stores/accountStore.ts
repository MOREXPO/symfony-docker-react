import { store } from "./store";
import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues, UserRegistrationValues } from "../models/user";
import { history } from "../../app";
import agent from "../api/agent";



export default class AccountStore {
    usuarios: User[] | null = null;
    usuariosRegistry = new Map<string, User>();
    loadingInitial = false;
    loading = false;
    loaded = false;
    loadedDeleted = false;
    constructor() {
        makeAutoObservable(this);
    }

    
    load = async () => {
        this.setLoadingInitial(true);
        try {
            const usuarios = await agent.Account.list();
            runInAction(() => {
                this.usuariosRegistry = new Map<string, User>();
                usuarios.forEach(usuario => {
                    this.set(usuario);
                });
                this.setLoadingInitial(false);
                this.setLoaded(true);
            })
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
            throw error;
        }
    }
    get get() {
        return Array.from(this.usuariosRegistry.values());
    }
    private set = (usuario: User) => {
        this.usuariosRegistry.set(usuario.id, usuario);
    }
    private setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
      };

    private setLoaded(state: boolean) {
        this.loaded = state;
    }
    private setLoading(state: boolean) {
      this.loading = state;
  }
    cambiarEstado = async(usuarioId: string) => {
        this.setLoadingInitial(true);
        try {
          let usuario = await agent.Account.cambiarEstado(usuarioId);
          runInAction(() => {
            this.usuariosRegistry.set(usuario.id, usuario);
            this.setLoadingInitial(false);
          });
        } catch (error) {
          runInAction(() => {
            this.setLoadingInitial(false);
          })
          throw error;
        }
      }
      vincularAPersona = async (usuarioId: string, personaId:string) => {
        this.setLoading(true);
        let paquete = {'usuarioId': usuarioId, 'personaId': personaId };
        try {
          let usuario = await agent.Account.VincularPersona(paquete);
          runInAction(() => {
            this.usuariosRegistry.set(usuario.id, usuario);
            this.setLoading(false);
          });
        } catch (error) {
          runInAction(() => {
            this.setLoading(false);
          })
          throw error;
        }
      }
      getById = (id: string) : User | undefined => {
        let account = undefined;
        Array.from(this.usuariosRegistry.entries()).forEach(e => {
          if (e[1].id == id) {
            account = e[1];
          }
        });
        return account;
      }

      desvincularAPersona = async (usuarioId: string, personaId:string) => {
        this.setLoading(true);
        let paquete = {'usuarioId': usuarioId, 'personaId': personaId };
        try {
          let usuario = await agent.Account.DesvincularPersona(paquete);
          runInAction(() => {
            this.usuariosRegistry.set(usuario.id, usuario);
            this.setLoading(false);
          });
        } catch (error) {
          runInAction(() => {
            this.setLoading(false);
          })
          throw error;
        }
      }

      update = async (account: User) => {
        try {
          await agent.Account.update(account);
          runInAction(() => {
              let updatedAccount = this.getById(account.id);
              updatedAccount.roles = account.roles;
              updatedAccount.username = account.username;
              this.usuariosRegistry.set(account.id, updatedAccount as User);
          });
        } catch (error) {
          throw error;
        }
      }

      public reset = () => {
        this.usuariosRegistry = new Map<string,  User>();
        this.setLoaded(false);
      }
}
