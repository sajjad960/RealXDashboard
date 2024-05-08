import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
import useAuthToken from "./hooks/auth/useAuthToken";

// Route-based code splitting
const Home = lazy(() => import("./views/pages/Home"));
const ProductsView = lazy(() => import("./views/pages/ProductsView"));

const login = lazy(() => import("./views/pages/authentication/login/Login"));
const register = lazy(() =>
  import("./views/pages/authentication/register/Register")
);

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => {
  const { authToken, isExpired } = useAuthToken();

  return (
    <Route
      {...rest}
      render={(props) => {
        // if client not authenticated redirect login
        if (
          props.location.pathname !== "/login" &&
          !authToken &&
          !isExpired &&
          props.location.pathname !== "/register" &&
          props.location.pathname !== "/forgot-password" &&
          props.location.pathname !== "/reset-password"
        ) {
          return <Redirect to="/login" />;
        }
        return (
          <ContextLayout.Consumer>
            {(context) => {
              let LayoutTag =
                fullLayout === true
                  ? context.fullLayout
                  : context.state.activeLayout === "horizontal"
                  ? context.horizontalLayout
                  : context.VerticalLayout;
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    <Component {...props} />
                  </Suspense>
                </LayoutTag>
              );
            }}
          </ContextLayout.Consumer>
        );
      }}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.login.userRole,
  };
};

const AppRoute = connect(mapStateToProps)(RouteConfig);

const AppRouter = () => {
  return (
    // Set the directory path if you are deploying in sub-folder
    <Router history={history}>
      <Switch>
        <AppRoute exact path="/" component={Home} />
        <AppRoute path="/products" component={ProductsView} />
        <AppRoute path="/login" component={login} fullLayout />
        <AppRoute path="/register" component={register} fullLayout />
      </Switch>
    </Router>
  );
};

export default AppRouter;
