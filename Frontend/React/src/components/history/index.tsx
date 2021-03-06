import * as React from 'react';
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import { observer } from 'mobx-react';
import store from '../../store';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { CircularProgress,  Grid, Typography } from '@material-ui/core'; 


interface IColumn {
  title: string,
  field: string
}

const useStyles = makeStyles({
  title: {
    marginTop: '24px',
    marginBottom: '24px'
  },
  error: {
    marginTop: '20px',
  },
  table: {
    maxWidth: '475px'
  },
  progress: {
    marginTop: '100px'
  }
});

const History = observer(() => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {(async () => {
    setLoading(true);
    try {     
      store.transactions.getTransactions();
    }
    catch (error){
      let serverError = error.response ? error.response.data : error.message;
      store.setServerError(serverError);
    }
    finally {
      setLoading(false);
    }
  })()}, []);

  const classes = useStyles();


  const columns: IColumn[] = [
    { title: 'Id', field: 'id' },
    { title: 'Date', field: 'date' },
    { title: 'Name', field: 'username'},
    { title: 'Amount', field: 'amount'},
    { title: 'Balance', field: 'balance'},
  ]

  if(!store.authorization.auth) {
    return <Redirect to="/login" />
  } 

    return (
        <>
          <Typography variant='h6' color='inherit' align='center' className={classes.title}>
            Transactions
          </Typography>
          <Grid container justify="center">
              {loading ?          
                <div><CircularProgress color="inherit" size={20} className={classes.progress} /></div> :
                <div className={classes.table}>
                  <MaterialTable
                    title="History"
                    columns={columns}
                    data={store.transactions.transactions}
                  />
                </div>
              }
          </Grid>
        </>
  );
})

export default History