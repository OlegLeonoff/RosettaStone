import * as React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import { TextField, makeStyles } from '@material-ui/core';
import { ITextFieldData } from '../../interfaces';

const useStyles = makeStyles({
  textField: {
    width: '100%',
  },
});

interface IProps {
  handleData(textFieldData: ITextFieldData): void
}

const EmailTextField = (props: IProps) => {
  const [data, setData] = useState({isValid: false, message: 'This field is required', text: ''});
  const [blur, setBlur] = useState(false);
  const { handleData } = props;
  const classes = useStyles();

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data = verify(event.target.value);
    setData(data);
    handleData(data);
  }

  const onBlur = () => setBlur(true);

  const onFocus = () => setBlur(false);

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  const validateEmail = (email: string): boolean => {
    const res = email.toLowerCase().match(re);
    return res !== null && res.length > 0; 
  };

  const verify = (text: string) => {
    if(!text.trim()) {
      return { isValid: false, message: 'This field is required', text };
    }
    const isValid = validateEmail(text.trim());
    if(!isValid) {
      return {isValid, message: 'Email is not valid', text};
    }
    return {isValid, message: '', text};
  }

  return (
    <TextField
      margin="dense"
      id="email"
      name="email"
      label="Email"
      type="email"
      onChange={onTextChange}
      onBlur={onBlur}
      onFocus={onFocus}
      error={blur ? !data.isValid : false}
      helperText={blur ? data.message : ''}
      className={classes.textField}
      fullWidth
    />
  );
}

export default EmailTextField;