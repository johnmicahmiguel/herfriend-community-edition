/**
 * Custom logger utility that conditionally logs based on environment
 * Logs are disabled in production when NEXT_PUBLIC_DISABLE_LOGS is set to 'true'
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Check if logs should be disabled based on environment variable
const isLoggingDisabled = process.env.NEXT_PUBLIC_DISABLE_LOGS === "true";

// Create a custom console object that conditionally logs
const logger = {
  log: (...args: any[]) => {
    if (!isLoggingDisabled) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (!isLoggingDisabled) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (!isLoggingDisabled) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (!isLoggingDisabled) {
      console.info(...args);
    }
  },
  // Keep these methods as they are for debugging purposes
  debug: console.debug,
  trace: console.trace,
  // Add a method to force logging even when disabled
  force: {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  },
};

export default logger;
