import React from "react";
import { Link } from "react-router-dom";
import { Button, Confirm, Icon, Segment, Table, TableBody, TableCell, TableRow } from "semantic-ui-react";
import { User } from "../../../app/models/user";

interface Props {
    results: User[];
    showDeleted: boolean;
    showBorrarConfirm: (persona: User) => void;
    setSelectedUser: (value: React.SetStateAction<User>) => void;
    usuarioBorrar: User;
    deleteUsuario: () => Promise<void>;
    borrarConfirm: boolean;
    setBorrarConfirm: (value: React.SetStateAction<boolean>) => void;
    setUsuarioBorrar: React.Dispatch<React.SetStateAction<User>>;
}

export default function SearchResult({results, showBorrarConfirm, showDeleted, setSelectedUser, usuarioBorrar, deleteUsuario, borrarConfirm, setBorrarConfirm, setUsuarioBorrar}: Props) {
    
    return (
        <Segment basic style={{maxHeight:"150px", overflowY:"scroll",marginTop:"0px",padding:'0'}}>
        <Table striped>
            <TableBody>
            {results && results.filter(x => { if (!showDeleted && x.borrado) return false; else return true}).map(account => (
                <TableRow key={account.id} className={account.borrado ? 'rowBorrado' : ''}>

                    <Table.Cell width="5">{account.username}</Table.Cell>
                    
                    
                <TableCell width="6">
                <Button style={{ marginLeft: '10px' }} floated="left" positive={account.borrado} size="mini" basic icon title="Borrar / Reactivar" onClick={() => showBorrarConfirm(account)}> <Icon name={account.borrado ? "check" : "close"} /> {account.borrado ? "Reactivar" : "Borrar"} </Button>
                                    <Confirm 
                                        content={usuarioBorrar && usuarioBorrar.borrado ? "Está seguro de reactivar a éste  usuario?" : usuarioBorrar &&  "Está seguro de querer deshabilitar a éste usuario?"}
                                        confirmButton={usuarioBorrar &&  usuarioBorrar.borrado ? <Button positive content="Sí" icon="recycle" /> : usuarioBorrar && <Button negative content="Sí" icon="trash" />}
                                        cancelButton={usuarioBorrar &&  usuarioBorrar.borrado ? <Button negative content="No" /> : usuarioBorrar && <Button positive content="No" />}
                                        open={borrarConfirm}
                                        onConfirm={deleteUsuario}
                                        onCancel={() => {
                                            setBorrarConfirm(false);
                                            setUsuarioBorrar(null);
                                        }}
                                    />
                                   
                                     
                                  
                                     
                                    <Button style={{ marginLeft: '10px' }} size="mini" as={Link} to={'/usuarios/editar/' + account.id} basic icon title="Editar"> <Icon color="yellow" name="pencil" /> Editar </Button>
                </TableCell>
                
                </TableRow>
            ))}
        </TableBody>
        </Table>
        </Segment>
    );
}