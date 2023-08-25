import { createContext, useContext } from "react";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import AccountStore from "./accountStore";
import RolStore from "./rolStore";
import ModalStore from "./modalStore";

interface Store {
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    accountStore:AccountStore;
    rolStore:RolStore;
}

export const store: Store = {
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    accountStore: new AccountStore(),
    rolStore:new RolStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
