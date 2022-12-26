import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  ParentComponent,
  Show,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

import NotificationComponent from "../components/Notification";

const DEFAULT_DURATION = 2000; // ms

export enum NotificationStatus {
  SCHEDULED,
  ACTIVE,
  CANCELLED,
  SHOWN,
}

export enum NotificationType {
  SUCCESS,
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
    scheduleSuccess: (message: string) => void;
    scheduleWarning: (message: string) => void;
    scheduleError: (message: string) => void;
    nextNotification: () => Notification | void;
  }
];

const defaultState: NotificationsContextState = {
  notificationsList: [],
};

const NotificationsContext = createContext<NotificationsContextValue>([
  defaultState,
  {
    scheduleNotification: () => undefined,
    scheduleSuccess: () => undefined,
    scheduleWarning: () => undefined,
    scheduleError: () => undefined,
    nextNotification: () => undefined,
  },
]);

export const NotificationsProvider: ParentComponent<{
  notifications?: Notification[];
  notificationDuration?: number;
}> = (props) => {
  const [notificationsState, setNotificationsState] =
    createStore<NotificationsContextState>({
      notificationsList: props.notifications
        ? [...props.notifications]
        : [...defaultState.notificationsList],
    });

  const scheduleNotification = (notification: Notification) =>
    setNotificationsState("notificationsList", (prev) => [
      ...prev,
      notification,
    ]);

  const scheduleSuccess = (message: string) =>
    setNotificationsState("notificationsList", (prev) => [
      ...prev,
      {
        message,
        status: NotificationStatus.SCHEDULED,
        type: NotificationType.SUCCESS,
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
    setNotificationsState("notificationsList", (prev) => {
      return [
        ...prev,
        {
          message,
          status: NotificationStatus.SCHEDULED,
          type: NotificationType.ERROR,
        },
      ];
    });

  const nextNotification = () => {
    if (notificationsState.notificationsList.length) {
      const first = notificationsState.notificationsList[0];
      setNotificationsState(
        "notificationsList",
        notificationsState.notificationsList.slice(1)
      );
      return first;
    }
  };

  const [currentNotification, setCurrentNotification] =
    createSignal<Notification>();

  let consumeTimeout;

  const consumeNotifications = () => {
    if (consumeTimeout) clearTimeout(consumeTimeout);
    setCurrentNotification();

    const nextOne = nextNotification();
    if (nextOne) {
      setCurrentNotification(nextOne);
      consumeTimeout = setTimeout(
        () => consumeNotifications(),
        props.notificationDuration ?? DEFAULT_DURATION
      );
    }
  };

  onMount(consumeNotifications);
  createEffect(() => {
    if (!currentNotification()) {
      consumeNotifications();
    }
  });

  return (
    <NotificationsContext.Provider
      value={[
        notificationsState,
        {
          scheduleNotification,
          scheduleSuccess,
          scheduleWarning,
          scheduleError,
          nextNotification,
        },
      ]}
    >
      <Show when={currentNotification()} keyed={true}>
        {(notification) => {
          return (
            <div
              style="position: absolute; z-index: 1000; width: 100vw;"
              class="columns mt-0"
            >
              <div class="column is-full m-3">
                <NotificationComponent
                  type={notification.type}
                  cancelAction={consumeNotifications}
                >
                  {notification.message}
                </NotificationComponent>
              </div>
            </div>
          );
        }}
      </Show>
      {props.children}
    </NotificationsContext.Provider>
  );
};

export const notificationsApi = () => useContext(NotificationsContext);
