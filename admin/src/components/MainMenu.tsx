import { Component } from "solid-js";

import { ChildrenProps } from "../lib/types";

export const MainMenu: Component<ChildrenProps> = (props) => {
  return (
    <aside class="menu">
      <ul class="menu-list">{props.children}</ul>
    </aside>
  );
};

export const MainMenuItem: Component<ChildrenProps> = (props) => {
  return <li>{props.children}</li>;
};
