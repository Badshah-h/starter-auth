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
    if (remember) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }
  },

  /**
   * Get the stored authentication token
   * @returns The stored token or null if not found
   */
  getToken(): string | null {
    // Check sessionStorage first, then localStorage
    return (
      sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
    );
  },

  /**
   * Remove the stored authentication token
   */
  removeToken(): void {
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token");
  },
};
