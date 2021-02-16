import React, { Component } from "react";
import { addUser } from "../utils/Firestore";
import Navbar from "./Navbar";
import { Layout, Steps, Button } from "antd";
import FooterPage from "./footer";
const { Content } = Layout;
const { Step } = Steps;
class SelectRole extends Component {
  state = {};
  selectRole = async (val) => {
    const userUid = this.props.location.state.uid;
    if (val == "teacher") {
      await addUser(userUid, true);
    } else {
      await addUser(userUid, false);
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
        <FooterPage />
      </Layout>
    );
  }
}

export default SelectRole;
