import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';


export default observer(function NavBar() {
    const { userStore: { user, logout, isLoggedIn } } = useStore();

    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
                    PLANTILLA
                </Menu.Item>
                <Menu.Item as={NavLink} to='/item1' name='Item 1' />
                <Menu.Item as={NavLink} to='/item2' name='Item 2' />
                {user && user.roles && user.roles.some(x => x == "ROLE_ADMIN") && <Menu.Item as={NavLink} to='/usuarios' name='Usuarios' />}

                {isLoggedIn ? <Menu.Item position='right'>
                    <Dropdown pointing='top left' text={user?.username}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/miPerfil`} text='Mi perfil' icon='user' />
                            <Dropdown.Item onClick={logout} text='Salir' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item> : <Menu.Item position='right' as={NavLink} to='/login' name='Iniciar sesión' />}
            </Container>
        </Menu>
    )
})
