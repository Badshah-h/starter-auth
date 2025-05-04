/**
 * Utility for managing user session and inactivity
 */

import { tokenStorage } from "./tokenStorage";

const SESSION_TIMEOUT_KEY = "session_timeout";
const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const sessionManager = {
  /**
   * Initialize session timeout tracking
   * @param logoutCallback Function to call when session times out
   * @param timeoutWarningCallback Function to call when session is about to timeout
   * @param timeoutMs Timeout in milliseconds
   */
  initSessionTimeout(
    logoutCallback: () => void,
    timeoutWarningCallback?: (remainingMs: number) => void,
    timeoutMs: number = DEFAULT_TIMEOUT,
  ): () => void {
    let timeoutId: number | null = null;
    let warningTimeoutId: number | null = null;

    // Reset timeout when user is active
    const resetTimeout = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (warningTimeoutId) window.clearTimeout(warningTimeoutId);

      // Set warning timeout (2 minutes before session expires)
      if (timeoutWarningCallback) {
        warningTimeoutId = window.setTimeout(
          () => {
            timeoutWarningCallback(2 * 60 * 1000); // 2 minutes remaining
          },
          timeoutMs - 2 * 60 * 1000,
        );
      }

      // Set session timeout
      timeoutId = window.setTimeout(() => {
        logoutCallback();
      }, timeoutMs);

      // Store timeout timestamp in sessionStorage
      sessionStorage.setItem(
        SESSION_TIMEOUT_KEY,
        (Date.now() + timeoutMs).toString(),
      );
    };

    // Check if there's an existing timeout from a previous page load
    const existingTimeout = sessionStorage.getItem(SESSION_TIMEOUT_KEY);
    if (existingTimeout) {
      const timeoutTimestamp = parseInt(existingTimeout, 10);
      const now = Date.now();

      if (timeoutTimestamp > now) {
        // Still valid, set timeout for remaining time
        const remainingTime = timeoutTimestamp - now;

        if (remainingTime < 2 * 60 * 1000 && timeoutWarningCallback) {
          // Less than 2 minutes remaining, show warning immediately
          timeoutWarningCallback(remainingTime);
        } else if (timeoutWarningCallback) {
          // Set warning for 2 minutes before timeout
          warningTimeoutId = window.setTimeout(
            () => {
              timeoutWarningCallback(2 * 60 * 1000);
            },
            remainingTime - 2 * 60 * 1000,
          );
        }

        timeoutId = window.setTimeout(() => {
          logoutCallback();
        }, remainingTime);
      } else {
        // Timeout already expired
        logoutCallback();
        return;
      }
    } else {
      // No existing timeout, start a new one
      resetTimeout();
    }

    // Add event listeners to reset timeout on user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      document.addEventListener(event, resetTimeout);
    });

    // Return cleanup function
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (warningTimeoutId) window.clearTimeout(warningTimeoutId);

      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  },

  /**
   * Clear session timeout
   */
  clearSessionTimeout(): void {
    sessionStorage.removeItem(SESSION_TIMEOUT_KEY);
  },

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingSessionTime(): number {
    const timeoutTimestamp = sessionStorage.getItem(SESSION_TIMEOUT_KEY);
    if (!timeoutTimestamp) return 0;

    const remaining = parseInt(timeoutTimestamp, 10) - Date.now();
    return remaining > 0 ? remaining : 0;
  },
};
