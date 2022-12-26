import { Component } from "solid-js";

import { ChildrenProps } from "../common/types";

const MainArea: Component<ChildrenProps> = (props) => {
  return <div class="column right-pane m-0 p-0">{props.children}</div>;
};

export default MainArea;
