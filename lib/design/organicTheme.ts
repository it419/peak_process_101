"use client";

import { useSyncExternalStore } from "react";
import { ORGANIC_THEME_STORAGE_KEY } from "./organicThemeScript";

export type OrganicTheme = "light" | "dark";

const CHANGE_EVENT = "ppp-organic-theme-change";

function readStoredTheme(): OrganicTheme | null {
  try {
    const value = window.localStorage.getItem(ORGANIC_THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): OrganicTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: OrganicTheme) {
  document.documentElement.setAttribute("data-organic-theme", theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function setOrganicTheme(theme: OrganicTheme) {
  try {
    window.localStorage.setItem(ORGANIC_THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.) — still apply for this page view.
  }
  applyTheme(theme);
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  // Follow the OS live, but only while the visitor hasn't picked a theme.
  const onSystemChange = () => {
    if (readStoredTheme() === null) applyTheme(systemTheme());
  };
  // Another tab toggled the theme.
  const onStorage = (e: StorageEvent) => {
    if (e.key === ORGANIC_THEME_STORAGE_KEY) applyTheme(readStoredTheme() ?? systemTheme());
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): OrganicTheme {
  return document.documentElement.getAttribute("data-organic-theme") === "dark" ? "dark" : "light";
}

/** The resolved Organic theme currently applied to the document. */
export function useOrganicTheme(): OrganicTheme {
  return useSyncExternalStore(subscribe, getSnapshot, () => "light");
}
