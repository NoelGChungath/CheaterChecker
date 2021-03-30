import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { addTeacherSocket } from "../utils/Firestore";
import { pearson } from "../utils/algoritims";
import { Modal, Button, Image } from "antd";
import "./room.css";
const Video = (props) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState();

  useEffect(() => {
    props.peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    var target = document.getElementById("d" + props.id);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        takepicture();
      });
    });

    var config = {
      childList: true,
      subtree: true,
      characterData: true,
    };

    observer.observe(target, config);
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

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
    }
  };

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
};

let vid = {
  height: window.innerHeight / 1,
  width: window.innerWidth / 1,
};

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

  useEffect(() => {
    socketRef.current = io.connect(endPoint.prod);
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
                }
                const result = pearson(data, currentImage);
                const date = new Date().getTime();
                socketRef.current.emit("sendMsg", {
                  data: result,
                  id: socketId,
                  myId: socketRef.current.id,
                  time: date,
                  name: name,
                });
              }
            } catch (e) {}
          }, 1000);
        }

        socketRef.current.emit("join room", roomID);

        if (role == true) {
          addSocket(socketRef.current.id);
        }
        socketRef.current.on("all users", (users) => {
          const peers = [];

          users.forEach((userID) => {
            if (socketId == userID) {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                id: userID,
                peer,
              });
              peers.push({ peer, id: userID });
            }
          });
          setPeers(peers);
        });
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
              }
              count.innerText = `Cheating %: ${percent}`;
            }
          } catch (e) {}
        });
        if (role == false) {
          socketRef.current.on("startChecker", (payload) => {
            if (payload.roomId == roomID) {
              checker++;
            }
          });
        }

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            id: payload.callerID,
            peer,
          });
          counter++;
          calcPlayerSize();

          setPeers((users) => [...users, { peer, id: payload.callerID }]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.id == payload.id);
          if (item) {
            item.peer.signal(payload.signal);
          }
        });

        socketRef.current.on("user disconnected", (id) => {
          const peerObj = peersRef.current.find((p) => p.id == id);
          if (peerObj) {
            peerObj.peer.destroy();
            counter--;
            calcPlayerSize();
          }

          const peers = peersRef.current.filter((p) => p.id !== id);
          peersRef.current = peers;
          setPeers(peers);
        });
      });
  }, []);

  const addSocket = (id) => {
    addTeacherSocket(id, code, roomID);
  };

  useEffect(() => {
    return () => {
      socketRef.current.close();
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log(signal);
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    console.log(stream);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log(signal);
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const calcPlayerSize = () => {
    if (
      window.innerHeight / counter > 150 ||
      window.innerWidth / counter > 150
    ) {
      vid.height = window.innerHeight / counter;
      vid.width = window.innerWidth / counter;
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const startChecker = () => {
    socketRef.current.emit("checker", { roomId: roomID });
    handleCancel();
  };

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

            {role == true ? (
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
            )}

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

      {role == true
        ? peers.map((peer) => {
            return <Video key={peer.id} id={peer.id} peer={peer} />;
          })
        : ""}
    </div>
  );
};

export default Room;
