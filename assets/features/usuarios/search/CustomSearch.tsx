import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Checkbox, Input, Label, Segment } from 'semantic-ui-react';
import { User } from '../../../app/models/user';
import { useStore } from '../../../app/stores/store';
import SearchResult from './SearchResult';

interface Props {
    personas: User[];
    showDeleted: boolean;
    showBorrarConfirm: (persona: User) => void;
    setSelectedUser: (value: React.SetStateAction<User>) => void;
    usuarioBorrar: User;
    deleteUsuario: () => Promise<void>;
    borrarConfirm: boolean;
    setBorrarConfirm: (value: React.SetStateAction<boolean>) => void;
    setUsuarioBorrar: React.Dispatch<React.SetStateAction<User>>;
}

export default observer(function CustomSearch(props: Props) {
    
    const [results, setResults] = useState<User[]>();
    const [loadBorrados, setLoadBorrados] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const { accountStore, userStore } = useStore();

    const { load: loadAccounts, loaded: accountsLoaded, loadingInitial: accountsLoading, get: getAccounts, cambiarEstado, vincularAPersona, loading: actionLoading, desvincularAPersona } = accountStore;

    useEffect(() => {
        setResults([]);
        if (keyword.length > 2)
            setResults(getAccounts.filter(x =>
                (x.username.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")).includes(keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
    }, [actionLoading, keyword])

    const handleSearch = (event: ChangeEvent, data: any) => {
        setKeyword(data.value);
    }

    return (
        <Segment>
            <Input onChange={handleSearch} placeholder="Buscar usuarios" iconPosition="left" icon="search" fluid />
            <br />
            <Checkbox label="incluir borrados" checked={loadBorrados} onChange={() => setLoadBorrados(!loadBorrados)} />
            {results && results.filter(x => { if (!loadBorrados && x.borrado) return false; else return true; }).length > 0 &&
                <>
                    <br />
                    <Label basic style={{ border: "none" }} color="blue" content="Resultados" />
                    <SearchResult setUsuarioBorrar={props.setUsuarioBorrar} deleteUsuario={props.deleteUsuario} borrarConfirm={props.borrarConfirm} setBorrarConfirm={props.setBorrarConfirm} usuarioBorrar={props.usuarioBorrar} setSelectedUser={props.setSelectedUser} showDeleted={loadBorrados} showBorrarConfirm={props.showBorrarConfirm} results={results ? results : []} />
                </>
            }

        </Segment>
    )
});
