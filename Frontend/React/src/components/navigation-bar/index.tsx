import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, 
         Hidden, IconButton }from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import store from '../../store';
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles({
  title: {
    marginLeft: '12px',
    marginRight: '12px',
    flex: 1 
  },
  titleLink: {
    color: '#FFFFFF',
    textDecoration: 'none'
  },
  menuButton: {
    paddingRight: '6px'
  },
  userInfo: {
    marginRight: '12px'
  },
});


const NavigationBar = observer((props) => {

  useEffect(() => {
    (async () => {
      try{
        const token = localStorage.getItem("jwtToken");
        if(token) {
          const userInfo = await store.authorization.getUserInfo(token);
          if(userInfo) {
            store.authorization.authorizeAndSetUserInfo(userInfo);
          }
        }
      }
      catch(err){
        store.authorization.unauthorize();
        localStorage.removeItem("jwtToken");
      }
    })();
  }, []);

  const classes = useStyles();

  const logout = () => {
    store.authorization.unauthorize();
    localStorage.removeItem("jwtToken");
  };

  const logoutButton: JSX.Element = (
    <Hidden xsDown>
      <Button color='inherit' onClick={logout}>Log out</Button>
    </Hidden>);
  
  const loginButton: JSX.Element = (
    <Hidden xsDown>
      <Button color='inherit' component={Link} to='/login'>Login</Button>
    </Hidden>);
  
  const signupButton: JSX.Element = (
    <Hidden xsDown>
      <Button color='inherit' component={Link} to='/signup'>Sign Up</Button>
    </Hidden>);
    
  const sendMoneyButton: JSX.Element = (
    <Hidden xsDown>
      <Button color='inherit' component={Link} to='/send-money'>Send money</Button>
    </Hidden>);

  const transactionsButton: JSX.Element = (
    <Hidden xsDown>
      <Button color='inherit' component={Link} to='/transactions'>Transactions history</Button>
    </Hidden>);

  const userData = (
    <Typography className={classes.userInfo}>
      {store.authorization.userInfoString}
    </Typography>);

  const iconButton = (
    <Hidden smUp> 
      <IconButton
        className={classes.menuButton}
        color="inherit"
        aria-label="Menu"
        onClick={e => props.toggleDrawer()}
      >
        <MenuIcon />
      </IconButton> 
    </Hidden>);

    return(
          <AppBar position='static'>
            <Toolbar disableGutters>
              {iconButton}
              <Typography variant='h6' className={classes.title}>
                <Link to='/' className={classes.titleLink}>
                  Virtual Money
                </Link>
              </Typography>
                {store.authorization.auth ? userData : null}
                {store.authorization.auth ? sendMoneyButton : null}
                {store.authorization.auth ? transactionsButton : null}
                {store.authorization.auth ? logoutButton : loginButton}
                {store.authorization.auth ? null: signupButton}
            </Toolbar>
          </AppBar>)

})

export default NavigationBar;