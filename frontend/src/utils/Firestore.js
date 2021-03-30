import { db } from "./base";
import firebase from "firebase/app";
import { quickSort } from "./algoritims";

const checkUserExist = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();

  if (!doc.exists) {
    return true;
  } else {
    return false;
  }
};

const addUser = async (uid, val) => {
  const docRef = db.collection("users").doc(uid);
  let userRole = {
    role: null,
  };
  if (val) {
    userRole.role = true;
  } else {
    userRole.role = false;
  }
  await docRef.set(userRole);
};

const addInfo = async (values, uid) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update(values);
};
const addClass = (code, className, uid, room) => {
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
};
const joinClass = async (code, uid) => {
  try {
    console.log(code, uid);
    const classesRef = db.collection("classes").doc(code.trim());
    await classesRef.update({
      students: firebase.firestore.FieldValue.arrayUnion(uid),
    });
    addClassToUser(code, uid);
  } catch (err) {
    console.log(err);
    return err;
  }
};
const getAllClasses = async (uid, studentOrTeacher) => {
  const docRef = db.collection("classes");
  let query = null;
  if (studentOrTeacher == true) {
    query = docRef.where("owner", "==", uid);
  } else {
    query = docRef.where("students", "array-contains", uid);
  }
  const data = await query.get();
  const classes = [];
  for (let i = 0; i < data.docs.length; i++) {
    let tempData = data.docs[i].data();
    const id = tempData.owner;
    const name = await getNameById(id);
    tempData.owner = name;
    classes.push(tempData);
  }
  return classes;
};
const addClassToUser = async (code, uid) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update({
    Classes: firebase.firestore.FieldValue.arrayUnion(code),
  });
};
const getUserRole = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  const data = doc.data();
  return data;
};

const updateClass = async (classCode, className) => {
  try {
    const docRef = db.collection("classes").doc(classCode);
    await docRef.update({
      className,
    });
  } catch (e) {}
};
const updateUserDetails = async (uid, nickname, status) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update({
    nickname,
    status,
  });
};
const getLatestAssessments = async (classes) => {
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
      });
    });
    console.log(filteredData.lenght + " dsddds");
    if (filteredData.lenght > 1) {
      filteredData = quickSort(filteredData, 0, filteredData.length - 1);
    }
    return filteredData;
  } else {
    return [];
  }
};

const getNameById = async (uid) => {
  try {
    const docRef = db.collection("users").doc(uid);
    const doc = await docRef.get();
    const username = doc.data().nickname;
    return username;
  } catch (e) {
    return false;
  }
};

const addAssessment = async (classCode, assessmentObj, roomId, date, descp) => {
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
  }
};
const getAssessment = async (classCode) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  return doc.data();
};

const addTeacherSocket = async (sockedId, classCode, roomdId) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  let data = doc.data();
  let filteredArr = data.assessments.map((val) => {
    if (val.roomId == roomdId) {
      val["socketId"] = sockedId;
    }
    return val;
  });
  data.assessments = filteredArr;
  docRef.set(data);
};

const deleteAssessment = async (classCode, roomId) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  let data = doc.data();
  let filteredArr = data.assessments.filter((val) => val.roomId != roomId);
  data.assessments = filteredArr;
  docRef.set(data);
};

export {
  getNameById,
  deleteAssessment,
  updateClass,
  updateUserDetails,
  getLatestAssessments,
  addTeacherSocket,
  getAssessment,
  addAssessment,
  checkUserExist,
  addUser,
  getUserRole,
  addClass,
  joinClass,
  addInfo,
  getAllClasses,
};
