import { action, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Confirm, Icon, Image, Label, Pagination, Segment, Tab, Table, TabProps } from 'semantic-ui-react';
import agent from "../../../app/api/agent";
import MySelectInputOnChangeEventDisconnected from "../../../app/common/form/MySelectInputOnChangeEventDisconnected";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import CustomSearch from "../search/CustomSearch";
import MySelectInputOnChangeEvent from "../../../app/common/form/MySelectInputOnChangeEvent";
import { User } from "../../../app/models/user";


export default observer(function UsuariosDashboard() {

    const { accountStore, userStore } = useStore();
    const { } = userStore;
    const { load: loadAccounts, loaded: accountsLoaded, loadingInitial: accountsLoading, get: getAccounts, cambiarEstado, vincularAPersona, loading: actionLoading, desvincularAPersona } = accountStore;
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const [accountList, setAccountList] = useState<User[]>([]);
    const [accounts, setAccounts] = useState<User[]>([]);
    const [borrarConfirm, setBorrarConfirm] = useState<boolean>(false);

    const [usuarioBorrar, setUsuarioBorrar] = useState<User>(null);

    const [page, setPage] = useState<number>(1);
    const [pageList, setPageList] = useState<number>(1);
    const usuariosPorPagina = 15;
    const [selectedUser, setSelectedUser] = useState<User>(null);
    const [linkAction, setLinkAction] = useState<string>(null);

    useEffect(() => {
       
        if (userStore.isLoggedIn && !accountsLoaded && !accountsLoading)
            loadAccounts();
        if (userStore.isLoggedIn && accountsLoaded)
            setAccounts(getAccounts);
    }, [accountsLoaded])


    useEffect(() => {
        setAccountList(getAccounts.filter(x => x.borrado === showDeleted).slice((page - 1) * usuariosPorPagina, (page - 1) * usuariosPorPagina + usuariosPorPagina));
        setPageList(getAccounts.filter(x => x.borrado === showDeleted).length / usuariosPorPagina);
        setPage(1);
        setAccounts(getAccounts);
    }, [accountsLoaded, accountsLoading, actionLoading]);

    useEffect(() => {
        setAccountList(getAccounts.filter(x => x.borrado == showDeleted).slice((page - 1) * usuariosPorPagina, (page - 1) * usuariosPorPagina + usuariosPorPagina));
        setPageList(getAccounts.filter(x => x.borrado == showDeleted).length / usuariosPorPagina);
    }, [showDeleted, page, actionLoading]);
    useEffect(() => {
        if (usuarioBorrar !== null) {
            setBorrarConfirm(true);
        }
    }, [usuarioBorrar])

    if (accountsLoading) return <LoadingComponent content="Cargando usuarios..." />


    const handleTabChange = async (value: string | number) => {
        if (value === 1)
            setShowDeleted(true)
        else
            setShowDeleted(false);
    }

    const showBorrarConfirm = (usuario: User) => {
        setUsuarioBorrar(usuario);
    }


    const deleteUsuario = async () => {
        if (usuarioBorrar !== null)
            await cambiarEstado(usuarioBorrar.id).then(() => {
                runInAction(() => {
                    toast.success("Ok");
                    setBorrarConfirm(false);
                    setUsuarioBorrar(null);
                });
            }, function (error) {
                runInAction(() => {
                    runInAction(() => {
                        setBorrarConfirm(false);
                        setUsuarioBorrar(null);
                        error.map((error: string) => toast.error(error));
                    });
                    throw error;
                });

            }
            ).catch((error) => {
                console.log(error);
            });

    }

    return (


        <>  <CustomSearch  setUsuarioBorrar={setUsuarioBorrar} borrarConfirm={borrarConfirm} setBorrarConfirm={setBorrarConfirm} deleteUsuario={deleteUsuario} usuarioBorrar={usuarioBorrar} showDeleted={showDeleted} showBorrarConfirm={showBorrarConfirm} personas={accounts} setSelectedUser={setSelectedUser}  />



            <Tab activeIndex={showDeleted ? 1 : 0} panes={[{ menuItem: "Activos" }, { menuItem: "Borrados" }]} onTabChange={(e, data) => handleTabChange(data.activeIndex)}></Tab>
            {accountList.length > 0 ?
                <>
                    <Segment basic loading={accountsLoading}>
                        <Table celled >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width='1'>email</Table.HeaderCell>
                                    <Table.HeaderCell width='7'>Opciones</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>


                            <Table.Body>
                                {accountList && accountList.map(account => (
                                    <Table.Row key={account.id}>
                                        <Table.Cell>{account.username}</Table.Cell>
                                        <Table.Cell textAlign="right">
                                            <Button style={{ marginLeft: '10px' }} floated="left" positive={account.borrado} size="mini" basic icon title="Borrar / Reactivar" onClick={() => showBorrarConfirm(account)}> <Icon color={account.borrado ? "green" : "red"} name={account.borrado ? "recycle" : "close"} /> {account.borrado ? "Reactivar" : "Borrar"} </Button>
                                            <Confirm
                                                content={usuarioBorrar && usuarioBorrar.borrado ? "Está seguro de reactivar a éste  usuario?" : usuarioBorrar && "Está seguro de querer deshabilitar a éste usuario?"}
                                                confirmButton={usuarioBorrar && usuarioBorrar.borrado ? <Button positive content="Sí" icon="recycle" /> : usuarioBorrar && <Button negative content="Sí" icon="trash" />}
                                                cancelButton={usuarioBorrar && usuarioBorrar.borrado ? <Button negative content="No" /> : usuarioBorrar && <Button positive content="No" />}
                                                open={borrarConfirm}
                                                onConfirm={deleteUsuario}
                                                onCancel={() => {
                                                    setBorrarConfirm(false);
                                                    setUsuarioBorrar(null);
                                                }}
                                            />
                                            <Button style={{ marginLeft: '10px' }} size="mini" as={Link} to={'/usuarios/editar/' + account.id} basic icon title="Editar"> <Icon color="yellow" name="pencil" /> Editar </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>

                        </Table>
                        {pageList > 1 && <Pagination defaultActivePage={1} totalPages={pageList} onPageChange={(e, data) => setPage(data.activePage as number)} />}
                    </Segment>
                </>
                : <Segment>
                    {showDeleted ? "No hay usuarios borrados" : "No se han creado Usuarios aún"}
                </Segment>}
        </>
    )
})
