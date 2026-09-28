import z from "zod";

/**
 * Validates the payload posted by `serviceWorker.pushManager.subscribe()` and
 * by the `pushsubscriptionchange` handler in `public/sw.js`.
 */
const pushSubscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
  expirationTime: z.number().nullish(),
  keys: z.object({
    p256dh: z.string().min(1).max(512),
    auth: z.string().min(1).max(512),
  }),
  createdAt: z.string().optional(),
});

export { pushSubscriptionSchema };
