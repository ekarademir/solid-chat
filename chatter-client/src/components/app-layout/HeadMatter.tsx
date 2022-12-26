import { Component } from "solid-js";

import { ChildrenProps } from "../common/types";

const HeadMatter: Component<ChildrenProps> = (props) => {
  return <div class="container head-matter">{props.children}</div>;
};

export default HeadMatter;
