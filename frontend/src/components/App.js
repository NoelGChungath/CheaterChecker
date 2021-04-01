//Noel Gregory
//2021-03-31
//This class contains all the routes for the react website
import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Main from "./Main";
import AuthProvider from "../utils/Auth";
import SelectRole from "./SelectRole";
import PrivateRoute from "../utils/PrivateRoute";
import ExtraInfo from "./ExtraInfo";
import Classes from "./Classes";
import Assessment from "./Assessment";
import Room from "./room";
import Whiteboard from "./whiteboard";
import Settings from "./Settings";

class App extends Component {
  //This function will render the app component and all the routes
  //return:String:contaisn the app jsx expression
  render() {
    return (
      <Router>
        <AuthProvider>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/classes" component={Classes} />
          <PrivateRoute exact path="/setting" component={Settings} />
          <PrivateRoute path="/room" component={Room} />
          <PrivateRoute exact path="/assessment" component={Assessment} />
          <PrivateRoute exact path="/whiteboard" component={Whiteboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/selectrole" component={SelectRole} />
          <Route exact path="/extrainfo" component={ExtraInfo} />
        </AuthProvider>
      </Router>
    );
  }
} //end class App

export default App;
