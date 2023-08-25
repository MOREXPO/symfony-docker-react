import React, { useEffect, useState } from "react";
import { Container, Header, Segment, Image, List } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import {observer} from "mobx-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { toJS } from "mobx";

export default observer(function HomePage() {
    const {userStore, modalStore} = useStore();

    return (
        <Segment textAlign='center' vertical className='masthead'>
            <Container>
                <Header as='h1'>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom:12}} />
                    PLANTILLA
                </Header>
                
            </Container>
        </Segment>
    )
});
