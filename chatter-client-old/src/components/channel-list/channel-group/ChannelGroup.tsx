import { Component, For } from "solid-js";
import ChannelGroupTitle from "./ChannelGroupTitle";

import "./ChannelGroup.sass";

export interface ChannelGroupProps {
  title: string;
  channelList?: string[];
}

const ChannelGroup: Component<ChannelGroupProps> = (props) => {
  return (
    <>
      <ChannelGroupTitle {...props} />
      <ul class="menu-list">
        <For each={props.channelList}>
          {(item) => (
            <li>
              <a class="channel-title">{item}</a>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export default ChannelGroup;
