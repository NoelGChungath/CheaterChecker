//Noel Gregory
//2021-03-30

//imports
import React from "react";
import { Layout, Menu } from "antd";

const { Header } = Layout;

//This function will render the navbar component
//return:String:contains jsx expression of navbar component
const Navbar = () => {
  return (
    <Header>
      <img className="logoNavbar" src="/logo.png"></img>
      <Menu theme="dark" mode="horizontal"></Menu>
    </Header>
  );
}; //end Navbar

export default React.memo(Navbar);
