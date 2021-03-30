import React, { Component } from "react";
import "./ui.css";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import {
  Layout,
  Card,
  Spin,
  Button,
  Form,
  Input,
  Modal,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SideBar from "./SideBar";
import { AuthContext } from "../utils/Auth";
import { Link } from "react-router-dom";
import { v1 as uuid } from "uuid";
import {
  deleteAssessment,
  getAssessment,
  addAssessment,
} from "../utils/Firestore";
const { Content } = Layout;

class Assessment extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      classInfo: this.props.location.state.val,
      assessments: undefined,
      visible: false,
    };
  }
  getAllAssessment = async () => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    let data = await getAssessment(classCode);
    if (data.assessments.length == 0) {
      data = false;
    }
    this.setState({ assessments: data });
  };
  addAssessmentOnClick = (value) => {
    this.createAssessment(value);
  };
  createAssessment = async (value) => {
    const date = value.date._d;
    const descp = value.descp;
    let { assessments, classInfo } = this.state;
    const classCode = classInfo.classCode;
    const roomId = uuid();
    const assessmentObj = value.assessmentName;
    const result = await addAssessment(
      classCode,
      assessmentObj,
      roomId,
      date,
      descp
    );
    if (result == false) {
      alert("Error, please try again later");
    } else {
      if (assessments == false) {
        assessments = { assessments: [{ assessmentObj, descp, roomId }] };
      } else {
        assessments.assessments.push({ assessmentObj, descp, roomId });
      }
      this.handleOk();
    }
    this.setState({ assessments });
  };
  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  delete = async (roomId) => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    await deleteAssessment(classCode, roomId);
    this.getAllAssessment();
  };

  renderAssessments = () => {
    const { assessments, classInfo } = this.state;
    const { status } = this.context;
    const classCode = classInfo.classCode;
    if (assessments == false) return <h2>No Assessments</h2>;
    return assessments.assessments.map((val, idx) => {
      const { assessmentObj, roomId, descp, socketId } = val;
      return (
        <Card
          className="customCard"
          key={idx}
          type="inner"
          title={assessmentObj}
          extra={
            socketId != undefined || status.role == true ? (
              <div>
                <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => this.delete(roomId)}
                >
                  Delete Assessment
                </Button>
                <Link
                  to={{
                    pathname: "/room",
                    state: {
                      roomID: roomId,
                      name: status.nickname,
                      code: classCode,
                      socketId,
                      role: status.role,
                    },
                  }}
                >
                  Join Assessment Room
                </Link>
              </div>
            ) : (
              <Link disabled>{socketId}Assessment Not Open</Link>
            )
          }
        >
          {descp}
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={this.showModal}
            ></Button>
            <Modal
              title="Add Assessment"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Form
                onFinish={this.addAssessmentOnClick}
                name="dynamic_rule"
                labelCol={{
                  span: 2,
                }}
                wrapperCol={{
                  span: 14,
                }}
                layout="horizontal"
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
                  <Input placeholder="Please input Assessment Name" />
                </Form.Item>
                <Form.Item
                  name="descp"
                  rules={[
                    {
                      required: true,
                      message: "Please input Description ",
                    },
                  ]}
                >
                  <Input placeholder="Please input Description" />
                </Form.Item>
                <Form.Item
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter a date",
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="addButton"
                    htmlType="submit"
                    type="primary"
                  >
                    Add Assessment
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
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
          <Content style={{ margin: "10px 16px" }}>
            <Card title="Assessments" extra={this.getRole()}>
              {assessments == undefined ? (
                <div className="loader">
                  <Spin size="large" tip="Loading..." />
                </div>
              ) : (
                this.renderAssessments()
              )}
            </Card>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  }
}

export default Assessment;
