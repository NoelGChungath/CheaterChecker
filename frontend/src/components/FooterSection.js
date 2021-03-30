//Noel Gregory
//2021-03-29
//This file will create a footer section component

//imports
import React from "react";
import "antd/dist/antd.css";
import "./ui.css";
import { Layout } from "antd";
const { Footer } = Layout;

//This function will return a footer section component
//return:JSX:will return the footer section's jsx expression
const FooterSection = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      CheaterChecker ©2021 Created by Noel Gregory
    </Footer>
  );
}; //end FooterSection

export default React.memo(FooterSection);
