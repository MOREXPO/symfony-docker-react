import React from 'react';
import { Message } from 'semantic-ui-react';
interface Props {
    errors: any;
}
export default function ValidationErrors({errors} : Props)
{
    var objectConstructor = ({}).constructor;
    
    return (
        <Message error>
            {errors && 
                <Message.List>
                    <Message.Header>Oooopss...</Message.Header>
                    {errors.map((err: any, i: any) => (
                        <Message.Item key={i}>{err.constructor === objectConstructor ? JSON.stringify(err) : err}</Message.Item>
                    ))}
                </Message.List>
            }
        </Message>
    )
}
