//Noel Gregory
//20210-03-29
//This file render thr room componeent and allow user to video chat

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { addTeacherSocket } from "../utils/Firestore";
import { pearson } from "../utils/algoritims";
import { Modal, Button, Image } from "antd";
import "./room.css";

//This function will create the video component
//props:Object:contains the parent component values
//return:JSX:contains the jsx expression of video component
const Video = (props) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState();

  //This function will create stream using the peer object at component mount
  useEffect(() => {
    props.peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    let target = document.getElementById("d" + props.id);

    //creaitng mutationobserver
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        takepicture();
      });
    });

    let config = {
      childList: true,
      subtree: true,
      characterData: true,
    };

    observer.observe(target, config);
  }, []); //end useEffect

  //This function handles the show button in modal
  const showModal = () => {
    setVisible(true);
  }; //end showModal

  //This function handles the ok button in modal
  const handleOk = () => {
    setVisible(false);
  }; //end handleOk

  //This function handles the cancel button in modal
  const handleCancel = () => {
    setVisible(false);
  }; //end handleCancel

  //This function will take picture when the percent cheating is greater than 60
  const takepicture = () => {
    const percentTxt = parseInt(
      document
        .getElementById("d" + props.id)
        .innerText.replace("Cheating %: ", "")
    );

    if (percentTxt >= 60) {
      var canvas = document.createElement("CANVAS");
      var context = canvas.getContext("2d");
      context.drawImage(ref.current, 0, 0, canvas.width, canvas.height);
      var data = canvas.toDataURL("image/png");
      setUrl(data);
    } //end if percentTxt
  }; //end takepicture

  return (
    <div
      style={{ width: vid.width + 30, height: vid.height + 30 }}
      className="grid-item"
    >
      <table>
        <thead>
          <tr>
            <td id={"d" + props.id}>Cheating %: 0</td>
            <td style={{ marginLeft: "20px" }} id={props.id}></td>
            <td
              style={{ marginLeft: "20px" }}
              className="cheating_blink"
              id={"c" + props.id}
            ></td>
            <td>
              {" "}
              <Button type="primary" onClick={showModal}>
                Get Cheating Image
              </Button>
              <Modal
                title="Cheating Image"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={vid.width + 50}
                height={vid.height}
              >
                <Image
                  width={vid.width}
                  height={vid.height}
                  id={"img" + props.id}
                  src={url}
                  alt="Not Available"
                />
              </Modal>
            </td>
          </tr>
        </thead>
      </table>
      <video
        width={vid.width}
        height={vid.height}
        playsInline
        autoPlay
        ref={ref}
      ></video>
    </div>
  );
}; //end Video

let vid = {
  height: window.innerHeight / 1,
  width: window.innerWidth / 1,
}; //video size

//This function will create a Room component
//props:Object:contains the parent component values
//return:JSX:contains the room component jsx expression
const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const [visible, setVisible] = useState();
  let checker = 0;
  let currentImage = [];
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const { name, roomID, code, socketId, role } = props.location.state;
  let counter = 1;
  const endPoint = {
    local: "http://localhost:8000/",
    prod: "https://isugapi.herokuapp.com/",
  };

  //This function will create connection to socket and intialize sceenshare
  useEffect(() => {
    socketRef.current = io.connect(endPoint.prod); //connecting server
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          width: 1280,
          height: 720,
          frameRate: {
            ideal: 10,
            max: 15,
          },
        },
        cursor: true,
        mimeType: "video/webm; codecs=vp9",
      })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        if (role == false) {
          //This function is anonymous and will send the stream to teacher and find the similarity rate
          setInterval(() => {
            try {
              if (checker >= 1) {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                ctx.drawImage(userVideo.current, 0, 0, 16, 12);
                const imageData = ctx.getImageData(
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                let data = imageData.data;

                if (checker == 1 || checker == 2) {
                  currentImage = imageData.data;
                  checker++;
                } //end if checker
                const result = pearson(data, currentImage);
                const date = new Date().getTime();
                socketRef.current.emit("sendMsg", {
                  data: result,
                  id: socketId,
                  myId: socketRef.current.id,
                  time: date,
                  name: name,
                });
              } //end if checker
            } catch (e) {} //end try
          }, 1000);
        } //end if role

        socketRef.current.emit("join room", roomID);

        if (role == true) {
          addSocket(socketRef.current.id);
        } //end if role

        //This function will get all users from server
        //users:Array:contains all the user in room
        socketRef.current.on("all users", (users) => {
          const peers = [];

          users.forEach((userID) => {
            //connect with only teacher
            if (socketId == userID) {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                id: userID,
                peer,
              });
              peers.push({ peer, id: userID });
            } //end if socketId
          });
          setPeers(peers);
        }); //end function

        //This function will send the cheating rate for the students
        //payload:Object:contains the payload from server,with user info
        socketRef.current.on("cheater", (payload) => {
          try {
            let data = document.getElementById(payload.myId);
            let count = document.getElementById("d" + payload.myId);

            data.innerText = "Name: " + payload.name;
            if (typeof payload.data === "number") {
              const percent = parseInt(Math.abs(payload.data * 100 - 100));

              if (percent >= 60) {
                document.getElementById("c" + payload.myId).innerText =
                  "Cheating !";
                setTimeout(() => {
                  document.getElementById("c" + payload.myId).innerText = "";
                }, 5000);
              } //end if percent
              count.innerText = `Cheating %: ${percent}`;
            } //end if typeof payload.data
          } catch (e) {} //end try
        }); //end function

        if (role == false) {
          //This function will start the cheater checker algorithm  for students
          //payload:Object:contains object with room id
          socketRef.current.on("startChecker", (payload) => {
            if (payload.roomId == roomID) {
              checker++;
            } //end if payload.roomId
          }); //end function
        } //end if role

        //This function will get recently joined user from server
        //payload:OBject:contains new user details
        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            id: payload.callerID,
            peer,
          });
          counter++;
          calcPlayerSize();
          setPeers((users) => [...users, { peer, id: payload.callerID }]);
        }); //end function

        //This function will receive returning signal from other users
        //payload:Object:contains user info
        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.id == payload.id);
          if (item) {
            item.peer.signal(payload.signal);
          } //end if item
        }); //end function

        //This function will get user that disconnected
        //id:String:user id
        socketRef.current.on("user disconnected", (id) => {
          const peerObj = peersRef.current.find((p) => p.id == id);
          if (peerObj) {
            peerObj.peer.destroy();
            counter--;
            calcPlayerSize();
          } //end if peerObj

          const peers = peersRef.current.filter((p) => p.id !== id);
          peersRef.current = peers;
          setPeers(peers);
        }); //end function
      });
  }, []); //end useEffect

  //This function will add teacher socket to database
  //id:String:user id
  const addSocket = (id) => {
    addTeacherSocket(id, code, roomID);
  }; //end addSocket

  //This function will run on unmount of component and disconnect user from server
  useEffect(() => {
    return () => {
      socketRef.current.close();
    };
  }, []); //end useEffect

  //This function will create a new peer object
  //userToSignal:String:id of user sending signal to
  //callerID:String:contains the user id
  //stream:Object:contains the stream object froms creensahre
  //return:Object:contains the peer object
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    //This fucntion will get the signal from peer connection
    //signal:Object:contain peer signal
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    }); //end function

    return peer;
  } //end createPeer

  //This function will add peer
  //incomingSignal:String:the id of the incoming signal
  //callerID:String:contains the user id
  //stream:Object:contains the stream object froms creensahre
  //return:Object:contains the peer object
  function addPeer(incomingSignal, callerID, stream) {
    console.log(stream);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    //This function will be called on peer signal
    //signal:Object:contains peer signal object
    peer.on("signal", (signal) => {
      console.log(signal);
      socketRef.current.emit("returning signal", { signal, callerID });
    }); //end function

    peer.signal(incomingSignal);

    return peer;
  } //end addPeer

  //this function will calcualte the video size
  const calcPlayerSize = () => {
    //calculations
    let width = window.innerWidth / counter;
    let height = window.innerHeight / counter;
    if (height > 150 || width > 150) {
      vid.height = height;
      vid.width = width;
    } //end if height and width
  }; //end calcPlayerSize
  //This function handles the show button in modal
  const showModal = () => {
    setVisible(true);
  }; //end showModal

  //This function handles the ok button in modal
  const handleOk = () => {
    setVisible(false);
  }; //end handleOk

  //This function handles the cancel button in modal
  const handleCancel = () => {
    setVisible(false);
  }; //end handleCancel

  //This function will start checking algorthim on students
  const startChecker = () => {
    socketRef.current.emit("checker", { roomId: roomID });
    handleCancel();
  }; //end startChecker

  return (
    <div className="grid-container">
      <div
        style={
          role == true
            ? { width: vid.width + 30, height: vid.height + 30 }
            : { width: vid.width, height: vid.height }
        }
        className="grid-item"
      >
        <table>
          <tr>
            <td>
              <canvas
                style={{ display: "none" }}
                id="canvas"
                width="16"
                height="12"
              ></canvas>
            </td>

            {
              role == true ? (
                <td>
                  <Button type="primary" onClick={showModal}>
                    Start Cheater Checker
                  </Button>
                  <Modal
                    title="Cheating Image"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p> Click Start when all students are on test screen</p>
                    <Button type="primary" onClick={startChecker}>
                      Start
                    </Button>
                  </Modal>
                </td>
              ) : (
                ""
              ) //end if role
            }

            <td style={{ marginLeft: "100px" }}>{"Name: " + name}</td>
          </tr>
        </table>

        <video
          width={vid.width}
          height={vid.height}
          playsInline
          autoPlay
          ref={userVideo}
        ></video>
      </div>

      {
        role == true
          ? peers.map((peer) => {
              return <Video key={peer.id} id={peer.id} peer={peer} />;
            })
          : "" //end if role
      }
    </div>
  );
}; //end Room

export default Room;
