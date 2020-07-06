import * as React from 'react';
import { render } from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import Home from './components/home';
import Header from "./components/header";
import { BrowserRouter as Router, Route } from "react-router-dom";


const SendMoney = React.lazy(() => import('./components/send-money'));
const Login = React.lazy(() => import('./components/login'));
const History = React.lazy(() => import('./components/history'));
const Signup = React.lazy(() => import('./components/signup'));

const App = () => {
  return ( 
    <Router>        
      <CssBaseline />
      <Header />
          <Route path="/send-money"
                 render={() => {return <React.Suspense fallback={<div>Loading</div>}>
                 <SendMoney />
                 </React.Suspense>}} />    
          <Route path="/transactions" 
                 render={() => {return <React.Suspense fallback={<div>Loading</div>}>
                 <History />
                 </React.Suspense>}} />        
          <Route path="/login" 
                 render={() => {return <React.Suspense fallback={<div>Loading</div>}>
                  <Login />
                 </React.Suspense>}} />    
          <Route path="/signup" 
                 render={() => {return <React.Suspense fallback={<div>Loading</div>}>
                 <Signup />
                 </React.Suspense>}} />        
          <Route exact path="/" component={Home} />
    </Router> 
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement); 
