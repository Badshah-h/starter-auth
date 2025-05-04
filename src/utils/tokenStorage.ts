/**
 * Utility for managing authentication tokens
 */
export const tokenStorage = {
  /**
   * Store authentication token
   * @param token The token to store
   * @param remember Whether to store the token for a longer period
   */
  setToken(token: string, remember: boolean = false): void {
    // Store token with expiration time
    const tokenData = {
      value: token,
      expiry: remember
        ? Date.now() + 30 * 24 * 60 * 60 * 1000
        : Date.now() + 24 * 60 * 60 * 1000,
    };

    if (remember) {
      localStorage.setItem("auth_token", JSON.stringify(tokenData));
    } else {
      sessionStorage.setItem("auth_token", JSON.stringify(tokenData));
    }
  },

  /**
   * Get the stored authentication token
   * @returns The stored token or null if not found or expired
   */
  getToken(): string | null {
    // Check sessionStorage first, then localStorage
    const sessionToken = sessionStorage.getItem("auth_token");
    const localToken = localStorage.getItem("auth_token");

    // Process session token if it exists
    if (sessionToken) {
      try {
        const tokenData = JSON.parse(sessionToken);
        if (tokenData.expiry > Date.now()) {
          return tokenData.value;
        } else {
          // Token expired, remove it
          sessionStorage.removeItem("auth_token");
        }
      } catch (e) {
        // Invalid token format, remove it
        sessionStorage.removeItem("auth_token");
      }
    }

    // Process local storage token if it exists
    if (localToken) {
      try {
        const tokenData = JSON.parse(localToken);
        if (tokenData.expiry > Date.now()) {
          return tokenData.value;
        } else {
          // Token expired, remove it
          localStorage.removeItem("auth_token");
        }
      } catch (e) {
        // Invalid token format, remove it
        localStorage.removeItem("auth_token");
      }
    }

    return null;
  },

  /**
   * Check if token is about to expire
   * @returns boolean indicating if token will expire soon
   */
  isTokenExpiringSoon(): boolean {
    const sessionToken = sessionStorage.getItem("auth_token");
    const localToken = localStorage.getItem("auth_token");
    const tokenToCheck = sessionToken || localToken;

    if (tokenToCheck) {
      try {
        const tokenData = JSON.parse(tokenToCheck);
        // Check if token will expire in the next 5 minutes
        return tokenData.expiry < Date.now() + 5 * 60 * 1000;
      } catch (e) {
        return true;
      }
    }

    return false;
  },

  /**
   * Remove the stored authentication token
   */
  removeToken(): void {
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token");
  },
};
