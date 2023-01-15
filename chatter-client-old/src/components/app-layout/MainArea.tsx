import { ParentComponent } from "solid-js";

const MainArea: ParentComponent = (props) => {
  return <div class="column right-pane m-0 p-0">{props.children}</div>;
};

export default MainArea;
