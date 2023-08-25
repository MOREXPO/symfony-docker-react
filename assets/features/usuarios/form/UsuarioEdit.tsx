import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Checkbox, Header, Label, List, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { Formik, Form, FormikHelpers, ErrorMessage, Field } from "formik";
import ValidationErrors from "../../errors/ValidationErrors";
import { toast } from "react-toastify";
import { User, UserFormRoles, UserFormValues } from "../../../app/models/user";


export default observer(function UsuarioEdit() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { accountStore, userStore, rolStore } = useStore();
    const { usuariosRegistry, load: loadAccounts, getById, loaded: accountsLoaded, loadingInitial: loadingAccount, update } = accountStore;
    const { load, loadingInitial: loadingRoles, loaded: rolesLoaded, getRoles } = rolStore;
    const [usuario, setUsuario] = useState<User>();
    const [loadingComponent, setLoadingComponent] = useState<boolean>(true);
    const [errors, setErrors] = useState<any>();
    const [formValues, setFormValues] = useState<UserFormRoles>(undefined);

    useEffect(() => {
        if (userStore.isLoggedIn && !accountsLoaded && !loadingAccount)
            loadAccounts();
        if (userStore.isLoggedIn && !rolesLoaded && !loadingRoles)
            load();

    }, [accountsLoaded, rolesLoaded]);

    useEffect(() => {
        setFormValues(new UserFormRoles(usuario));
    }, [usuario]);

    useEffect(() => {
        if (userStore.isLoggedIn && accountsLoaded && id && usuariosRegistry.size > 0) {
            setUsuario(getById(id));
        }
        else if (accountsLoaded && usuariosRegistry.size < 1) {
            setLoadingComponent(false);
            history.push('/');
        }
    }, [accountsLoaded, usuario]);


    async function handleFormSubmit(usuario: UserFormRoles, actions: FormikHelpers<UserFormRoles>
    ): Promise<any> {
        await update(usuario).then(function (value) {
            //history.push(`/cursos/${newcurso.id}`); 
            //window.location.reload();
            toast.success("Ok!");
            actions.resetForm({ values: usuario });
        }, function (error) {
            actions.setSubmitting(false)
            throw error;
        }).catch(error => actions.setErrors({ error }));
        return null;
    }

    if (loadingAccount) return <LoadingComponent content="Cargando usuarios" />;
    if (loadingRoles) return <LoadingComponent content="Cargando roles" />;

    return (
        <>
            {errors && <Segment color="red">
                {errors.map((error: string) => error)}
            </Segment>}

            {usuario && usuario.id &&

                <Segment clearing loading={loadingRoles}>
                    <Formik enableReinitialize
                        initialValues={{ ...formValues, error: null }}
                        onSubmit={(values, actions) => {
                            handleFormSubmit(values, actions);
                        }
                        }
                    >
                        {({ handleSubmit, isValid, dirty, isSubmitting, setSubmitting, errors, values }) => (
                            <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                                <ErrorMessage
                                    name='error' render={() =>
                                        <ValidationErrors errors={errors.error} />
                                    } />

                                <Label content={formValues.id + " - " + " " + formValues.username} color="blue" basic style={{ border: 'none' }} />
                                <br />
                                <Label content='Email' size='tiny' ribbon />
                                <Field type="text" name='username' placeholder='username' />
                                <br />
                                <Header sub content="Roles" color="blue" />
                                <br />
                                <Segment secondary attached clearing>
                                    {getRoles && getRoles.map(rol => (
                                        <div key={rol.id} style={{ float: "left", margin: "15px" }}>
                                            <label>
                                                <Field type="checkbox" name="roles" value={rol.codigo} />
                                                {rol.nombre}
                                            </label>
                                        </div>
                                    ))}
                                </Segment>
                                <br />
                                <Button.Group floated='right'>
                                    <Button
                                        as={Link}
                                        to={`/usuarios`}
                                        floated='right'
                                        type='button'
                                        content='Cancelar'
                                    />
                                    <Button
                                        disabled={isSubmitting || !dirty || !isValid}
                                        loading={isSubmitting}
                                        floated='right'
                                        basic={!dirty || !isValid}
                                        type='submit'
                                        color={'blue'}
                                        content={'Actualizar'}
                                    />
                                </Button.Group>
                            </Form>
                        )}
                    </Formik>
                </Segment>
            }
        </>
    );
});
