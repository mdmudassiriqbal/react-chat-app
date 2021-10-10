import { Suspense } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import FallbackAnimation from "../components/FallbackAnimation/FallbackAnimation";
import { ROUTES } from "./config";
import NotFound from "../components/NotFound/NotFound";

const TOKEN = "token";
const RouteWithSubRoutes = ({
  isPrivate,
  isEager,
  path,
  exact,
  component: Component,
  ...rest
}) => {
  const authTokenInState = useSelector(({ auth: { token } }) => token);

  const authTokenInStorage = localStorage.getItem(TOKEN);
  const isLoggedIn = !!(authTokenInState ?? authTokenInStorage);
  return (
    <Route
      path={path}
      exact={exact}
      render={(routerProps) => {
        if (isPrivate && !isLoggedIn) {
          return (
            // Auth Guard
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: routerProps.location,
                },
              }}
            />
          );
        }
        return isEager ? (
          <Component {...rest} {...routerProps} />
        ) : (
          <Suspense fallback={<FallbackAnimation />}>
            <Component {...rest} {...routerProps} />
          </Suspense>
        );
      }}
    />
  );
};

const RoutesWrapper = ({ socket }) => {
  const location = useLocation();
  return (
    <Switch>
      {ROUTES.map((route) => (
        <RouteWithSubRoutes {...route} key={route.path} socket={socket} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
};

export default RoutesWrapper;
