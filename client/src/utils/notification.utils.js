import store from '@/store';

/**
 *
 * @returns {NotificationPermission}
 */
export function getNotificationStatus() {
  return Notification.permission;
}
/**
 *
 */
export function askNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications!');
  } else if (
    getNotificationStatus() === 'default' ||
    store.state.allowNotifications
  ) {
    Notification.requestPermission();
  }
}

/**
 * @param sender
 * @param message
 * @param click
 */
export function sendNotification(sender, message, click) {
  if (getNotificationStatus() !== 'granted' || !store.state.allowNotifications)
    return;
  const notification = new Notification(sender, { body: message });
  notification.onclick = click;
}
