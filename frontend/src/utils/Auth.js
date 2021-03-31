//Noel Gregory
//2021-03-30
//This file will check if user is authenticated

//imports
import React, { Component } from "react";
import { app } from "./base";
import { Spin } from "antd";
import { checkUserExist, getUserRole } from "./Firestore";
import { withRouter } from "react-router-dom";

export const AuthContext = React.createContext(); //create react context

class AuthProvider extends Component {
  state = {
    currentUser: null,
    photoUrl: null,
    loader: true,
    status: null,
    sendUser: false,
  };
  style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
  };

  //This function will create auth trigger
  componentDidMount() {
    app.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({
          currentUser: user,
          status: null,
        });
      } else {
        this.setState({
          currentUser: null,
          loader: false,
        });
      } //end if user
    });
  } //end componentDidMount

  //This function will check if a user exists
  checkUser = async () => {
    let { currentUser, sendUser } = this.state;
    const { history } = this.props;
    if (currentUser != null && sendUser == false) {
      let res = await checkUserExist(currentUser.uid);
      let temp = "";
      if (res) {
        temp = "/selectrole";
      } else {
        temp = "/";
      } //end if res
      sendUser = true;
      history.push(temp);
      this.setState({ currentUser, sendUser });
    } //end if currentUser and sendUser
  }; //end checkUser

  //This function will get user role
  //onForce:Boolean:force user to get role
  getRole = async (onForce) => {
    const { currentUser, status } = this.state;
    if (currentUser != null && status == null) {
      const data = await getUserRole(currentUser.uid);
      this.setState({ status: data, loader: false });
    } else if (onForce == true) {
      const data = await getUserRole(currentUser.uid);
      console.log("////////");
      console.log(data);
      this.setState({ status: data, loader: false });
    } //end if currentUser and status
  }; //end getRole

  //This function will check if user exist and get there role
  componentDidUpdate() {
    this.checkUser();
    this.getRole();
  } //end componentDidUpdate

  //This function will render the auth component
  //return:JSX:contains the auth render component
  render() {
    const { currentUser, loader, status } = this.state;
    if (loader) {
      return (
        <div style={this.style}>
          <Spin size="large" tip="Loading..." />
        </div>
      );
    } else {
      return (
        <AuthContext.Provider
          value={{ currentUser, status, getRole: this.getRole }}
        >
          {this.props.children}
        </AuthContext.Provider>
      );
    } //end loader
  } //end render
} //endclass AuthProvider

export default withRouter(AuthProvider);
