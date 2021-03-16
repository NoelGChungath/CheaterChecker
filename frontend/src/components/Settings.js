import React, { Component } from "react";
import "./ui.css";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Card, Button, Form, Input } from "antd";
import SiderBar from "./SideBar";
import { AuthContext } from "../utils/Auth";
const { Content } = Layout;
class Settings extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { photoUrl: null };
  }

  updateValue = (values) => {
    console.log(values);
  };
  componentDidMount() {
    const { photoUrl } = this.context;
    this.setState({ photoUrl });
  }

  render() {
    const { photoUrl } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar state={this.props.location.state} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "0 16px" }}>
            <img src={photoUrl}></img>
            <Card
              className="customCard"
              key={"add"}
              type="inner"
              title="Add Class"
            >
              <Form
                onFinish={this.updateValue}
                layout="inline"
                name="dynamic_rule"
              >
                <Form.Item
                  name="code"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input code",
                    },
                  ]}
                >
                  <Input
                    className="infoInput"
                    placeholder="Please input code"
                    onChange={this.onChange}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Join Class
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  }
}

export default Settings;
