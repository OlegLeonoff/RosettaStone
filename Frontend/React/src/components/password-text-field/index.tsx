import React, { useState, useEffect, ChangeEvent } from "react";
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

const PasswordTextField = (props: IProps) => {
  const [data, setData] = useState({isValid: false, message: 'This field is required', text: ''});
  const [blur, setBlur] = useState(false)
  const { handleData } = props;
  const classes = useStyles();

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data = verify(event.target.value);
    setData(data);
    handleData(data);
  }

  const onBlur = () => setBlur(true);

  const onFocus = () => setBlur(false);

  const isNotEmptyArray = (arr: string[] | null): boolean => arr !== null && arr.length > 0;

  const verify = (text: string): ITextFieldData => {
    const pureText = text.trim();
    if(!pureText) {
      return { isValid: false, message: 'This field is required', text };
    }
    let isValid = pureText.length >= 7; 
    if(!isValid) {
      return { isValid, message: 'A minimum of 7 characters is allowed', text } 
    }
    
    isValid = !isNotEmptyArray(pureText.match(/[^a-zA-Z\-_0-9]/g));
    if(!isValid) {
      return { isValid, 
               message: 'Password should contain latin letters, hyphen, underscores and digits only',
               text };
    }

    isValid = isNotEmptyArray(pureText.match(/[0-9]/g)) && 
              isNotEmptyArray(pureText.match(/[a-z]/g)) && 
              isNotEmptyArray(pureText.match(/[A-Z]/g));
    if(!isValid) {
      return { isValid,
               message: 'At least one digit, one lowercase and one uppercase letter',
               text };
    }

    return {isValid, message: '', text};
  }

  return (
    <TextField
      margin="dense"
      id="password"
      name="password"
      label="Password"
      type="password"
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

export default PasswordTextField;