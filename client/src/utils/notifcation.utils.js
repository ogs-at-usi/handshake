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
  } else if (getNotificationStatus() === 'default') {
    Notification.requestPermission();
  }
}
