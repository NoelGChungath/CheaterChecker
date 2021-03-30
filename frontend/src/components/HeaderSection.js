//Noel Gregory
//2021-03-29
//This file will create a header section component

//imports
import React from "react";
import { Layout, Input, Button } from "antd";
import { app } from "../utils/base";
const { Header } = Layout;

//This function will return a header component
//return:JSX:returns headersections jsx expression
const HeaderSection = () => {
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <Button
        size="large"
        style={{ float: "right", margin: "10px" }}
        onClick={() => app.auth().signOut()}
        type="primary"
      >
        Sign out
      </Button>
    </Header>
  );
}; //end HeaderSection

export default React.memo(HeaderSection);
