import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { addTeacherSocket } from "../utils/Firestore";

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
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video
      width={vid.width}
      height={vid.height}
      playsInline
      autoPlay
      ref={ref}
    ></video>
  );
};

let vid = {
  height: window.innerHeight / 1,
  width: window.innerWidth / 1,
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const role = props.match.params.role;
  const code = props.match.params.code;
  const socketId = props.match.params.socketId;
  let counter = 1;
  useEffect(() => {
    socketRef.current = io.connect("/");
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
              peers.push(peer);
            }
          });
          setPeers(peers);
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

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  const addSocket = (id) => {
    addTeacherSocket(id, code);
  };

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      <video
        width={vid.width}
        height={vid.height}
        playsInline
        autoPlay
        ref={userVideo}
      ></video>
      {role == "true"
        ? peers.map((peer, index) => {
            return <Video key={index} peer={peer} />;
          })
        : ""}
    </Container>
  );
};

export default Room;
