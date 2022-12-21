import { Component } from "solid-js";

import { ChildrenProps } from "../common/types";

const FormMatter: Component<ChildrenProps> = (props) => {
  return <div class="container form-matter pt-2">{props.children}</div>;
};

export default FormMatter;
