/*
 * Service worker for the Finance Tracker PWA.
 *
 * Scope: push notifications only. It intentionally does NOT cache anything —
 * a caching strategy here would serve stale HTML and break `next dev` HMR.
 * The `fetch` listener exists solely because Chrome requires one for the
 * "Install app" prompt. Offline support is a separate concern.
 *
 * Hand-written rather than bundled (no Serwist/Workbox) because Next 16
 * defaults to Turbopack, which cannot run webpack plugins. `tsconfig.json`
 * excludes this file for the same reason.
 */

const CACHE_NAME = "finance-tracker-shell-v1";

// ---------------------------------------------------------------------------
// Install / activate
// ---------------------------------------------------------------------------

self.addEventListener("install", () => {
  // No precache: see the note above about caching.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// ---------------------------------------------------------------------------
// Fetch — pass-through only (required for installability, caches nothing)
// ---------------------------------------------------------------------------

self.addEventListener("fetch", () => {
  // Intentionally empty. Not calling respondWith() means the browser handles
  // the request normally, so the network, dev HMR and Next.js caching all
  // behave exactly as they do without a service worker.
});

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------

const DEFAULT_PAYLOAD = {
  title: "Finance Tracker",
  body: "Don't forget to record expenses and income today.",
  url: "/transactions",
};

self.addEventListener("push", (event) => {
  // `userVisibleOnly: true` requires a visible notification for every push, so
  // this must never bail out early even when the payload is missing.
  let payload = { ...DEFAULT_PAYLOAD };

  if (event.data) {
    try {
      payload = { ...DEFAULT_PAYLOAD, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  const { title, body, url, icon, badge, tag } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || "/finance-192x192.png",
      badge: badge || "/icon-light-32x32.png",
      // Collapses repeat notifications for the same tag instead of stacking.
      tag: tag || "finance-daily-reminder",
      renotify: false,
      data: { url: url || "/" },
      vibrate: [200, 100, 200],
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = event.notification.data?.url || "/";

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Focus an existing tab rather than opening a duplicate.
      for (const client of windows) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }

      return self.clients.openWindow(target);
    })(),
  );
});

// ---------------------------------------------------------------------------
// Subscription rotation
// ---------------------------------------------------------------------------

/*
 * Push services rotate subscriptions. When that happens the server's stored
 * endpoint goes stale and every send starts failing with 404/410, so re-subscribe
 * and push the new details back to the app. Support is uneven across browsers,
 * hence the defensive try/catch.
 */
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const { publicKey } = await fetch("/api/push/vapid-public-key").then((r) =>
          r.json(),
        );

        const subscription = await self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON()),
        });
      } catch (error) {
        // Nothing actionable inside a service worker; the server prunes dead
        // endpoints on the next send anyway.
        console.error("[sw] pushsubscriptionchange failed", error);
      }
    })(),
  );
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
