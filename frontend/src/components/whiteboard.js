//Noel Gregory
//2021-03-30
//This file will create a whiteboard component

//imports
import React, { useRef, useState } from "react";
import io from "socket.io-client";
import "./room.css";
import Sketch from "react-p5";

//This function will render the whiteboard component
//props:Object:contains props form parent component
const Whiteboard = (props) => {
  const [color, setColor] = useState("#000000");
  const [weight, setWeight] = useState(3);
  const socketRef = useRef();
  const { roomID, role } = props.location.state;
  const endPoint = {
    local: "http://localhost:8000/",
    prod: "https://isugapi.herokuapp.com/",
  };
  let p = null; //contains p5 instance

  //This function will setup the canvas and socket.on
  //p5:Object:contains in p5 Object
  //parent:Object:contains p5 parent
  const setup = (p5, parent) => {
    socketRef.current = io.connect(endPoint.prod);
    socketRef.current.on("sendClear", (payload) => {
      if (payload.room == roomID) {
        p.background(240);
      } //end if payload.room
    });
    socketRef.current.on("sendCoord", (coord) => {
      if (roomID == coord.room) {
        //calculations
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
        //draw
        p5.stroke(c);
        p5.strokeWeight(w);
        p5.line(x1, y1, x2, y2);
      } //end if roomID
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
    } //end if role
    p = p5;
    p5.background(240);
  }; //end setup

  //This fucntion will clear the canvas
  const clear = () => {
    p.background(240);
    //emit
    socketRef.current.emit("clear", {
      room: roomID,
    });
  }; //end clear

  //This function will draw a line where the mouse position is
  //p5:Object:p5 object
  function mouseDragged(p5) {
    p5.stroke(color);
    p5.strokeWeight(weight);
    connection(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    p = p5;
  } //end mouseDragged

  //This function will send  mouse position to students
  //x:Integer:x position
  //y:Integer:y position
  //px:Integer:previous x position
  //py:Integer:previous y position
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
  }; //end connection

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
}; //end Whiteboard

export default Whiteboard;
