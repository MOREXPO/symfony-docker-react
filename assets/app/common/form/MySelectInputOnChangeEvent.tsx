import { useField } from 'formik';
import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
    style?:any;
    className?:any;
    onChange2?: any;
    value?:any;
    fluid?:boolean;
}

export default function MySelectInputOnChangeEvent(props: Props) {
    const [field, meta, helpers] = useField(props.name);
    const handleChange = (value: any, e:any) => {
        helpers.setValue(value);
        props.onChange2(value);
    }
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>
                {props.label}
            </label>
            <Select 
                options={props.options}
                value={field.value || null}
                onChange={(e, d) => handleChange(d.value, e)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
                fluid={props.fluid || true}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
