import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import { Container } from "semantic-ui-react";
import NavBar from "./Navbar";
import HomePage from "../../features/home/HomePage";
import LoginPage from "../../features/home/LoginPage";
import Error from "../../features/errors/Error";

import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import PrivateRoute from "./PrivateRoute";
import UserProfile from "../../features/users/userProfile";
import UsuariosDashboard from "../../features/usuarios/dashboard/UsuariosDashboard";
import UsuarioEdit from "../../features/usuarios/form/UsuarioEdit";

function App() {
  const {
    userStore,
    commonStore,
  } = useStore();

  runInAction( () => {
     userStore.checkCreds();
  });
  if (!commonStore.appLoaded) return <LoadingComponent content='Cargando aplicación...' />

  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <NavBar />
      <Container style={{ marginTop: "5em" }}>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/login' component={LoginPage} />
          <PrivateRoute path='/usuarios/editar/:id' component={UsuarioEdit} />
          <PrivateRoute path='/usuarios' component={UsuariosDashboard} />
          <PrivateRoute path='/miPerfil' component={UserProfile} />
          <Route path='/server-error' component={ServerError} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Fragment>
  );
}

export default observer(App);
