import { ParentComponent, JSXElement, Show } from "solid-js";

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  successButton?: JSXElement;
}

const Modal: ParentComponent<ModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <div class="modal is-active">
        <div class="modal-background" onClick={() => props.onClose()}></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{props.title}</p>
            <button
              class="delete"
              aria-label="close"
              onClick={() => props.onClose()}
            ></button>
          </header>
          <section class="modal-card-body">{props.children}</section>
          <footer class="modal-card-foot">
            <Show
              when={props.successButton}
              fallback={
                <button
                  class="button is-success"
                  onClick={() => props.onSuccess()}
                >
                  Save
                </button>
              }
            >
              {props.successButton}
            </Show>
            <button class="button" onClick={() => props.onClose()}>
              Cancel
            </button>
          </footer>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
      </div>
    </Show>
  );
};

export default Modal;
