import React, { Component } from "react";
import { Link } from "react-router-dom";
class Main extends Component {
  state = {};

  render() {
    return <Link to="/login">Login</Link>;
  }
}

export default Main;
// class ChooseRole extends Component {
//   addRole = async (val) => {
//     const userUid = this.props.location.state.uid;
//     if (val == "teacher") {
//       await addUser(userUid, true);
//     } else {
//       await addUser(userUid, false);
//     }
//     this.props.history.push("/");
//   };
//   render() {
//     return (
//       <div>
//         <button
//           onClick={() => {
//             this.addRole("teacher");
//           }}
//         >
//           Teacher
//         </button>
//         <button
//           onClick={() => {
//             this.addRole("student");
//           }}
//         >
//           Student
//         </button>
//       </div>
//     );
//   }
// }

// export default ChooseRole;
