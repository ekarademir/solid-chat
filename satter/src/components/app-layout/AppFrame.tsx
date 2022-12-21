import { Component } from "solid-js";

import { ChildrenProps } from "../common/types";

const AppFrame: Component<ChildrenProps> = (props) => {
  return (
    <div class="columns is-mobile is-clipped app-frame m-0 p-0">
      {props.children}
    </div>
  );
};

export default AppFrame;
