import React from "react";
import { Button, Label, Segment, Input, Header, Grid } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { ErrorMessage, Formik, Form, FormikErrors, FormikHelpers } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import { UserPasswordFormValues } from "../../app/models/user";
import ValidationErrors from "../errors/ValidationErrors";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

export default observer(function UserProfile() {
    const { userStore } = useStore();
    const history = useHistory();
    const {updatePassword, getId} = userStore;
    const validationSchema = Yup.object({
        password: Yup.string().required('La cotraseña actual es obligatoria'),
        newPassword: Yup.string().required('La nueva contraseña es obligatoria'),
        newPasswordConfirm: Yup.string().required('Vuelva a escribir la nueva contraseña').oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
    });

    var accountId = getId();

    if (!accountId || accountId == "") {
        return <Segment>Error: Cuenta errónea.</Segment>
    }

      async function handleFormSubmit(account: UserPasswordFormValues, actions: FormikHelpers<UserPasswordFormValues>
        ): Promise<any> {
      
            let newPassForm: UserPasswordFormValues = { ...account, id:accountId };
      
            await updatePassword(newPassForm)
              .then(function (value) {
                toast.success("Ok");
                actions.setSubmitting(false);
                actions.resetForm();
              }, function (error) {
                actions.setSubmitting(false);
                throw error;
              }).catch(error => actions.setErrors({ error }));
            return null;
        }      

    return (
    <>
        <Segment clearing>
            <Header content="Cambiar contraseña" color="blue" />
            <Formik validationSchema={validationSchema} enableReinitialize
                initialValues={{ id: accountId, newPassword: "", newPasswordConfirm: "", password:"", error: null }}
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
              <br />
              <Grid>
                
                <Grid.Row>
                  <Grid.Column width="16">
                    <Label content='Contraseña actual' size='tiny' ribbon />
                    <MyTextInput type="password" name='password' placeholder='contraseña actual' autoComplete='off' />
                  </Grid.Column>
                </Grid.Row>
                
                <Grid.Row>
                  <Grid.Column width="16">
                    <Label content='Nueva contraseña' size='tiny' ribbon />
                    <MyTextInput type="password" name='newPassword' placeholder='nueva contraseña' autoComplete='off' />
                  </Grid.Column>
                </Grid.Row>
                
                <Grid.Row>
                  <Grid.Column width="16">
                    <Label content='Confirma Nueva contraseña' size='tiny' ribbon />
                    <MyTextInput type="password" name='newPasswordConfirm' placeholder='nueva contraseña' autoComplete='off' />
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <br />
                <Button
                  disabled={isSubmitting || !dirty || !isValid}
                  loading={isSubmitting}
                  floated='right'
                  type='submit'
                  color={'blue'}
                  content={'Actualizar'}
                />

            </Form>
          )}
        </Formik>
        </Segment>
    </>
    );
});
