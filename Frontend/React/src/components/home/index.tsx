import * as React from 'react';
import { Grid, Card, Typography, makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
    title: {
      marginTop: '24px',
      marginBottom: '24px'
    },
    error: {
      marginTop: '20px',
    },
    card: {
      maxWidth: '475px',
      padding: '6px'
    }
});


const Home = () => {

  const classes = useStyles();

  return(
    <>
      <Typography variant='h6' color='inherit' align='center' className={classes.title}>
        Virtual Money
      </Typography>
      <Grid container justify="center">
        <Card className={classes.card}>
          <Grid container justify="center">
            <img 
            alt="Virtual Money" 
            src="http://en.finance.sia-partners.com/sites/default/files/styles/700x400/public/post/visuels/istock_000046835322_medium_3.jpg?itok=r7d2N5R_"
            />
          </Grid>

          <p>
            This is a 'Virtual Money' system.
            Users can send to each other an amount of virtual money.
            Each user from the beginning has 500 units on his balance.
          </p>
          <p>
            Each transaction is stored in database and can be viewed on '/transactions' page.  
            This project demonstrates a way to communicate between backend and frontend being protected by an autorization token.
            During the login process frontend recieves that token and after that constantly sends this token in headers in all successive requests.
          </p>
          </Card>
        </Grid>
      </>);
}

export default Home;