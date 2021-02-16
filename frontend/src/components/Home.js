import React, { Component } from "react";
import { AuthContext } from "../utils/Auth";
import { app } from "../utils/base";
import { getUserRole, addClass, joinClass } from "../utils/Firestore";
import "./ui.css";
import { Layout, Breadcrumb, Input, Button, Form } from "antd";
import SiderBar from "./sideBar";
import FooterPage from "./footer";

const { Search } = Input;

const { Header, Content } = Layout;

class Home extends Component {
  static contextType = AuthContext;
  state = {
    status: null,
    value: null,
  };

  generateCode = () => {
    const str =
      "qwertyuioplkjhgfdsazxcvbnm1234567890QAZXSWEDCVFRTGBNHYUJMKILOP";
    let genStr = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * str.length);
      genStr += str[randomIndex];
    }
    addClass(genStr);
  };

  addToClass = async (values) => {
    const { currentUser } = this.context;
    if (values != null) {
      const result = await joinClass(values.code, currentUser.uid);
      if (result != undefined) {
        alert("This Class Does Not Exist");
      }
    }
  };

  getRole = async () => {
    const { currentUser } = this.context;
    const data = await getUserRole(currentUser.uid);
    this.setState({ status: data });
  };

  componentDidMount() {
    this.getRole();
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { status } = this.state;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar />
        <Layout className="site-layout">
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
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {status != null ? (
                status.role == true ? (
                  <div>
                    <h3>Teacher</h3>
                    <button onClick={this.generateCode}>Generate code</button>
                  </div>
                ) : (
                  <div>
                    <h3>Student</h3>
                    <Form onFinish={this.addToClass} name="dynamic_rule">
                      <Form.Item
                        name="code"
                        label="Name"
                        rules={[
                          {
                            required: true,
                            message: "Please input code",
                          },
                        ]}
                      >
                        <Input
                          className="infoInput"
                          placeholder="Please input code"
                          value={this.state.someVal || ""}
                          onChange={this.onChange}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          onClick={() => this.addToClass()}
                          type="primary"
                          htmlType="submit"
                        >
                          Join Class
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                )
              ) : (
                ""
              )}
            </div>
          </Content>
          <FooterPage />
        </Layout>
      </Layout>
    );
  }
}

export default Home;

{
  /* <Form name="dynamic_rule">
<Form.Item
  name="username"
  label="Name"
  rules={[
    {
      required: true,
      message: "Please input code",
    },
  ]}
>
  <Input
    placeholder="Please input code"
    value={this.state.someVal || ""}
    onChange={this.onChange}
  />
</Form.Item>

<Form.Item>
  <Button
    onClick={() => this.addToClass()}
    type="primary"
  >
    Join Class
  </Button>
</Form.Item>
</Form> */
}

// import React, { Component } from "react";
// import { AuthContext } from "../utils/Auth";
// import { app } from "../utils/base";
// import { getUserRole, addClass, joinClass } from "../utils/Firestore";
// import "antd/dist/antd.css";
// import "./ui.css";
// import { Layout, Menu, Breadcrumb, Input, Form, Button } from "antd";
// import {
//   DesktopOutlined,
//   PieChartOutlined,
//   FileOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from "@ant-design/icons";

// const { Search } = Input;

// const { Header, Content, Footer, Sider } = Layout;
// const { SubMenu } = Menu;

// class Home extends Component {
//   static contextType = AuthContext;
//   state = {
//     collapsed: false,
//     role: null,
//     value: null,
//   };

//   generateCode = () => {
//     const str =
//       "qwertyuioplkjhgfdsazxcvbnm1234567890QAZXSWEDCVFRTGBNHYUJMKILOP";
//     let genStr = "";
//     for (let i = 0; i < 5; i++) {
//       const randomIndex = Math.floor(Math.random() * str.length);
//       genStr += str[randomIndex];
//     }
//     addClass(genStr);
//   };

//   addToClass = () => {
//     const { currentUser } = this.context;
//     joinClass(this.state.value, currentUser.uid);
//   };

//   getRole = async () => {
//     const { currentUser } = this.context;
//     const data = await getUserRole(currentUser.uid);
//     this.setState({ role: data });
//   };

//   componentDidMount() {
//     this.getRole();
//   }

//   onCollapse = (collapsed) => {
//     console.log(collapsed);
//     this.setState({ collapsed });
//   };

//   onChange = (e) => {
//     this.setState({ value: e.target.value });
//   };

//   render() {
//     const { collapsed, role } = this.state;
//     console.log(role);
//     return (
//       <Layout style={{ minHeight: "100vh" }}>
//         <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
//           {collapsed ? (
//             <img className="logosmall" src="/logosmall.png"></img>
//           ) : (
//             <img className="logo" src="/logo.png"></img>
//           )}
//           <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
//             <Menu.Item key="1" icon={<PieChartOutlined />}>
//               Option 1
//             </Menu.Item>
//             <Menu.Item key="2" icon={<DesktopOutlined />}>
//               Option 2
//             </Menu.Item>
//             <SubMenu key="sub1" icon={<UserOutlined />} title="User">
//               <Menu.Item key="3">Tom</Menu.Item>
//               <Menu.Item key="4">Bill</Menu.Item>
//               <Menu.Item key="5">Alex</Menu.Item>
//             </SubMenu>
//             <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
//               <Menu.Item key="6">Team 1</Menu.Item>
//               <Menu.Item key="8">Team 2</Menu.Item>
//             </SubMenu>
//             <Menu.Item key="9" icon={<FileOutlined />}>
//               bkh
//             </Menu.Item>
//           </Menu>
//         </Sider>
//         <Layout className="site-layout">
//           <Header className="site-layout-background" style={{ padding: 0 }}>
//             {" "}
//             <Search
//               className="search"
//               placeholder="input search text"
//               enterButton="Search"
//               size="large"
//             />
//             <Button
//               size="large"
//               style={{ float: "right", margin: "10px" }}
//               onClick={() => app.auth().signOut()}
//               type="primary"
//             >
//               Sign out
//             </Button>
//           </Header>
//           <Content style={{ margin: "0 16px" }}>
//             <Breadcrumb style={{ margin: "16px 0" }}>
//               <Breadcrumb.Item>User</Breadcrumb.Item>
//               <Breadcrumb.Item>Bill</Breadcrumb.Item>
//             </Breadcrumb>
//             <div
//               className="site-layout-background"
//               style={{ padding: 24, minHeight: 360 }}
//             >
//               {role != null ? (
//                 role == true ? (
//                   <div>
//                     <h3>Teacher</h3>
//                     <button onClick={this.generateCode}>Generate code</button>
//                   </div>
//                 ) : (
//                   <div>
//                     <h3>Student</h3>
//                     <Form name="dynamic_rule">
//                       <Form.Item
//                         name="username"
//                         label="Name"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input code",
//                           },
//                         ]}
//                       >
//                         <Input
//                           placeholder="Please input code"
//                           value={this.state.someVal || ""}
//                           onChange={this.onChange}
//                         />
//                       </Form.Item>

//                       <Form.Item>
//                         <Button
//                           onClick={() => this.addToClass()}
//                           type="primary"
//                         >
//                           Join Class
//                         </Button>
//                       </Form.Item>
//                     </Form>
//                   </div>
//                 )
//               ) : (
//                 ""
//               )}
//             </div>
//           </Content>
//           <Footer style={{ textAlign: "center" }}>
//             Ant Design ©2018 Created by Ant UED
//           </Footer>
//         </Layout>
//       </Layout>
//     );
//   }
// }

// export default Home;
// const Home = () => {
//   const { currentUser } = useContext(AuthContext);
//   const [role, setRole] = useState(null);

//   if (!currentUser) {
//     return <Redirect to="/login" />;
//   }
//   const getData = () => {
//     setRole(getUserRole(currentUser.uid));
//   };
//   getData();
//   console.log(role);
//   return (
//     <>
//       <h1>Home</h1>
//       {currentUser.email}
//       <button onClick={() => app.auth().signOut()}>Sign out</button>
//     </>
//   );
// };

// export default Home;
