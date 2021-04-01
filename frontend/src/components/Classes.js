//Noel Gregory
//2021-03-30
//This file will contains teh class component

import React, { Component } from "react";
import "./ui.css";
import {
  addClass,
  getAllClasses,
  getNameById,
  updateClass,
} from "../utils/Firestore";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import { Layout, Card, Spin, Button, Form, Input, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SiderBar from "./SideBar";
import { AuthContext } from "../utils/Auth";
import { Link } from "react-router-dom";
import { v1 as uuid } from "uuid";
import { generateCode } from "../utils/algorithm";
const { Content } = Layout;

class Classes extends Component {
  static contextType = AuthContext;
  //This function is called when class instance is made and will define state variables
  constructor(props) {
    super(props);
    this.state = {
      classes: undefined,
      visible: [],
    };
  } //end constructor

  //This function handle adding class from button
  //values:Object:holds form values
  addClass = (values) => {
    this.createClass(values); //send info
    this.handleCancel(0);
  }; //end addClass
  //This function will create new classes
  //values:Object:contians new class info
  createClass = async (values) => {
    const { currentUser } = this.context;
    let { classes } = this.state;
    const str = generateCode();
    const room = uuid();
    addClass(str, values.className, currentUser.uid, room);
    let name = await getNameById(currentUser.uid);

    let data = {
      classCode: str,
      className: values.className,
      owner: currentUser.uid,
      students: null,
      code: true,
      owner: name,
    };
    if (classes == false) {
      classes = [data];
    } else {
      classes.push(data);
    } //end if classes
    this.setState({ classes });
  }; //end createClass

  //This function will get all the classes for user
  getClass = async () => {
    const { currentUser, status, getRole } = this.context;
    await getRole(true); //get user role
    let data = await getAllClasses(currentUser.uid, status.role); //get all classess that user is in
    if (data == null) data = false; //end if data
    this.setState({ classes: data });
  }; //end getClass

  //This function will be called when component is mounted and will get all class user is in
  componentDidMount() {
    this.getClass();
  } //end componentDidMount

  //This function will handles show of modal
  //idx:Intger:holds the id for current modal
  showModal = (idx) => {
    const { visible } = this.state;
    visible[idx] = true;
    this.setState({ visible });
  }; //end showModal

  //This function will handles ok of modal
  //idx:Intger:holds the id for current modal
  handleOk = (idx) => {
    const { visible } = this.state;
    visible[idx] = false;
    this.setState({ visible });
  }; //end handleOk

  //This function will handles cancel of modal
  //idx:Intger:holds the id for current modal
  handleCancel = (idx) => {
    const { visible } = this.state;
    visible[idx] = false;
    this.setState({ visible });
  }; //end handleCancel

  //This function will edit class details
  //code:String:class code
  //value:Object:contains class details fromt he form
  editClass = async (code, value, idx) => {
    this.handleCancel(idx);
    await updateClass(code, value.className); // update the class info
    this.getClass();
  }; //editClass

  //This function will render all the classes
  //classes:Object:contains all the classes
  //return:String:contains jsx expression of class section
  renderClass = (classes) => {
    const { status } = this.context;
    if (classes == false) return <h2>No Class</h2>; //end if classes
    return classes.map((val, idx) => {
      idx++;
      return (
        <Card
          className="customCard"
          key={idx}
          type="inner"
          title={val.className}
          extra={
            <div>
              <h4>
                {
                  val["code"] != undefined ? `Class Code: ${val.classCode}` : "" //end if val["code"]
                }
              </h4>
              {
                status.role == true ? (
                  <Button type="primary" onClick={() => this.showModal(idx)}>
                    Edit Class{" "}
                  </Button>
                ) : (
                  ""
                ) //end if status.role
              }

              <Modal
                title="Edit Class"
                visible={this.state.visible[idx]}
                onOk={() => this.handleOk(idx)}
                onCancel={() => this.handleCancel(idx)}
              >
                <Form
                  onFinish={(value) =>
                    this.editClass(val.classCode, value, idx)
                  }
                  layout="inline"
                  name="dynamic_rule"
                >
                  <Form.Item name="className">
                    <h4>{`Class Code: ${val.classCode}`}</h4>
                  </Form.Item>
                  <Form.Item
                    name="className"
                    rules={[
                      {
                        required: true,
                        message: "Please input Class Name",
                      },
                    ]}
                  >
                    <Input
                      className="infoInput"
                      defaultValue={val.className}
                      placeholder="Please input Class Name"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      className="addButton"
                      htmlType="submit"
                      type="primary"
                    >
                      Update Class
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <Link
                style={{ margin: "10px" }}
                to={{
                  pathname: `/whiteboard`,
                  state: { roomID: val.roomId, role: status.role },
                }}
              >
                Whiteboard
              </Link>
              <Link
                to={{
                  pathname: "/assessment",
                  state: { val, collapse: this.props.location.state },
                }}
              >
                Assessment
              </Link>
            </div>
          }
        >
          Teacher: {val.owner}
        </Card>
      );
    });
  }; //end renderClass

  //This function will render jsx depending on role
  //return:String:contains jsx expression of teacher role parts
  getRole = () => {
    const { status } = this.context;
    if (status.role) {
      return (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => this.showModal(0)}
          ></Button>
          <Modal
            title="Create Class"
            visible={this.state.visible[0]}
            onOk={() => this.handleOk(0)}
            onCancel={() => this.handleCancel(0)}
          >
            <Form onFinish={this.addClass} layout="inline" name="dynamic_rule">
              <Form.Item
                name="className"
                rules={[
                  {
                    required: true,
                    message: "Please input Class Name",
                  },
                ]}
              >
                <Input
                  className="infoInput"
                  placeholder="Please input Class Name"
                />
              </Form.Item>
              <Form.Item>
                <Button className="addButton" htmlType="submit" type="primary">
                  Create Class
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      );
    } //end if status.role
  }; //end getRole

  //This function will render the class component
  //return:String:contians the jsx ecpression of the class componenet
  render() {
    const { classes } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderBar state={this.props.location.state} />
        <Layout className="site-layout">
          <HeaderSection />
          <Content style={{ margin: "10px 16px" }}>
            <Card title="Classes" extra={this.getRole()}>
              {" "}
              {
                classes == undefined ? (
                  <div className="loader">
                    <Spin size="large" tip="Loading..." />
                  </div>
                ) : (
                  this.renderClass(classes)
                ) //end if classes
              }
            </Card>
          </Content>
          <FooterSection />
        </Layout>
      </Layout>
    );
  } //end render
} //end class Classes

export default Classes;
