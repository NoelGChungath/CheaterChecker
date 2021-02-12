import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../utils/base.js";
import firebase from "firebase";
import { AuthContext } from "../utils/Auth.js";

const Login = () => {
  const googleLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    app.auth().signInWithRedirect(provider);
  };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <button onClick={googleLogin}>OnClick</button>
    </div>
  );
};

export default withRouter(Login);
