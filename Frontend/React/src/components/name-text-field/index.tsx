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

const NameTextField = (props: IProps) => {
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

  const verify = (text: string) => {
    if(!text.trim()) {
      return { isValid: false, message: 'This field is required', text };
    }
    const isValid = text.trim().indexOf(' ') === -1;
    if(!isValid) {
      return {isValid, message: 'Name cannot contain spaces', text};
    }
    return {isValid, message: '', text};
  }

  return (
    <TextField
      margin="dense"
      id="name"
      name="name"
      label="Name"
      type="text"
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

export default NameTextField;