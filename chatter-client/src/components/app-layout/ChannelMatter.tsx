import { ParentComponent } from "solid-js";

const ChannelMatter: ParentComponent = (props) => {
  return <div class="container channel-matter">{props.children}</div>;
};

export default ChannelMatter;
