import React from "react";
import { Layout, Input, Button } from "antd";
import { app } from "../utils/base";
const { Search } = Input;
const { Header } = Layout;

const HeaderSection = () => {
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {" "}
      <Search
        className="search"
        placeholder="input search text"
        enterButton="Search"
        size="large"
      />
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
};

export default HeaderSection;
