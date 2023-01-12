import { Component } from "solid-js";

import { AuthorizationProvider } from "../services/AuthorizationService";

const Login: Component = () => {
  return (
    <AuthorizationProvider>
      <p>Login</p>
    </AuthorizationProvider>
  );
};

export default Login;
