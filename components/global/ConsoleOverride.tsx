"use client";

import { useEffect } from "react";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    _restoreConsole?: () => void;
  }
}

/**
 * This component overrides console methods globally when NEXT_PUBLIC_DISABLE_LOGS is true
 * It's meant to be included in the root layout to ensure it runs early
 */
export default function ConsoleOverride() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Check if logs should be disabled
    const isLoggingDisabled = process.env.NEXT_PUBLIC_DISABLE_LOGS === "true";

    if (isLoggingDisabled) {
      // Store original console methods
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
      };

      // Override console methods
      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};
      console.info = () => {};

      // Add a way to restore original console if needed
      // This is accessible via browser console as window._restoreConsole()
      window._restoreConsole = () => {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
        console.log("Console methods restored");
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
}
