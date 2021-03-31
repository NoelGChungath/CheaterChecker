//Noel Gregory
//2021-03-30
//This class will create assessments component

//imports
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

  //This function will create the global variables
  //props:Object:contains parent props
  constructor(props) {
    super(props);
    this.state = {
      classInfo: this.props.location.state.val,
      assessments: undefined,
      visible: false,
    };
  } //end constructor

  //This function will get all the assessments
  getAllAssessment = async () => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    let data = await getAssessment(classCode);
    if (data.assessments.length == 0) {
      data = false;
    } //end if data.assessments.length
    this.setState({ assessments: data });
  }; //end getAllAssessment

  //This function will add assessment on button click
  //value:Object:contains the value form form
  addAssessmentOnClick = (value) => {
    this.createAssessment(value);
  }; //end addAssessmentOnClick

  //This function will create an assessment
  //values:Object:contains value from form
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
      } //end if assessments
      this.handleOk();
    } //end if result
    this.setState({ assessments });
  };

  //This function handles the show button in modal
  showModal = () => {
    this.setState({ visible: true });
  }; //end showModal

  //This function handles the ok button in modal
  handleOk = () => {
    this.setState({ visible: false });
  }; //end handleOk

  //This function handles the cancel button in modal
  handleCancel = () => {
    this.setState({ visible: false });
  }; //end handleCancel

  //This function will delete the specfic assessment
  //roomId:String:room code
  delete = async (roomId) => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    await deleteAssessment(classCode, roomId);
    this.getAllAssessment();
  }; //end delete

  //This function will render the assessments
  //return:Array:contains the jsx expression of each assessment
  renderAssessments = () => {
    const { assessments, classInfo } = this.state;
    const { status } = this.context;
    const classCode = classInfo.classCode;
    if (assessments == false) return <h2>No Assessments</h2>; //end if assessments
    return assessments.assessments.map((val, idx) => {
      const { assessmentObj, roomId, descp, socketId } = val;
      return (
        <Card
          className="customCard"
          key={idx}
          type="inner"
          title={assessmentObj}
          extra={
            socketId != null || status.role == true ? (
              <div>
                {
                  status.role == true ? (
                    <Button
                      type="primary"
                      style={{ marginRight: "10px" }}
                      onClick={() => this.delete(roomId)}
                    >
                      Delete Assessment
                    </Button>
                  ) : (
                    ""
                  ) //end if status.role
                }
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
            ) //end if socketId and socket.role
          }
        >
          {descp}
        </Card>
      );
    }); //end mapping assessments
  }; //end renderAssessments
  //This function will render jsx depending on role
  //return:JSX:contains jsx expression of teacher role parts
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
      } //end if status.role
    } //end if status
  }; //end getRole

  //This function will get all assements on component mount
  componentDidMount() {
    this.getAllAssessment();
  } //end componentDidMount

  //This function will render the assessment component
  //return:JSX:contians the jsx ecpression of the assessment componenet
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
  } //end render
} //end class Assessment

export default Assessment;
