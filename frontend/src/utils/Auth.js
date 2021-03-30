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
          status: null,
        });
      } else {
        this.setState({
          currentUser: null,
          loader: false,
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

  getRole = async (onForce) => {
    const { currentUser, status } = this.state;
    if (currentUser != null && status == null) {
      const data = await getUserRole(currentUser.uid);
      this.setState({ status: data, loader: false });
    } else if (onForce == true) {
      const data = await getUserRole(currentUser.uid);
      this.setState({ status: data, loader: false });
    }
  };
  componentDidUpdate() {
    this.checkUser();
    this.getRole();
  }

  render() {
    const { currentUser, loader, status } = this.state;
    if (loader) {
      return (
        <div style={this.style}>
          <Spin size="large" tip="Loading..." />
        </div>
      );
    } else {
      return (
        <AuthContext.Provider
          value={{ currentUser, status, getRole: this.getRole }}
        >
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
