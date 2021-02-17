import React, { Component } from "react";
import { getAllClasses } from "../utils/Firestore";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Breadcrumb } from "antd";
import SiderBar from "./SideBar";
import { AuthContext } from "../utils/Auth";

const { Content } = Layout;

class Classes extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { classes: null };
  }
  getClass = async () => {
    const { currentUser } = this.context;
    const data = await getAllClasses(currentUser.uid);
    this.setState({ classes: data });
  };
  componentDidMount() {
    this.getClass();
  }
  render() {
    const { status, classes } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {status != null ? (
                status.role == true ? (
                  <div>sd</div>
                ) : (
                  <div>sdsdsdsd</div>
                )
              ) : (
                ""
              )}
            </div>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  }
}

export default Classes;
