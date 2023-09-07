import { useIsRouting, useSearchParams } from "@solidjs/router";
import { For, Show, createEffect, createSignal } from "solid-js";
import { createId } from "../../utils";

export type NotificationType = "info" | "error" | "warn";
export interface Notification {
  message: string;
  type: NotificationType;
  id?: string;
  pageUrlOfCreation?: string;
}
const validTypes = ["info", "error", "warn"];

export interface NotificationMessages {
  [key: string]: string;
}
const notificationMessages: NotificationMessages = {
  atSignIn: "You have been signed in.",
  atSignUp: "You have been signed up.",
};

const [notifications, setNotifications] = createSignal<Notification[]>([]);

export default function Notifications() {
  const isRouting = useIsRouting();
  const [searchParams, _] = useSearchParams();
  const [lastNotificationMessage, setLastNotificationMessage] =
    createSignal<string>();
  createEffect(() => {
    if (isRouting()) {
      setNotifications([]);
    }
  });

  createEffect(() => {
    if (searchParams["notification"] === lastNotificationMessage()) {
      return;
    }
    setLastNotificationMessage(searchParams["notification"]);
    if (!searchParams["notification"]) {
      return;
    }
    const notification = searchParams["notification"];
    const type = (searchParams["type"] as NotificationType) || "info";
    if (notification && type && validTypes.includes(type)) {
      const message = notificationMessages[notification] || notification;
      createNotification({ message, type });
    }
  });

  return (
    <Show when={notifications()?.length > 0}>
      <div class="notifications-component">
        <For each={notifications()}>
          {(notification, index) => (
            <div
              class={`notification ${notification.type}`}
              onClick={() => removeNotification(index())}
            >
              {notification.message} {notification.id}
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}

function removeNotification(index: number) {
  const newNotifications = [...notifications()];
  newNotifications.splice(index, 1);
  setNotifications(newNotifications);
}

function removeNotificationById(id: string) {
  const newNotifications = [...notifications()];
  const index = newNotifications.findIndex(
    (notification) => notification.id === id
  );
  if (index > -1) {
    newNotifications.splice(index, 1);
    setNotifications(newNotifications);
  }
}

export function createNotification(notification: Notification) {
  notification.id = createId();
  notification.pageUrlOfCreation = window.location.href;
  setNotifications([...notifications(), notification]);
}
