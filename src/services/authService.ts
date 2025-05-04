import api from "./api";
import axios from "axios";

// Define the base API URL - this would point to your Laravel backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
    avatar_url?: string;
    role?: string;
  };
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Initialize API with CSRF token
async function initializeCSRF() {
  const baseURL = API_URL.replace(/\/api$/, "");
  try {
    await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize CSRF protection", error);
    return false;
  }
}

export const authService = {
  /**
   * Login user with email and password
   */
  async login(
    email: string,
    password: string,
    remember: boolean = false,
  ): Promise<LoginResponse> {
    try {
      // Initialize CSRF protection before login
      await initializeCSRF();

      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
        remember,
      });
      return response.data;
    } catch (error) {
      // Enhance error handling
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error(
          "Network error. Please check your connection and try again.",
        );
      }
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string): Promise<void> {
    try {
      // Initialize CSRF protection before registration
      await initializeCSRF();

      await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });
    } catch (error) {
      // Enhance error handling
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error(
          "Network error. Please check your connection and try again.",
        );
      }
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
      // Even if the API call fails, we still want to remove the token
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser() {
    const response = await api.get("/auth/user");
    return response.data;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post(`/auth/email/verify/${token}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/auth/password/email", { email });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      await api.post("/auth/password/reset", {
        token,
        email,
        password,
        password_confirmation: password,
      });
    } catch (error) {
      throw error;
    }
  },
};
