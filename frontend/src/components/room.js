import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { addTeacherSocket } from "../utils/Firestore";
import pearson from "../utils/algoritims";
import { Card, Badge } from "antd";
import "./room.css";
const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <Card
      size="small"
      title={<p id={"d" + props.id}></p>}
      extra={<p id={props.id}></p>}
      style={{ width: vid.width, height: vid.height }}
    >
      <video
        width={vid.width}
        height={vid.height}
        playsInline
        autoPlay
        ref={ref}
      ></video>
    </Card>
  );
};

let vid = {
  height: window.innerHeight / 1,
  width: window.innerWidth / 1,
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  let oldImage = [];
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.state.roomID;
  const role = props.state.role;
  const code = props.state.classCode;
  const socketId = props.state.socketId;
  let counter = 1;
  const endPoint = {
    local: "http://192.168.0.35:8000/",
    prod: "https://isugapi.herokuapp.com/",
  };
  useEffect(() => {
    socketRef.current = io.connect(endPoint.local);
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

        if (role == "false") {
          const canvas = document.getElementById("canvas");
          const ctx = canvas.getContext("2d");
          requestAnimationFrame(async function loop() {
            await new Promise((r) => setTimeout(r, 3000));
            ctx.drawImage(userVideo.current, 0, 0, 16, 12);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const data = imageData.data;
            const result = pearson(data, oldImage);

            const date = new Date().getTime();
            socketRef.current.emit("sendMsg", {
              data: result,
              id: socketId,
              myId: socketRef.current.id,
              time: date,
              name: "name",
            });
            console.log(result);
            oldImage = data;
            requestAnimationFrame(loop);
          });
        }

        socketRef.current.emit("join room", roomID);

        if (role == "true") {
          addSocket(socketRef.current.id);
        }
        socketRef.current.on("all users", (users) => {
          const peers = [];

          users.forEach((userID) => {
            if (socketId == userID) {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push({ peer, id: userID });
            }
          });
          setPeers(peers);
        });
        socketRef.current.on("cheater", (payload) => {
          let data = document.getElementById(payload.myId);

          let count = document.getElementById("d" + payload.myId);
          data.innerText = "Name: " + payload.myId;
          console.log(count);
          if (typeof payload.data === "number") {
            const percent = parseInt(Math.abs(payload.data * 100 - 100));
            let isCheating = "";
            if (percent >= 75) {
              isCheating = '<div class="blink_me">Cheating !</div>';
            }
            count.innerHTML = `<p>Cheating %: ${percent}  ${isCheating}<p>`;
          }
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          counter++;
          vid = {
            height: window.innerHeight / counter,
            width: window.innerWidth / counter,
          };

          setPeers((users) => [...users, { peer, id: payload.callerID }]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          console.log(item);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  const addSocket = (id) => {
    addTeacherSocket(id, code);
  };

  function createPeer(userToSignal, callerID, stream) {
    console.log(stream);
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

  return (
    <Container>
      <canvas id="canvas" width="16" height="12"></canvas>
      <video
        width={vid.width}
        height={vid.height}
        playsInline
        autoPlay
        ref={userVideo}
      ></video>
      {role == "true"
        ? peers.map((peer, index) => {
            return <Video key={index} id={peer.id} peer={peer} />;
          })
        : ""}
    </Container>
  );
};

export default Room;
