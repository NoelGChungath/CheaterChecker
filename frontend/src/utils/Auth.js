import React, { Component } from "react";
import { app } from "./base";
import { Spin } from "antd";
import { checkUserExist, getUserRole } from "./Firestore";
import { withRouter } from "react-router-dom";

export const AuthContext = React.createContext();

class AuthProvider extends Component {
  state = {
    currentUser: null,
    photoUrl: null,
    loader: true,
    status: null,
    sendUser: false,
  };
  style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
  };

  componentDidMount() {
    app.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({
          currentUser: user,
          loader: false,
          status: null,
          photoUrl: user.photoURL,
        });
      } else {
        this.setState({
          currentUser: user,
          loader: false,
          photoUrl: user.photoURL,
        });
      }
    });
  }
  checkUser = async () => {
    let { currentUser, sendUser } = this.state;
    const { history } = this.props;
    if (currentUser != null && sendUser == false) {
      let res = await checkUserExist(currentUser.uid);
      let temp = "";
      if (res) {
        temp = "/selectrole";
      } else {
        temp = "/";
      }
      sendUser = true;
      history.push(temp);
      this.setState({ currentUser, sendUser });
    }
  };

  getRole = async () => {
    const { currentUser, status } = this.state;
    if (currentUser != null && status == null) {
      const data = await getUserRole(currentUser.uid);
      this.setState({ status: data });
    }
  };
  componentDidUpdate() {
    this.checkUser();
    this.getRole();
  }

  render() {
    const { currentUser, loader, status, photoUrl } = this.state;
    if (loader) {
      return (
        <div style={this.style}>
          <Spin size="large" tip="Loading..." />
        </div>
      );
    } else {
      return (
        <AuthContext.Provider value={{ currentUser, status, photoUrl }}>
          {this.props.children}
        </AuthContext.Provider>
      );
    }
  }
}

export default withRouter(AuthProvider);
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [pending, setPending] = useState(true);

//   useEffect(() => {
//     app.auth().onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       setPending(false);
//     });
//   }, []);

//   if (pending) {
//     return <>Loading...</>;
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
