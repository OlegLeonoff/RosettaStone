import * as React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon,
         Hidden }from '@material-ui/core';
import store from '../../store';
import { observer } from 'mobx-react';



const logoutFn = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
  store.authorization.unauthorize();
  localStorage.removeItem("jwtToken");
}

const TheDrawer = observer(() => { 

  const sendMoney = (
    <ListItem button component={Link} to='/send-money'>
      <ListItemText primary="send money" />
    </ListItem>  
  );  

  const history = (
    <ListItem button component={Link} to='/transactions'>
      <ListItemText primary="history" />
    </ListItem>  
  );  
  
  const logout = (
    <ListItem button onClick={logoutFn}>
      <ListItemText primary="logout" />
    </ListItem>  
  );  
  
  const login = (
    <ListItem button component={Link} to='/login'>
      <ListItemText primary="login" />
    </ListItem>  
  );
  
  const signup = (
    <ListItem button component={Link} to='/signup'>
      <ListItemText primary="signup" />
    </ListItem>  
  );

  return(
    <List>
      {store.authorization.auth ? sendMoney : login}
      {store.authorization.auth ? history : signup}
      {store.authorization.auth ? logout : null}
    </List>
  );
});

export default TheDrawer;
