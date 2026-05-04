"use client";

import { useEffect } from "react";

export function ThemeInit() {
  useEffect(() => {
    const isDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}