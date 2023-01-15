import { ParentComponent } from "solid-js";

const AppFrame: ParentComponent = (props) => {
  return (
    <div class="columns is-mobile is-clipped app-frame m-0 p-0">
      {props.children}
    </div>
  );
};

export default AppFrame;
