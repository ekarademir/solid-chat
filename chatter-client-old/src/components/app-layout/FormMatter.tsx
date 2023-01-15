import { ParentComponent } from "solid-js";

const FormMatter: ParentComponent = (props) => {
  return <div class="container form-matter pt-2">{props.children}</div>;
};

export default FormMatter;
