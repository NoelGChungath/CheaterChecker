import { db, app } from "./base";
import firebase from "firebase/app";
const checkUserExist = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  console.log(doc.exists);

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
const addClass = (code) => {
  const docRef = db.collection("classes").doc(code);
  let data = {
    classCode: code,
    className: "Class" + code,
    students: null,
  };

  docRef.set(data);
};
const joinClass = async (code, uid) => {
  try {
    const classesRef = db.collection("classes").doc(code);
    const docRef = db.collection("users").doc(uid);
    await docRef.update(code);
    await classesRef.update({
      students: firebase.firestore.FieldValue.arrayUnion(uid),
    });
  } catch (err) {
    return err;
  }
};
const getUserRole = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  const data = doc.data();
  return data;
};

export { checkUserExist, addUser, getUserRole, addClass, joinClass, addInfo };
