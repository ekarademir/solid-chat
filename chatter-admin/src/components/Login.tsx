import { Component } from "solid-js";

import LabelledInput from "./form/LabelledInput";

const Login: Component = () => {
  return (
    <>
      <LabelledInput label="Username" />
      <LabelledInput label="Password" type="password" />
    </>
  );
};

export default Login;
