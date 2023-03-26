// import React, { useContext } from "react";
// import { Route, Redirect, Link } from "react-router-dom";
// import { AuthContext } from "./Auth";

// const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
//   const {currentUser} = useContext(AuthContext);
//   return (
//     <Route
//       {...rest}
//       render={routeProps =>
//         !!currentUser ? (
//           <RouteComponent {...routeProps} />
//         ) : (
//           <Link to={"/login"} />
//         )
//       }
//     />
//   );
// };


// export default PrivateRoute