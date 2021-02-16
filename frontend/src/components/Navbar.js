import React from "react";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header>
      <img className="logoNavbar" src="/logo.png"></img>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">About</Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
