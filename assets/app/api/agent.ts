import axios, { AxiosError, AxiosResponse } from 'axios';
import { User, UserFormValues, UserPasswordFormValues, UserRegistrationValues } from "../models/user";
import { Rol } from '../models/rol';
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { history } from "../../app";
import { PaginatedResult } from "../models/pagination";
import { request } from 'http';

//axios.defaults.baseURL = 'http://10.10.244.66:8001/api/';
axios.defaults.baseURL = 'http://127.0.0.1:9899/';

axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(
    async (response) => {
  
      const pagination = response.headers["pagination"];
      if (pagination) {
        response.data = new PaginatedResult(
          response.data,
          JSON.parse(pagination)
        );
        return response as AxiosResponse<PaginatedResult<any>>;
      }
      return response;
    },
    (error: AxiosError) => {
      console.log(error)
      const { data, status, config } = error.response!;
      switch (status) {
        case 400:
          if (typeof data === "string") {
            toast.error(data);
          }
          if (config.method === "get" && data.errors.hasOwnProperty("id")) {
            history.push("/not-found");
          }
          if (data.errors) {
            const modalStateErrors = [];
            for (const key in data.errors) {
              if (data.errors[key]) {
                modalStateErrors.push(data.errors[key]);
              }
            }
            throw modalStateErrors.flat();
          }
          break;
        case 401:
          toast.error("No autorizado");
          store.userStore.destroy();
          break;
        case 404:
          history.push("/not-found");
          break;
        case 500:
          store.commonStore.setServerError(data);
          history.push("/server-error");
          break;
      }
      return Promise.reject(error);
    }
  );
  
  const responseBody = <T>(response: AxiosResponse<T>) => response.data;
  
  const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}, token?:string) =>
      axios.post<T>(url, body, {headers:{'Authorization': 'BEARER '+token}}).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
  };
  
  
const Account = {
    current: () => axios.get<User>("/api/account"),
    login: (user: UserFormValues) => requests.post<any>("/auth", user),
    cambiarEstado: (usuarioId: string) => requests.post<any>('/api/user/estado', usuarioId),
    update: (account: User) => requests.post<any>('/api/user/update', account),
    logout: () => axios.post("/api/logout").then(responseBody),
    get: (user: FormData, token:string) => requests.post<any>('/api/user/details', user, token),
    register: (user: UserRegistrationValues) => requests.post<User>('/user/create', user),
    list: () => requests.get<User[]>('/api/user/list'),
    VincularPersona: (vinculo: {'usuarioId': string, 'personaId': string}) => requests.post<User>('/api/user/linkPerson', vinculo),
    DesvincularPersona: (vinculo: {'usuarioId': string, 'personaId': string}) => requests.post<User>('/api/user/unlinkPerson', vinculo),
    updatePassword: (data: UserPasswordFormValues) => requests.post('/api/user/updatePassword' , data)
    /*register: (user: UserFormValues) =>
        requests.post<User>("/account/register", user),
    */
};
const Roles = {
  list: () => requests.get<Rol[]>('/api/user/listRoles'),
}

const agent = {
    Account,
    Roles
};

export default agent;
