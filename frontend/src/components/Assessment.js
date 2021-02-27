import React, { Component } from "react";
import "./ui.css";
import { addAssesment, getAssesment } from "../utils/Firestore";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Card, Spin, Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SideBar from "./SideBar";
import { AuthContext } from "../utils/Auth";
import { Link } from "react-router-dom";

const { Content } = Layout;

class Assessment extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      classInfo: this.props.location.state.val,
      assessments: undefined,
    };
  }
  getAllAssessment = async () => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    let data = await getAssesment(classCode);
    console.log(data);
    console.log(data.assessments.length);
    if (data.assessments.length == 0) {
      console.log("dfd");
      data = false;
    }
    this.setState({ assessments: data });
  };
  createAssessment = async (value) => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    const data = await addAssesment(classCode, value.assessmentName);
    this.getAllAssessment();
  };
  renderAssessments = () => {
    const { assessments } = this.state;

    if (assessments == false) return <h2>No Assessments</h2>;
    return assessments.assessments.map((val, idx) => {
      const { assessmentObj, roomId } = val;
      return (
        <Card
          className="customCard"
          key={idx}
          type="inner"
          title={assessmentObj}
          extra={
            <Link
              to={{
                pathname: `/room/${roomId}`,
              }}
            >
              Join Assessment Room
            </Link>
          }
        >
          {assessmentObj}
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
              title="Add Assessment"
            >
              <Form
                onFinish={this.createAssessment}
                layout="inline"
                name="dynamic_rule"
              >
                <Form.Item
                  name="assessmentName"
                  rules={[
                    {
                      required: true,
                      message: "Please input Assessment Name",
                    },
                  ]}
                >
                  <Input
                    className="infoInput"
                    placeholder="Please input Assessment Name"
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
  componentDidMount() {
    this.getAllAssessment();
  }
  render() {
    const { assessments } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar state={this.props.location.state.collapse} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "0 16px" }}>
            <Card title="Classes">
              {assessments == undefined ? (
                <div className="loader">
                  <Spin size="large" tip="Loading..." />
                </div>
              ) : (
                this.renderAssessments()
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

export default Assessment;
