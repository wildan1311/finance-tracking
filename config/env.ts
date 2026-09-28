/**
 * Environment access for infrastructure layers.
 *
 * Nothing above `infrastructure` should read `process.env` directly — import
 * `env` from here so required variables are declared in exactly one place.
 */
const env = {
  pin: process.env.PIN,
  spreadsheetId: process.env.SHEETID,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,

  // Web Push / PWA
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  vapidSubject: process.env.VAPID_SUBJECT,
  /** `json` (default) or `sheet`. */
  pushStore: process.env.PUSH_STORE ?? "json",
  notificationTimezone: process.env.NOTIFICATION_TIMEZONE ?? "Asia/Jakarta",
  cronSecret: process.env.CRON_SECRET,
};

export { env };
