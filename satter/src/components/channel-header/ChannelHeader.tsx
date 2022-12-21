import { Component } from "solid-js";
import { FaRegularCircle } from "solid-icons/fa";

const ChannelHeader: Component = () => {
  return (
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="is-size-4">Channel title</p>
        </div>
        <div class="level-item">
          <p class="is-size-6">
            Mauris sed lectus interdum, bibendum leo ut, ullamcorper lorem.
          </p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <FaRegularCircle />
        </div>
        <div class="level-item">
          <FaRegularCircle />
        </div>
        <div class="level-item">
          <FaRegularCircle />
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;
