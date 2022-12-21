import { Component, JSXElement } from "solid-js";

import { ChildrenProps } from "../common/types";

const MainMenu: Component<ChildrenProps> = (props) => {
  return (
    <div class="column is-2 is-narrow-mobile m-0 p-0">{props.children}</div>
  );
};

export default MainMenu;
