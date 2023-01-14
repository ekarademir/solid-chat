import { Component } from "solid-js";
import { createStore } from "solid-js/store";

import { BasicAuthenticationRequest } from "../chat/chat";
import LabelledInput from "./form/LabelledInput";
import { authorizationService } from "../services/AuthorizationService";

const [loginState, setLoginState] = createStore<BasicAuthenticationRequest>({
  username: null,
  password: null,
});

const Login: Component = () => {
  const [_s, { login }] = authorizationService();
  return (
    <>
      <h1 class="title">Please log in to continue</h1>
      <LabelledInput
        label="Username"
        value={loginState.username}
        onInput={(e) => setLoginState("username", e.currentTarget.value)}
      />
      <LabelledInput
        label="Password"
        type="password"
        value={loginState.password}
        onInput={(e) => setLoginState("password", e.currentTarget.value)}
      />
      <button class="button is-success" onClick={() => login(loginState)}>
        Save
      </button>
    </>
  );
};

export default Login;
