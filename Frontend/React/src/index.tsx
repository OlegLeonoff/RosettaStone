import * as React from "react";
import { render } from "react-dom";
import SendMoney from "./components/send-money";
import History from "./components/history";
import Login from "./components/login";
import Signup from "./components/signup";
import Header from "./components/header";
import Home from "./components/home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";


function App() {
  return (
      <Router>
        <CssBaseline />
          <Header />
          <Route path="/send-money" component={SendMoney} />    
          <Route path="/transactions" component={History} />    
          <Route path="/login" component={Login} />    
          <Route path="/signup" component={Signup} />    
          <Route exact path="/" component={Home} />    
      </Router>  
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
