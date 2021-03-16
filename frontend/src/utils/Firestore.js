import { db } from "./base";
import firebase from "firebase/app";

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
  const classes = data.docs.map((doc) => {
    return doc.data();
  });
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
function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  let date = "";
  let counter = 0;
  if (d != 0) {
    date += d + " days, ";
    counter++;
  }
  if (h != 0) {
    date += h + " hours, ";
    counter++;
  }
  //if (counter != 2) {
  if (m != 0) {
    date += m + " minutes, ";
  }
  if (s != 0) {
    date += s + " seconds ";
  }
  //  }

  return date;
}
const getLatestAssements = async (classes) => {
  const docRef = db.collection("assessment");
  const query = docRef.where("classCode", "in", classes);
  const data = await query.get();
  const currentDate = new Date();
  let filteredData = [];
  data.docs.map((doc) => {
    const tempData = doc.data();
    tempData.assessments.map((val) => {
      filteredData.push({ data: val, class: tempData.className });
      var storedDate = new Date(val.date);
      var elapsedTime = currentDate.getTime() - storedDate.getTime();
      val.elaspedTime = convertMS(elapsedTime);
    });
  });
  return filteredData;
};

const addAssesment = async (classCode, assessmentObj, roomId) => {
  const docRef = db.collection("assessment").doc(classCode);
  const date = new Date().toString();
  await docRef.update({
    classCode,
    assessments: firebase.firestore.FieldValue.arrayUnion({
      assessmentObj,
      roomId,
      date,
    }),
  });
};
const getAssesment = async (classCode) => {
  const docRef = db.collection("assessment").doc(classCode);
  const doc = await docRef.get();
  return doc.data();
};

const addTeacherSocket = async (sockedId, classCode) => {
  const docRef = db.collection("assessment").doc(classCode);

  await docRef.update({ sockedId });
};

export {
  getLatestAssements,
  addTeacherSocket,
  getAssesment,
  addAssesment,
  checkUserExist,
  addUser,
  getUserRole,
  addClass,
  joinClass,
  addInfo,
  getAllClasses,
};
