import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Main from "./Main";
import { AuthProvider } from "../utils/Auth";
import SelectRole from "./SelectRole";
import PrivateRoute from "../utils/PrivateRoute";
import ExtraInfo from "./ExtraInfo";
class App extends Component {
  state = {};
  render() {
    return (
      <AuthProvider>
        <Router>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/selectrole" component={SelectRole} />
          <Route exact path="/extrainfo" component={ExtraInfo} />
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
