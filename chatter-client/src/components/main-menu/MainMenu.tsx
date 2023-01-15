import { ParentComponent } from "solid-js";

const MainMenu: ParentComponent = (props) => {
  return (
    <div class="column is-2 is-narrow-mobile m-0 p-0">{props.children}</div>
  );
};

export default MainMenu;
