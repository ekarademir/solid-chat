import { Component } from "solid-js";

import { AuthorizationProvider } from "../services/AuthorizationService";
import LoginComponent from "../components/Login";

const Login: Component = () => {
  return (
    <AuthorizationProvider>
      <LoginComponent />
    </AuthorizationProvider>
  );
};

export default Login;
