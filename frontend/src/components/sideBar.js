import React, { Component } from "react";
import "./ui.css";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Sider } = Layout;
const { SubMenu } = Menu;

class SideBar extends Component {
  constructor(props) {
    super(props);
    let temp = false;
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
        <Menu theme="dark" mode="inline">
          <Menu.Item icon={<PieChartOutlined />}>
            <Link
              to={{
                pathname: "/",
                state: collapsed,
              }}
            >
              Home
            </Link>
          </Menu.Item>
          <Menu.Item icon={<DesktopOutlined />}>
            <Link
              to={{
                pathname: "/classes",
                state: collapsed,
              }}
            >
              Classes
            </Link>
          </Menu.Item>
          <Menu.Item icon={<SettingOutlined />}>
            <Link
              to={{
                pathname: "/setting",
                state: collapsed,
              }}
            >
              Settings
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default React.memo(SideBar);
