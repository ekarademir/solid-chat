import { Component } from "solid-js";

const ChatForm: Component = () => {
  return (
    <div class="field">
      <div class="control">
        <textarea class="textarea" placeholder="Your message"></textarea>
      </div>
    </div>
  );
};

export default ChatForm;
