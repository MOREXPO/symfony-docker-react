import React, { useEffect } from "react";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Link } from 'react-router-dom';
import LoginForm from "../users/LoginForm";
import {observer} from "mobx-react";
import { history } from "../../app";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function HomePage() {
    const {userStore} = useStore();

    /*useEffect(() => {
        if (userStore.isLoggedIn) {
            history.push('/home');
        }
    }, [userStore.isLoggedIn]);*/

    return (
        <Segment textAlign='center' vertical className='masthead'>
            <Container>
                <Header as='h1'>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom:12}} />
                    PLANTILLA
                </Header>
                <LoginForm />
            </Container>
        </Segment>
    )
});
