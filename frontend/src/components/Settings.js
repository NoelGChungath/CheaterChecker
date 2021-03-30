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
  constructor(props) {
    super(props);
    this.state = { photoUrl: null, userDetail: null };
  }

  onFinish = (values) => {
    const { currentUser } = this.context;
    this.updateDetial(currentUser.uid, values.nickname, values.status);
  };
  updateDetial = async (uid, nickname, status) => {
    await updateUserDetails(uid, nickname, status);
  };
  getUserDetails = async (uid) => {
    const data = await getUserRole(uid);
    this.setState({ userDetail: data });
  };
  componentDidMount() {
    const { currentUser } = this.context;
    this.getUserDetails(currentUser.uid);
    this.setState({ photoUrl: currentUser.photoURL });
  }

  render() {
    const { photoUrl, userDetail } = this.state;
    console.log(userDetail);

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
  }
}

export default Settings;
