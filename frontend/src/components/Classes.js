import React, { Component } from "react";
import "./ui.css";
import { addClass, getAllClasses } from "../utils/Firestore";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Card, Spin, Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SiderBar from "./SideBar";
import { AuthContext } from "../utils/Auth";
import { Link } from "react-router-dom";

const { Content } = Layout;

class Classes extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { classes: undefined };
  }
  generateCode = () => {
    const str =
      "qwertyuioplkjhgfdsazxcvbnm1234567890QAZXSWEDCVFRTGBNHYUJMKILOP";
    let genStr = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * str.length);
      genStr += str[randomIndex];
    }
    return genStr;
  };

  createClass = (values) => {
    const { currentUser } = this.context;
    const str = this.generateCode();
    addClass(str, values.className, currentUser.uid);
  };

  getClass = async () => {
    const { currentUser } = this.context;
    const data = await getAllClasses(currentUser.uid);
    if (data == null) return null;
    this.setState({ classes: data });
  };
  componentDidMount() {
    this.getClass();
  }
  renderClass = (classes) => {
    if (classes == null) return <h2>No Class</h2>;
    let temp = classes.map((val, idx) => {
      return (
        <Card
          className="customCard"
          key={idx}
          type="inner"
          title={val.className}
          extra={
            <Link
              to={{
                pathname: "/assessment",
                state: { val, collapse: this.props.location.state },
              }}
            >
              Assessment
            </Link>
          }
        >
          {val.ownerName}
        </Card>
      );
    });
    temp.push(
      <Card className="customCard" key={"add"} type="inner" title="Add Class">
        <Form onFinish={this.createClass} layout="inline" name="dynamic_rule">
          <Form.Item
            name="className"
            rules={[
              {
                required: true,
                message: "Please input Class Name",
              },
            ]}
          >
            <Input
              className="infoInput"
              placeholder="Please input Class Name"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="addButton"
              htmlType="submit"
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
            />
          </Form.Item>
        </Form>
      </Card>
    );
    return temp;
  };
  giveRole = () => {
    const { status } = this.context;
    if (status != null) {
      if (status.role) {
        return <div>Teacher</div>;
      } else {
        return <div>Student</div>;
      }
    }
  };

  render() {
    const { classes } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar state={this.props.location.state} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "0 16px" }}>
            <Card title="Classes">
              {classes == undefined ? (
                <div className="loader">
                  <Spin size="large" tip="Loading..." />
                </div>
              ) : (
                this.renderClass(classes)
              )}
              {this.giveRole()}
            </Card>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  }
}

export default Classes;
