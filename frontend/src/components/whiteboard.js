import React, { useRef, useState } from "react";
import io from "socket.io-client";
import "./room.css";
import Sketch from "react-p5";

console.log("fdfdsdsdddddddddddfd");
const Whiteboard = (props) => {
  const [color, setColor] = useState("#000000");
  const [weight, setWeight] = useState(3);
  const socketRef = useRef();
  const { roomID, role } = props.location.state;
  const endPoint = {
    local: "http://localhost:8000/",
    prod: "https://isugapi.herokuapp.com/",
  };
  let p = null;

  const setup = (p5, parent) => {
    socketRef.current = io.connect(endPoint.local);
    socketRef.current.on("sendClear", (payload) => {
      console.log(payload);
      if (payload.room == roomID) {
        p.background(240);
      } //end if payload.room
    });
    socketRef.current.on("sendCoord", (coord) => {
      if (roomID == coord.room) {
        const { x, y, px, py } = coord.data;
        const { c, w, widthSize, heighthSize } = coord.settings;
        let x1 = p5.map(x, 0, widthSize, 0, window.innerWidth);
        let y1 = p5.map(
          y,
          0,
          heighthSize,
          0,
          window.innerHeight - window.innerHeight / 18
        );
        let x2 = p5.map(px, 0, widthSize, 0, window.innerWidth);
        let y2 = p5.map(
          py,
          0,
          heighthSize,
          0,
          window.innerHeight - window.innerHeight / 18
        );
        p5.stroke(c);
        p5.strokeWeight(w);
        p5.line(x1, y1, x2, y2);
      }
    });
    const canvas = p5
      .createCanvas(
        window.innerWidth,
        window.innerHeight - window.innerHeight / 18
      )
      .parent(parent);
    if (role == true) {
      canvas.addClass("drawTeacherCanvas");
    } else {
      canvas.addClass("drawStudentCanvas");
    }
    p = p5;
    p5.background(240);
  };
  const clear = () => {
    p.background(240);
    socketRef.current.emit("clear", {
      room: roomID,
    });
  };

  function mouseDragged(p5) {
    p5.stroke(color);
    p5.strokeWeight(weight);
    connection(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    p = p5;
  }

  const connection = (x, y, px, py) => {
    socketRef.current.emit("coord", {
      data: { x, y, px, py },

      settings: {
        c: color,
        w: weight,
        widthSize: window.innerWidth,
        heighthSize: window.innerHeight - window.innerHeight / 18,
      },
      room: roomID,
    });
  };

  return (
    <div>
      {role == true ? (
        <div>
          {" "}
          <div className="optionToDraw">
            <label>Color:</label>
            <button onClick={clear}>Clear Screen</button>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="number"
              min={1}
              max={100}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <Sketch setup={setup} mouseDragged={mouseDragged} />
        </div>
      ) : (
        <Sketch setup={setup} />
      )}
    </div>
  );
};

export default Whiteboard;
