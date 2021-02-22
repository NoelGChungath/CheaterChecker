import React, { Component } from "react";
import "./ui.css";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderBar extends Component {
  constructor(props) {
    super(props);
    let temp = false;
    console.log("dffd");
    console.log(this.props);
    if (this.props["state"] != undefined) {
      temp = this.props.state;
    }
    this.state = {
      collapsed: temp,
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        {collapsed ? (
          <img className="logosmall" src="/logosmall.png"></img>
        ) : (
          <img className="logo" src="/logo.png"></img>
        )}
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link
              to={{
                pathname: "/",
                state: collapsed,
              }}
            >
              Home
            </Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            <Link
              to={{
                pathname: "/classes",
                state: collapsed,
              }}
            >
              Classes
            </Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default SiderBar;
