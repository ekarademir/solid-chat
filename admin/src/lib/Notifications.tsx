import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export enum NotificationStatus {
  SCHEDULED,
  ACTIVE,
  CANCELLED,
  SHOWN,
}

export enum NotificationType {
  MESSAGE,
  WARNING,
  ERROR,
}

export type Notification = {
  status: NotificationStatus;
  message: string;
  type: NotificationType;
};

export type NotificationsContextState = {
  notificationsList: Notification[];
};

export type NotificationsContextValue = [
  state: NotificationsContextState,
  actions: {
    scheduleNotification: (notification: Notification) => void;
    scheduleMessage: (message: string) => void;
    scheduleWarning: (message: string) => void;
    scheduleError: (message: string) => void;
  }
];

const defaultState: NotificationsContextState = {
  notificationsList: [],
};

const NotificationsContext = createContext<NotificationsContextValue>([
  defaultState,
  {
    scheduleNotification: () => undefined,
    scheduleMessage: () => undefined,
    scheduleWarning: () => undefined,
    scheduleError: () => undefined,
  },
]);

export const NotificationsProvider: ParentComponent<{
  notifications?: Notification[];
}> = (props) => {
  const [notificationsState, setNotificationsState] =
    createStore<NotificationsContextState>({
      notificationsList: [...props.notifications] ?? [
        ...defaultState.notificationsList,
      ],
    });

  const scheduleNotification = (notification: Notification) =>
    setNotificationsState("notificationsList", (prev) => [
      ...prev,
      notification,
    ]);

  const scheduleMessage = (message: string) =>
    setNotificationsState("notificationsList", (prev) => [
      ...prev,
      {
        message,
        status: NotificationStatus.SCHEDULED,
        type: NotificationType.MESSAGE,
      },
    ]);

  const scheduleWarning = (message: string) =>
    setNotificationsState("notificationsList", (prev) => [
      ...prev,
      {
        message,
        status: NotificationStatus.SCHEDULED,
        type: NotificationType.WARNING,
      },
    ]);

  const scheduleError = (message: string) =>
    setNotificationsState("notificationsList", (prev) => [
      ...prev,
      {
        message,
        status: NotificationStatus.SCHEDULED,
        type: NotificationType.ERROR,
      },
    ]);

  return (
    <NotificationsContext.Provider
      value={[
        notificationsState,
        {
          scheduleNotification,
          scheduleMessage,
          scheduleWarning,
          scheduleError,
        },
      ]}
    >
      {props.children}
    </NotificationsContext.Provider>
  );
};

const [
  _state,
  { scheduleNotification, scheduleMessage, scheduleWarning, scheduleError },
] = useContext(NotificationsContext);

export {
  scheduleNotification,
  scheduleMessage,
  scheduleWarning,
  scheduleError,
};
