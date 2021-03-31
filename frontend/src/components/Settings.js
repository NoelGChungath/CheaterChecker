//Noel Gregory
//2021-03-30
//This class will create the settings component

//imports
import React, { Component } from "react";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Avatar, Layout, Card, Button, Form, Input } from "antd";
import SiderBar from "./SideBar";
import { AuthContext } from "../utils/Auth";
import { getUserRole, updateUserDetails } from "../utils/Firestore";
const { Content } = Layout;
const { TextArea } = Input;

class Settings extends Component {
  static contextType = AuthContext;

  //This function will create in the global state variables
  //props:Object:contains props from parent component
  constructor(props) {
    super(props);
    this.state = { photoUrl: null, userDetail: null };
  } //end constructor

  //This function will call updateDetail function on button press
  //values:Object:contains the valeus from form
  onFinish = (values) => {
    const { currentUser } = this.context;
    this.updateDetail(currentUser.uid, values.nickname, values.status);
  }; //end onFinish

  //This function wll update the user details
  //uid:String:user id
  //nickname:String:user name
  //status:String: user status
  updateDetail = async (uid, nickname, status) => {
    await updateUserDetails(uid, nickname, status);
  }; //end updateDetial

  //This function will get the user detials form firestore
  //uid:String:user id
  getUserDetails = async (uid) => {
    const data = await getUserRole(uid);
    this.setState({ userDetail: data });
  }; //end getUserDetails

  //This function will get the user details
  componentDidMount() {
    const { currentUser } = this.context;
    this.getUserDetails(currentUser.uid);
    this.setState({ photoUrl: currentUser.photoURL });
  } //end componentDidMount

  //This function will render the setting component
  //return:JSX:contains the jsx expression fo settings component
  render() {
    const { photoUrl, userDetail } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar state={this.props.location.state} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "0 16px" }}>
            {userDetail != null ? (
              <Card
                className="customCard"
                key={"add"}
                type="inner"
                title="Profile"
              >
                <Avatar size="large" src={photoUrl} />
                <Form name="basic" onFinish={this.onFinish}>
                  <Form.Item
                    name="nickname"
                    label="Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input a valid nickname",
                      },
                    ]}
                  >
                    <Input defaultValue={userDetail.nickname} />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Please input a valid status",
                      },
                    ]}
                  >
                    <TextArea autoSize defaultValue={userDetail.status} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : (
              ""
            )}
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  } //end render
} //end class Settings

export default Settings;
