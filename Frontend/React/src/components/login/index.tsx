import * as React from 'react';
import { useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';
import { Grid, Button, Card, CardActions,
  CardContent, Typography, makeStyles } from '@material-ui/core';
import EmailTextField from '../email-text-field';
import PasswordTextField from '../password-text-field';
// import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../../store';
import { ITextFieldData } from '../../interfaces';


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


const Login = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  
  const classes = useStyles();
    
  useEffect(() => { 
    store.setServerError('');
  }, []);

  useEffect(() => { 
    enableLoginButton();
  }, [emailIsValid, passwordIsValid]);


  const enableLoginButton = () => {
    if(emailIsValid && passwordIsValid) {
      setDisableButton(false);
    }
    else {
      setDisableButton(true);
    }
  }

  const handleEmailData = (data: ITextFieldData) => {
    setEmail(data.text);
    setEmailIsValid(data.isValid);
  }
  
  const handlePasswordData = (data: ITextFieldData) => {
    setPassword(data.text);
    setPasswordIsValid(data.isValid); 
  }


  const handleLoginButton = async (e: SyntheticEvent) => {
    e.preventDefault();
    store.setServerError('');
    try{ 
      await store.authorization.login({email, password});
    }
    catch (error){
      let serverError = error.response ? error.response.data : error.message;
      store.setServerError(serverError);
    }
  }

  const errorFromServer = (
    <Typography className={classes.error} color="error">
      {store.serverError}
    </Typography> 
  )

  
  if(store.authorization.auth) {
    // return <Redirect to='/send-money' />
    return (<h1>Redirect</h1>);
  }
  return ( 
      <form>
          <Typography variant='h6' color='inherit' align='center' className={classes.title}>
            Login
          </Typography>
          <Grid container justify="center">
            <Card className={classes.card}>
              <CardContent>
                <EmailTextField handleData={handleEmailData}/>
                <PasswordTextField handleData={handlePasswordData}/>
                {store.serverError ? errorFromServer : null} 
              </CardContent>
              <CardActions>
                <Button 
                  onClick={handleLoginButton} 
                  color="primary"
                  disabled={disableButton}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </form>
    );
  });

export default Login