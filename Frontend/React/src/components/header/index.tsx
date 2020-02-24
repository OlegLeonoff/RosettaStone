import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import NavigationBar from '../navigation-bar';
import TheDrawer from '../drawer';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false
  });

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    console.log('toggle');
    if (event && event.type === 'keydown' && 
    ((event as React.KeyboardEvent).key === 'Tab' ||
    (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, open: open });
  };

  return (
    <div>
      <NavigationBar toggleDrawer={toggleDrawer(true)} />
      <SwipeableDrawer
      open={state.open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      >
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <TheDrawer />
      </div>
    </SwipeableDrawer>     
    </div>
  );
}