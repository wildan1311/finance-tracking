"use client";

import * as React from "react";
import { subscribeDevice, unsubscribeDevice } from "../actions/notifications.actions";

type SupportState = "unknown" | "unsupported" | "ready";

interface PushState {
  support: SupportState;
  permission: NotificationPermission | "unsupported";
  subscribed: boolean;
  pending: boolean;
  error: string | null;
  /** Set when the browser blocks push for a fixable, user-visible reason. */
  hint: string | null;
}

const INITIAL: PushState = {
  support: "unknown",
  permission: "default",
  subscribed: false,
  pending: false,
  error: null,
  hint: null,
};

/** VAPID public keys are base64url; the Push API wants raw bytes. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

async function getVapidPublicKey(): Promise<string> {
  const res = await fetch("/api/push/vapid-public-key");
  if (!res.ok) throw new Error("Could not load the VAPID public key.");
  const { publicKey } = await res.json();
  return publicKey;
}

/**
 * Client-side push subscription lifecycle.
 *
 * Two rules drive the design:
 *  1. `Notification.requestPermission()` must be called from a user gesture, so
 *     it lives inside `enable()` and never runs on mount.
 *  2. iOS only supports Web Push for a home-screen installed PWA (16.4+), and
 *     silently reports "unsupported" in a Safari tab. Detected explicitly so
 *     the user gets a real message instead of a dead toggle.
 */
export function usePushSubscription() {
  const [state, setState] = React.useState<PushState>(INITIAL);

  const sync = React.useCallback(async (registration: ServiceWorkerRegistration) => {
    const existing = await registration.pushManager.getSubscription();
    setState((prev) => ({ ...prev, subscribed: Boolean(existing) }));
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState((prev) => ({
        ...prev,
        support: "unsupported",
        permission: "unsupported",
        hint: "This browser does not support push notifications.",
      }));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          support: "ready",
          permission: Notification.permission,
        }));

        await sync(registration);
      } catch {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            support: "unsupported",
            hint: "Service worker unavailable. Serve the app over HTTPS or localhost.",
          }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sync]);

  const enable = React.useCallback(async () => {
    setState((prev) => ({ ...prev, pending: true, error: null, hint: null }));

    try {
      const registration = await navigator.serviceWorker.ready;

      // Must happen inside the click handler to count as a user gesture.
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setState((prev) => ({
          ...prev,
          pending: false,
          permission,
          hint:
            permission === "denied"
              ? "Notifications are blocked for this site in your browser settings."
              : "Permission was not granted.",
        }));
        return;
      }

      const publicKey = await getVapidPublicKey();

      // userVisibleOnly is mandatory: a push that shows nothing is not allowed.
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const result = await subscribeDevice(subscription.toJSON());

      if (!result.status) {
        setState((prev) => ({ ...prev, pending: false, error: result.message }));
        return;
      }

      setState((prev) => ({ ...prev, pending: false, subscribed: true, permission }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        pending: false,
        error: error instanceof Error ? error.message : "Could not enable notifications.",
      }));
    }
  }, []);

  const disable = React.useCallback(async () => {
    setState((prev) => ({ ...prev, pending: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Tell the server first: once unsubscribed locally the endpoint is gone.
        await unsubscribeDevice(subscription.endpoint);
        await subscription.unsubscribe();
      }

      setState((prev) => ({ ...prev, pending: false, subscribed: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        pending: false,
        error: error instanceof Error ? error.message : "Could not disable notifications.",
      }));
    }
  }, []);

  return { ...state, enable, disable };
}
