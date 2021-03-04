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
    let { classes } = this.state;
    const str = this.generateCode();
    addClass(str, values.className, currentUser.uid);

    let data = {
      classCode: str,
      className: values.className,
      owner: currentUser.uid,
      students: null,
    };
    if (classes == false) {
      classes = [data];
    } else {
      classes.push(data);
    }
    this.setState(classes);
  };

  getClass = async () => {
    const { currentUser, status } = this.context;
    let data = await getAllClasses(currentUser.uid, status.Classes);
    if (data == null) data = false;
    this.setState({ classes: data });
  };
  componentDidMount() {
    this.getClass();
  }
  renderClass = (classes) => {
    const { status } = this.context;
    if (classes == false) return <h2>No Class</h2>;
    return classes.map((val, idx) => {
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
          {val.owner}
        </Card>
      );
    });
  };
  getRole = () => {
    const { status } = this.context;
    if (status != null) {
      if (status.role) {
        return (
          <div>
            {" "}
            <Card
              className="customCard"
              key={"add"}
              type="inner"
              title="Add Class"
            >
              <Form
                onFinish={this.createClass}
                layout="inline"
                name="dynamic_rule"
              >
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
            Teacher
          </div>
        );
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
              {this.getRole()}
            </Card>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  }
}

export default Classes;
