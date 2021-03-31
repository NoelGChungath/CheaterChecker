//Noel Gregory
//2021-03-30
//This file creates the sidebar component

//imports
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

class SideBar extends Component {
  //This function will create the gloabal variables
  //props:Object:contains parent component values
  constructor(props) {
    super(props);
    let temp = false;
    if (this.props["state"] != undefined) {
      temp = this.props.state;
    } //end this.props["state"]
    this.state = {
      collapsed: temp,
    };
  } //end constructor

  //This function will change collapse state
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }; //end onCollapse

  //This function will render the sidebar component
  //return:JSX:contains jsx expression of sidebar
  render() {
    const { collapsed } = this.state;
    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        {
          collapsed ? (
            <img className="logosmall" src="/logosmall.png"></img>
          ) : (
            <img className="logo" src="/logo.png"></img>
          ) //end if collapsed
        }
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
  } //end render
} //end class SideBar

export default React.memo(SideBar);
