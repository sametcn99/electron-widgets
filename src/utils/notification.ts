import { Notification } from "electron";

export function showNotification(
  NOTIFICATION_TITLE: string,
  NOTIFICATION_BODY: string = "",
) {
  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show();
}
