import React, { Component } from "react";
import { app } from "./base";
import "antd/dist/antd.css";
import { Spin } from "antd";
const AuthContext = React.createContext();

class AuthProvider extends Component {
  state = { currentUser: null, loader: true };
  style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
  };

  componentDidMount() {
    app.auth().onAuthStateChanged((user) => {
      this.setState({ currentUser: user, loader: false });
    });
  }
  render() {
    const { currentUser, loader } = this.state;
    if (loader) {
      return (
        <div style={this.style}>
          <Spin size="large" tip="Loading..." />
        </div>
      );
    } else {
      return (
        <AuthContext.Provider value={{ currentUser }}>
          {this.props.children}
        </AuthContext.Provider>
      );
    }
  }
}

export { AuthProvider, AuthContext };
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
