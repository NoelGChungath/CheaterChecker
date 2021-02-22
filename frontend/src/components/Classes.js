import React, { Component } from "react";
import { getAllClasses } from "../utils/Firestore";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Card, Spin } from "antd";
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
    return classes.map((val, idx) => {
      return (
        <Card
          key={idx}
          type="inner"
          title={val.className}
          extra={
            <Link
              to={{
                pathname: "/assigment",
                state: { val, collapse: this.props.location.state },
              }}
            >
              Assigment
            </Link>
          }
        >
          {val.ownerName}
        </Card>
      );
    });
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
