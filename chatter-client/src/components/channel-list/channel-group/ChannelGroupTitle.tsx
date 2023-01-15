import { Component } from "solid-js";

const ChannelGroupTitle: Component<{ title: string }> = (props) => {
  return <p class="menu-label channel-group-title">{props.title}</p>;
};

export default ChannelGroupTitle;
