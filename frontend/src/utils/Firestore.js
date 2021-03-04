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
const addClass = (code, className, uid) => {
  const docRef = db.collection("classes").doc(code);
  let data = {
    classCode: code,
    className: className,
    owner: uid,
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
    const classesRef = db.collection("classes").doc(code);
    await classesRef.update({
      students: firebase.firestore.FieldValue.arrayUnion(uid),
    });
    addClassToUser(code, uid);
  } catch (err) {
    return err;
  }
};
const getAllClasses = async (uid, Classes) => {
  var start = new Date().getTime();
  const docRef = db.collection("classes");
  const query = docRef.where("owner", "==", uid);
  const data = await query.get();
  const classes = data.docs.map((doc) => {
    return doc.data();
  });
  var elapsed = new Date().getTime() - start;
  console.log(elapsed);
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
const addAssesment = async (classCode, assessmentObj, roomId) => {
  const docRef = db.collection("assessment").doc(classCode);

  await docRef.update({
    assessments: firebase.firestore.FieldValue.arrayUnion({
      assessmentObj,
      roomId,
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
