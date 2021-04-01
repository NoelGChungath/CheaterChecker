//Noel Gregory
//2021-03-29
//This class will create the select role component

//imports
import React, { Component } from "react";
import { addUser } from "../utils/Firestore";
import Navbar from "./Navbar";
import { Layout, Steps, Button } from "antd";
import FooterSection from "./FooterSection";
import { AuthContext } from "../utils/Auth";
const { Content } = Layout;
const { Step } = Steps;

class SelectRole extends Component {
  static contextType = AuthContext;
  //This function will handle selecting role
  //val:Object:holds the object from the form
  selectRole = async (val) => {
    const { currentUser } = this.context;
    if (val == "teacher") {
      await addUser(currentUser.uid, true); // add a role to user
    } else {
      await addUser(currentUser.uid, false);
    } //end if val
    this.props.history.push("/extrainfo"); //push to history
  }; //end selectRole
  //This function will render the select role page
  //return:String:returns the select role page
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content style={{ padding: "5vh" }}>
          <div className="site-layout-content">
            <Steps size="small" current={1}>
              <Step title="Login" />
              <Step title="Select Role" />
              <Step title="Extra Info" />
            </Steps>
            <Button
              size="large"
              style={{ float: "center", margin: "10px" }}
              onClick={() => this.selectRole("student")}
              type="primary"
            >
              Student
            </Button>
            <Button
              size="large"
              style={{ float: "center", margin: "10px" }}
              onClick={() => this.selectRole("teacher")}
              type="primary"
            >
              Teacher
            </Button>
          </div>
        </Content>
        <FooterSection />
      </Layout>
    );
  } //end render
} //end class SelectRole

export default SelectRole;
