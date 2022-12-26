import { ParentComponent } from "solid-js";

export const MainMenu: ParentComponent = (props) => {
  return (
    <aside class="menu">
      <ul class="menu-list">{props.children}</ul>
    </aside>
  );
};

export const MainMenuItem: ParentComponent = (props) => {
  return <li>{props.children}</li>;
};
