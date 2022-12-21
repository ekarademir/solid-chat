import { Component } from "solid-js";

import "./ChannelList.sass";
import ChannelGroup from "./channel-group/ChannelGroup";

const ChannelList: Component = () => {
  return (
    <aside class="menu channel-list pl-1 py-1">
      <ChannelGroup
        title="Channel group 1 very long title and longer and longer"
        channelList={[
          "Channnel 1",
          "Channnel 2 very long title and longer and longer",
          "Channnel 3",
          "Channnel 4",
        ]}
      />
      <ChannelGroup
        title="Channel group 2"
        channelList={["Channnel 1", "Channnel 2", "Channnel 3", "Channnel 4"]}
      />
      <ChannelGroup
        title="Channel group 3 very long title and longer and longer"
        channelList={[
          "Channnel 1 very long title and longer and longer",
          "Channnel 2",
          "Channnel 3",
          "Channnel 4",
        ]}
      />
      <ChannelGroup
        title="Channel group 4"
        channelList={[
          "Channnel 1",
          "Channnel 2",
          "Channnel 3",
          "Channnel 4 very long title and longer and longer",
        ]}
      />
      <ChannelGroup
        title="Channel group 5"
        channelList={[
          "Channnel 1",
          "Channnel 2",
          "Channnel 3 very long title and longer and longer",
          "Channnel 4",
        ]}
      />
    </aside>
  );
};

export default ChannelList;
