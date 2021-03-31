//Noel Gregory
//2021-03-30
//This file redirects user that are not logged in

//imports
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

//This function will render the private route component
//component:Object:contains component hsitory
//return:JSX: jsx expression of private route
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/main"} />
        )
      }
    />
  );
}; //end PrivateRoute

export default PrivateRoute;
