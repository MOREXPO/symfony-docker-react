import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops - Hemos buscado por todas partes y no hemos encontrado esta página.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/' primary>
                    volver a la página principal
                </Button>
            </Segment.Inline>
        </Segment>
    )
}
