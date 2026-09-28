"use client";

import * as React from "react";

/**
 * Registers `public/sw.js`.
 *
 * Registration is deferred until `load` so it never competes with the initial
 * render, and `requestIdleCallback` is used when available. The worker caches
 * nothing, so registering it in development is safe and lets push be tested on
 * localhost without a production build.
 */
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    const register = () => {
      if (cancelled) return;
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", register);
    };
  }, []);

  return <>{children}</>;
}
