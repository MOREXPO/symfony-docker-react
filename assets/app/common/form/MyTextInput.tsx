import { useField } from 'formik';
import React from 'react';
import { Form, Input, InputOnChangeData, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    type?: string;
    label?: string;
    fluid?: boolean;
    autoComplete?: string;
    size?: any;
    min?:number;
    max?:number;
    value?:any;
    disabled?:boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>
                {props.label}
            </label>
            <Input {...field} {...props} />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
