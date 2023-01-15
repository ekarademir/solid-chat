import { ParentComponent } from "solid-js";

const HeadMatter: ParentComponent = (props) => {
  return <div class="container head-matter">{props.children}</div>;
};

export default HeadMatter;
