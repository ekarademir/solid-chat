import { Component } from "solid-js";

import {
  AppFrame,
  HeadMatter,
  ChannelMatter,
  FormMatter,
  MainArea,
} from "./components/app-layout";

import MainMenu from "./components/main-menu/MainMenu";
import ChannelList from "./components/channel-list/ChannelList";
import Channel from "./components/channel/Channel";
import ChatForm from "./components/chat-form/ChatForm";
import ChannelHeader from "./components/channel-header/ChannelHeader";

import "./components/app-layout/Layout.sass";

const App: Component = () => {
  return (
    <AppFrame>
      <MainMenu>
        <ChannelList />
      </MainMenu>
      <MainArea>
        <HeadMatter>
          <ChannelHeader />
        </HeadMatter>
        <ChannelMatter>
          <Channel />
        </ChannelMatter>
        <FormMatter>
          <ChatForm />
        </FormMatter>
      </MainArea>
    </AppFrame>
  );
};

export default App;
