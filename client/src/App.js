import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/LandingPage/LandingPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'

function App() {
  return (
    <Router>
      <div>
        
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          
          <Route exact path="/landing" component={LandingPage}/>
          
          <Route exact path="/login" component={LoginPage}/>
          
          <Route path="register">
            <RegisterPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}



export default App;
