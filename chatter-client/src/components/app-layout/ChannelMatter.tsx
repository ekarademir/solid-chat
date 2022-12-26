import { Component } from "solid-js";

import { ChildrenProps } from "../common/types";

const ChannelMatter: Component<ChildrenProps> = (props) => {
  return <div class="container channel-matter">{props.children}</div>;
};

export default ChannelMatter;
