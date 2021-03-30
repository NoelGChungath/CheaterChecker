//Noel Gregory
//2021-03-29
//This class will create main component

//imports
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Main extends Component {
  //This function will render the main page component
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Start using Cheater Checker</p>
          <Link className="App-link" to="/login">
            Login
          </Link>
        </header>
      </div>
    );
  } //end render
} //end class Main

export default Main;
