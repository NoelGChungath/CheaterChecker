// Noel Gregory
//2021-03-29
//This class is made for the home route and will return the home page in jsx

//imports
import React, { Component } from "react";
import { AuthContext } from "../utils/Auth";
import { getLatestAssessments, joinClass } from "../utils/Firestore";
import "./ui.css";
import { Layout, Card, Spin, Button, Form, Input, Modal } from "antd";
import SiderBar from "./SideBar";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { convertMS } from "../utils/algoritims";
const { Content } = Layout;

class Home extends Component {
  static contextType = AuthContext;
  //This function will be called when the class instance is created
  //props:Object:holds values given by parent components
  constructor(props) {
    super(props);
    this.state = { latest: undefined, visible: false }; //creating state variables
  } //end constructor

  //This function will get the latest assesments from the database
  //code:String:class code
  getLatestAssesment = async (code) => {
    const { status } = this.context;
    if (code != undefined) {
      if (status["Classes"] == undefined) {
        status["Classes"] = [];
      }
      status["Classes"].push(code);
    } //end code
    console.log(status.Classes);

    let latest = await getLatestAssessments(status.Classes);
    if (latest == undefined) latest = false; // end if latest
    this.setState({ latest });
  }; //end getLatestAssesment

  //This function will render the lastest assesments from the database
  //return:JSX:returns the latest assements using jsx expressions
  renderLatest = () => {
    const { latest } = this.state;
    if (latest == false) return <h3>No Latest Assessment</h3>; //end if latest
    return latest.map((val, idx) => {
      return (
        <Card
          className="customCard"
          key={idx}
          type="inner"
          title={val.assessmentObj}
          extra={
            val.elapsedTime > 0 ? convertMS(val.elapsedTime) : "Assessment Done"
          }
        >
          {val.descp}
        </Card>
      );
    });
  }; //end renderLatest

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

  //This function will add a class to the database
  //values:Object:holds values from the form
  addToClass = async (values) => {
    const { currentUser, getRole } = this.context;
    if (values != null) {
      const result = await joinClass(values.code, currentUser.uid); //calling joinClass to add class to firestore
      if (result != undefined) {
        alert("This Class Does Not Exist");
      } //end if result
    } //end if values
    getRole(true);
    this.getLatestAssesment(values.code);
    this.handleCancel();
  }; //end addToClass

  //This function will check if the user is a student and return student info
  //return:JSX:this returns a jsx expression if the user is a student
  getRole = () => {
    const { status } = this.context;
    if (status.role == false) {
      return (
        <div>
          <Button type="primary" onClick={this.showModal}>
            Join Class
          </Button>
          <Modal
            title="Join Class"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form onFinish={this.addToClass} name="dynamic_rule">
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input class code",
                  },
                ]}
              >
                <Input placeholder="Please input class code" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Join Class
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      );
    } //end if status.role
  }; //end getRole

  //This function is called at component mount
  componentDidMount() {
    this.getLatestAssesment();
  } //end componentDidMount

  //This function will render the home component
  //return:JSX:contains jsx expression of home component
  render() {
    const { latest } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar state={this.props.location.state} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "10px 16px" }}>
            <Card title="Latest Assessments" extra={this.getRole()}>
              {latest == undefined ? (
                <div className="loader">
                  <Spin size="large" tip="Loading..." />
                </div>
              ) : (
                this.renderLatest()
              )}
            </Card>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  } //end render
} //end class Home

export default Home;
