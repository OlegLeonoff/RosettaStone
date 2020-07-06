import * as React from "react";
import { useState, ChangeEvent } from "react";
import {Grid, Card, CardContent, Button, CardActions, 
  Typography, TextField, makeStyles } from '@material-ui/core';
import webApi from '../../web-api';
import store from '../../store';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import Autocompletion from '../autocompletion';
import { INameAndId } from "../../interfaces";


const useStyles = makeStyles({
  title: {
    marginTop: '24px',
    marginBottom: '24px'
  },
  error: {
    marginTop: '20px',
  },
  card: {
    maxWidth: '475px'
  }
});

const SendMoney = observer(() => {
  const [selectedUser, setSelectedUser] = useState('');
  const [amountStr, setAmountStr] = useState('0');
  const [disableButton, setDisableButton] = useState(true);
  
  const classes = useStyles();

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmountStr(e.target.value);
    if(e.target.value !== '0' && selectedUser !== '') {
      setDisableButton(false);
    }
  }

  const handleSendMoney = async () => {
    const amount = parseInt(amountStr, 10);
    try {
      const res = await store.transactions.sendMoney({ name: selectedUser, amount });
      store.authorization.setBalance(res.balance);
    }
    catch (error){
      let serverError = error.response ? error.response.data : error.message;
      store.setServerError(serverError);
    }
  }


  const errorFromServerElem = (
    <Typography className={classes.error} color="error">
      {store.serverError}
    </Typography>); 


  const setSelectedItem = (item: INameAndId) => {
    setSelectedUser(item.name);
    if(amountStr !== '0' && item.name !== '') {
      setDisableButton(false);
    }
  }


  const getFilteredUsers = (text: string) => {
    try {
      return webApi.getFilteredUsers(text);
    }
    catch(error) {
      let serverError = error.response ? error.response.data : error.message;
      store.setServerError(serverError);
    }
  }

  if(!store.authorization.auth) {
    return <Redirect to='/login' />
  }

  return (
  <form>
  <Typography variant='h6' color='inherit' align='center' className={classes.title}>
    Send money to
  </Typography>
  <Grid container justify="center">
    <Card className={classes.card}>
      <CardContent>
        <Autocompletion 
            getItems={getFilteredUsers}
            setSelectedItem={setSelectedItem}
        /> 
        <Grid container justify="center">
          <TextField
            className='amountField'
            id='number'
            label='Amount'
            value={amountStr}
            onChange={handleAmountChange}
            type='number'
            InputProps={{ 
              inputProps: { min: 0, max: store.authorization.userInfo.balance } 
            }}
            InputLabelProps={{
              shrink: true,
            }}
            margin='normal'
          />
        </Grid>
        {store.serverError ? errorFromServerElem : null} 
      </CardContent>
      <CardActions>
        <Button 
          color="primary" 
          onClick={handleSendMoney}
          disabled={disableButton}
        >
            Send
        </Button>
      </CardActions>
    </Card>
  </Grid>
</form>)

});

export default SendMoney;