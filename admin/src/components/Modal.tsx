import { ParentComponent, JSXElement, Show, createSignal } from "solid-js";

export interface ModalProps {
  title: string;
  successButton?: JSXElement;
}

const Modal: ParentComponent<ModalProps> = (props) => {
  return (
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{props.title}</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">{props.children}</section>
        <footer class="modal-card-foot">
          <Show
            when={props.successButton}
            fallback={<button class="button is-success">Save</button>}
          >
            {props.successButton}
          </Show>
          <button class="button">Cancel</button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
  );
};

export default Modal;
