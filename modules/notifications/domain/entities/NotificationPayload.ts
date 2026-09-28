/**
 * The JSON body sent to the push service, and rendered by `public/sw.js`.
 *
 * Field names are part of the service worker contract — changing them means
 * updating `public/sw.js` too.
 */
interface NotificationPayload {
  title: string;
  body: string;
  /** Where the notification click should navigate to. */
  url?: string;
  icon?: string;
  badge?: string;
  /** Replaces any existing notification with the same tag. */
  tag?: string;
}

export default NotificationPayload;
