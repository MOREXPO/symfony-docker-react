import React from "react";
import { Button, Label, Segment, Input, Header, Grid } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { ErrorMessage, Formik, Form, FormikErrors, FormikHelpers } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import * as Yup from 'yup';
import ValidationErrors from "../errors/ValidationErrors";
import { UserFormRoles, UserFormValues } from "../../app/models/user";

export default function LoginForm() {
    const { userStore } = useStore();

    const loginValidation = Yup.object({
        username: Yup.string().required('El nombre de usuario es obligatorio'),
        password: Yup.string().required('La contraseña es obligatoria')
    })
    const registerValidation = Yup.object({
        email: Yup.string().required('El email es obligatorio').matches(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, 'El email tiene un formato inválido'),
        password: Yup.string().required('La contraseña es obligatoria'),
        passwordConfirmation: Yup.string().required('Vuelva a escribir la contraseña').oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    })

    const handleLoginSubmit = async (values: UserFormValues, actions: FormikHelpers<UserFormValues>): Promise<any> => {
        await userStore.login(values)
            .then()
            .catch((error: any) => {
                if (!Array.isArray(error)) {
                    error = ["credenciales no válidos"];
                }
                actions.setErrors({ error });
            });
        await userStore.checkCreds();
        return null;
    }
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width="8">
                    <Header color="blue" content="Iniciar sesión" />
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        onSubmit={(values, actions) => handleLoginSubmit(values, actions)}
                        validationSchema={loginValidation}
                        key="login"
                    >
                        {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                            <Form key="login">
                                <MyTextInput name='username' placeholder='Username' autoComplete='off' fluid={true} />
                                <br />
                                <MyTextInput type='password' name='password' placeholder='Password' autoComplete='off' fluid={true} />
                                <br />

                                <Button loading={isSubmitting} disabled={!isValid} color="blue" content='Entrar' type='submit' fluid />
                            </Form>
                        )}
                    </Formik>
                </Grid.Column>
                <Grid.Column width="8">
                    <Header color="blue" content="Registrar usuario" />
                    <Formik

                        initialValues={{ email: '', password: '', error: null }}
                        onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => setErrors({ error: 'Error en el registro: ' + error }))}
                        validationSchema={registerValidation}
                        key="register"
                    >
                        {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                            <Form key="register" id="register">
                                <MyTextInput name='email' placeholder='e-mail' autoComplete='off' fluid={true} />
                                <br />
                                <MyTextInput type='password' name='password' placeholder='Contraseña' autoComplete='off' fluid={true} />
                                <br />
                                <MyTextInput type='password' name='passwordConfirmation' placeholder='Verificar contraseña' autoComplete='off' fluid={true} />
                                <br />
                                <ErrorMessage
                                    name='error'
                                    render={() => <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                                />
                                <Button loading={isSubmitting} disabled={!isValid || !dirty} positive content='Registrar' type='submit' fluid />
                            </Form>
                        )}
                    </Formik>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
