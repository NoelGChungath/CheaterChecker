import React, { Component } from "react";
import "./ui.css";
import { getAssigments } from "../utils/Firestore";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Card, Spin } from "antd";
import SiderBar from "./SideBar";

const { Content } = Layout;

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classInfo: this.props.location.state.val,
      assigment: undefined,
    };
  }
  getAllAssigments = async () => {
    const { classInfo } = this.state;
    const classCode = classInfo.classCode;
    const data = await getAssigments(classCode);
    this.setState({ assigment: data });
  };
  renderAssigments = () => {
    const { classInfo, assigment } = this.state;
    if (assigment == null) return null;
    return assigment.map((val, idx) => {
      return (
        <Card key={idx} type="inner" title={val.AsgName}>
          {val.msg}
        </Card>
      );
    });
  };
  componentDidMount() {
    this.getAllAssigments();
  }
  render() {
    const { assigment } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar state={this.props.location.state.collapse} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "0 16px" }}>
            <Card title="Classes">
              {assigment == undefined ? (
                <div className="loader">
                  <Spin size="large" tip="Loading..." />
                </div>
              ) : (
                this.renderAssigments()
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
