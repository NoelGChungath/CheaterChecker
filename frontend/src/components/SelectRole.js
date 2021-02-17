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
  selectRole = async (val) => {
    const { currentUser } = this.context;
    if (val == "teacher") {
      await addUser(currentUser.uid, true);
    } else {
      await addUser(currentUser.uid, false);
    }
    this.props.history.push("/extrainfo");
  };
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
  }
}

export default SelectRole;
