import { ParentComponent } from "solid-js";

import { NotificationType } from "../services/notifications/Notifications";

export interface NotificationProps {
  cancelAction: () => void;
  type?: NotificationType;
  message?: string;
}

const Notification: ParentComponent<NotificationProps> = (props) => {
  return (
    <div
      classList={{
        notification: true,
        "is-warning": props.type === NotificationType.WARNING,
        "is-danger": props.type === NotificationType.ERROR,
        "is-success": props.type === NotificationType.SUCCESS || !props.type,
      }}
    >
      <button onClick={() => props.cancelAction()} class="delete"></button>
      {props.children || props.message}
    </div>
  );
};

export default Notification;
