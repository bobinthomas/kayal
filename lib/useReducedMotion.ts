"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}

/** Reactive `prefers-reduced-motion` — updates live if the OS setting changes. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
