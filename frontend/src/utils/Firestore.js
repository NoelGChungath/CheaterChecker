//noel Gregory
//2021-03-30
//This file contains all functions needed for database calls

//imports
import { db } from "./base";
import firebase from "firebase/app";
import { quickSort } from "./algoritims";

//This function will check if a user exist in firestore
//uid:String:user id
//return:Boolean:if the user exist or not
export const checkUserExist = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();

  if (!doc.exists) {
    return true;
  } else {
    return false;
  } //end if !doc.exists
}; //end checkUserExist

//This function will add a user to firestore
//uid:String:user id
//val:Object:user object
export const addUser = async (uid, val) => {
  const docRef = db.collection("users").doc(uid);
  let userRole = {
    role: null,
  };
  if (val) {
    userRole.role = true;
  } else {
    userRole.role = false;
  } //end if val
  await docRef.set(userRole);
}; //end addUser

//This function will add info to user
//values:Object:user info
//uid:String:user id
export const addInfo = async (values, uid) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update(values);
}; //end addInfo

//This function will add a class
//code:String:class code
//className:String: contains class name
//uid:String:user id
//room:String:room id
export const addClass = (code, className, uid, room) => {
  const docRef = db.collection("classes").doc(code);
  let data = {
    classCode: code,
    className: className,
    owner: uid,
    room: room,
    students: null,
  };
  docRef.set(data);
  const asmRef = db.collection("assessment").doc(code);
  asmRef.set({
    className: className,
    assessments: [],
  });
  addClassToUser(code, uid);
}; //end addClass

//This function will join a class to a user
//code:String: class code
//uid:String: user id
export const joinClass = async (code, uid) => {
  try {
    const classesRef = db.collection("classes").doc(code.trim());
    await classesRef.update({
      students: firebase.firestore.FieldValue.arrayUnion(uid),
    });
    addClassToUser(code, uid);
  } catch (err) {
    console.log(err);
    return err;
  } //end try
}; //end joinClass

//this function will get all classes
//uid:String:user id
//studentOrTeacher:Boolean: contaisn the user role
//return:Object:contains classes
export const getAllClasses = async (uid, studentOrTeacher) => {
  const docRef = db.collection("classes");
  let query = null;
  if (studentOrTeacher == true) {
    query = docRef.where("owner", "==", uid);
  } else {
    query = docRef.where("students", "array-contains", uid);
  } //end if studentOrTeacher
  const data = await query.get();
  const classes = [];
  for (let i = 0; i < data.docs.length; i++) {
    let tempData = data.docs[i].data();
    const id = tempData.owner;
    const name = await getNameById(id);
    tempData.owner = name;
    classes.push(tempData);
  } //end for i
  return classes;
}; //end getAllClasses

//this function will add class to a user
//code:String:class code
//uid:String: user id
export const addClassToUser = async (code, uid) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update({
    Classes: firebase.firestore.FieldValue.arrayUnion(code),
  });
}; //end addClassToUser

//This function will get user role
//uid:String:user id
//return:Object:user info object
export const getUserRole = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  const data = doc.data();
  return data;
}; //end getUserRole

//This function will update the class info
//classCode:String:class code
//className:String: class name
export const updateClass = async (classCode, className) => {
  try {
    const docRef = db.collection("classes").doc(classCode);
    await docRef.update({
      className,
    });
  } catch (e) {} //end try
}; //end updateClass

//This function will update the user info
//uid:String:user id
//nickname:String:user name
//status:String:contains user status
export const updateUserDetails = async (uid, nickname, status) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update({
    nickname,
    status,
  });
}; //end updateUserDetails

//This function will get latest assessments
//classes:Array:an array of all classes user has
//return:Array:hold latest assessments
export const getLatestAssessments = async (classes) => {
  if (classes != undefined) {
    const docRef = db.collection("assessment");
    const query = docRef.where("classCode", "in", classes);
    const data = await query.get();
    const currentDate = new Date();
    let filteredData = [];
    data.docs.map((doc) => {
      const tempData = doc.data();
      tempData.assessments.map((val) => {
        filteredData.push(val);
        var storedDate = new Date(val.date);
        var elapsedTime = storedDate.getTime() - currentDate.getTime();
        val.elapsedTime = elapsedTime;
        return val;
      }); //end mapping assessments
    }); //end mapping docs
    console.log(filteredData);
    if (filteredData.lenght > 1) {
      filteredData = quickSort(filteredData, 0, filteredData.length - 1);
    } //end if filteredData.lenght
    return filteredData;
  } else {
    return [];
  } //end classes
}; //end getLatestAssessments

//This function will get name of user form id
//uid:String:user id
//return:Boolean:caontsin ther username
export const getNameById = async (uid) => {
  try {
    const docRef = db.collection("users").doc(uid);
    const doc = await docRef.get();
    const username = doc.data().nickname;
    return username;
  } catch (e) {
    return false;
  } //end try catch
}; //end getNameById

//This function will ass assessments
//classCode:String:class code
//assessmentObj:String:contains assessment name
//roomId:String:room id
//date:String:contains date
//descp:String:assessment description
//return:Boolean:contain boolean if the assessment was added or not
export const addAssessment = async (
  classCode,
  assessmentObj,
  roomId,
  date,
  descp
) => {
  try {
    const docRef = db.collection("assessment").doc(classCode);
    await docRef.update({
      classCode,
      assessments: firebase.firestore.FieldValue.arrayUnion({
        assessmentObj,
        descp,
        roomId,
        date: date.toString(),
        socketId: null,
      }),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  } //end try
}; //end addAssessment

//This function will get all assessments
//classCode:String:class code
//return:Object:all assessments form database
export const getAssessment = async (classCode) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  return doc.data();
}; //end getAssessment

//This function will add teacher socket to database
//socketId:String:socket id
//classCode:String: class code
//roomId:String: room id
export const addTeacherSocket = async (sockedId, classCode, roomdId) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  let data = doc.data();
  let filteredArr = data.assessments.map((val) => {
    if (val.roomId == roomdId) {
      val["socketId"] = sockedId;
    } //end if val.roomId
    return val;
  }); //end mapping assessments
  data.assessments = filteredArr;
  docRef.set(data);
}; //end addTeacherSocket

//This function will delete assessments
//classCode:String:class code
//roomId:String: room id
export const deleteAssessment = async (classCode, roomId) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  let data = doc.data();
  let filteredArr = data.assessments.filter((val) => val.roomId != roomId);
  data.assessments = filteredArr;
  docRef.set(data);
}; //end deleteAssessment
