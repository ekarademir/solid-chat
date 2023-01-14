import { Component } from "solid-js";

import { AuthorizationProvider } from "../services/AuthorizationService";
import LoginComponent from "../components/Login";

const Login: Component = () => {
  return (
    <AuthorizationProvider>
      <div class="columns is-centered">
        <div class="column is-6">
          <div class="section">
            <LoginComponent />
          </div>
        </div>
      </div>
    </AuthorizationProvider>
  );
};

export default Login;
