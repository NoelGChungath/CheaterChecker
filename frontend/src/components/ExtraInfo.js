import React, { Component } from "react";
import "./ui.css";
import { AuthContext } from "../utils/Auth.js";
import { addInfo } from "../utils/Firestore";
import Navbar from "./Navbar";
import { Layout, Steps, Button, Form, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import FooterSection from "./FooterSection";
const { Content } = Layout;
const { Step } = Steps;

class ExtraInfo extends Component {
  static contextType = AuthContext;
  getFormData = async (value) => {
    console.log(value);
    const { currentUser } = this.context;
    await addInfo(value, currentUser.uid);
    this.props.history.push("/");
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content style={{ padding: "5vh" }}>
          <div className="site-layout-content">
            <Steps size="small" current={2}>
              <Step title="Login" />
              <Step title="Select Role" />
              <Step title="Extra Info" />
            </Steps>
            <Form layout="vertical" onFinish={this.getFormData}>
              <Form.Item
                label="Nickname"
                className="info"
                name="nickname"
                required
                tooltip="This is a required field"
              >
                <Input className="infoInput" placeholder="input placeholder" />
              </Form.Item>
              <Form.Item
                label="Status Info"
                name="status"
                className="info"
                tooltip={{
                  title: "Tooltip with customize icon",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input className="infoInput" placeholder="input placeholder" />
              </Form.Item>
              <Form.Item className="info">
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
                <Button
                  style={{ float: "center", margin: "10px" }}
                  onClick={() => this.props.history.push("/")}
                  type="primary"
                >
                  Skip
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
        <FooterSection />
      </Layout>
    );
  }
}

export default ExtraInfo;
