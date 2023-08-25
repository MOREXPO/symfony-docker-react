import { useField } from 'formik';
import { PropTypes } from 'mobx-react';
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
    defaultValue?:any;
    value?:any;
}

export default function MySelectInputOnChangeEventDisconnected(props: Props) {
    
    const handleChange = (value: any, e:any) => {
        props.onChange2(value);
    }
    return (
        <>
            <label>
                {props.label}
            </label>
            <Select 
                name={props.name}
                defaultValue={props.defaultValue}
                options={props.options}
                onChange={(e, d) => handleChange(d.value, e)}
                placeholder={props.placeholder}
                style={props.style}
                value={props.value}
            />
        </>
    )
}
