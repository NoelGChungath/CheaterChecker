import React from "react";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header>
      <img className="logoNavbar" src="/logo.png"></img>
      <Menu theme="dark" mode="horizontal"></Menu>
    </Header>
  );
};

export default React.memo(Navbar);
