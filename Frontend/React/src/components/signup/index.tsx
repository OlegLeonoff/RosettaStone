import * as React from 'react';
import { useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';
import { Grid, Button, Card, CardActions,
         CardContent, Typography, makeStyles } from '@material-ui/core';
// import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../../store';
import NameTextField from '../name-text-field';
import EmailTextField from '../email-text-field';
import PasswordTextField from '../password-text-field';
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

const Signup = observer(() => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameIsValid, setNameIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
 

  const classes = useStyles();

  useEffect(() => { 
    store.setServerError('');
  }, []);
  
  useEffect(() => { 
    enableButtonSignup();
  }, [nameIsValid, emailIsValid, passwordIsValid]);


  const enableButtonSignup = () => {
    if(nameIsValid && emailIsValid && passwordIsValid) {
      setDisableButton(false);
    }
    else {
      setDisableButton(true);
    }
  }

  const handleNameData = (data: ITextFieldData) => {
    setName(data.text);
    setNameIsValid(data.isValid); 
  }

  const handleEmailData = (data: ITextFieldData) => {
    setEmail(data.text);
    setEmailIsValid(data.isValid); 
  }
  
  const handlePasswordData = (data: ITextFieldData) => {
    setPassword(data.text);
    setPasswordIsValid(data.isValid); 
  }

  const  handleSignupButton = async (e: SyntheticEvent) => {
    e.preventDefault();
    store.setServerError('');
    try{ 
      await store.authorization.signup({name, email, password});
    }
    catch (error){
      let serverError = error.response ? error.response.data : error.message;
      store.setServerError(serverError);
    }
  }
  
  const errorFromServer: JSX.Element = (
    <Typography className={classes.error} color="error">
      {store.serverError}
    </Typography>
  )


  if(store.authorization.auth) {
    // return <Redirect to='/send-money' />
  }
  
  return (
      <form>       
        <Typography variant='h6' color='inherit' align='center' className={classes.title}>
          Sign Up
        </Typography>
        <Grid container justify="center">
          <Card className={classes.card}>
            <CardContent>
              <NameTextField handleData={handleNameData}/>
              <EmailTextField handleData={handleEmailData}/>
              <PasswordTextField handleData={handlePasswordData}/>
              {store.serverError ? errorFromServer : null} 
            </CardContent>             
            <CardActions>
              <Button 
                onClick={handleSignupButton} 
                color="primary"
                disabled={disableButton}>
                Sign Up
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </form>
    );
});

export default Signup;