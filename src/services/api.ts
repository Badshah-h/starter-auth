import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { tokenStorage } from "../utils/tokenStorage";

// Define the base API URL - this would point to your Laravel backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Function to refresh CSRF token
async function refreshCSRFToken() {
  const baseURL = API_URL.replace(/\/api$/, "");
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for cookies/CSRF with Laravel Sanctum
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && originalRequest) {
      // Try to refresh CSRF token and retry the request
      try {
        await refreshCSRFToken();
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        tokenStorage.removeToken();
        window.location.href = "/";
      }
    }

    // Handle 419 CSRF token mismatch (Laravel specific)
    if (error.response?.status === 419 && originalRequest) {
      try {
        await refreshCSRFToken();
        return api(originalRequest);
      } catch (refreshError) {
        console.error("CSRF token refresh failed", refreshError);
      }
    }

    // Handle 429 Too Many Requests (rate limiting)
    if (error.response?.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    }

    // Extract error message from Laravel response format
    let errorMessage = "An unexpected error occurred";
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.errors) {
        // Laravel validation errors come as an object of arrays
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }
    }

    return Promise.reject(new Error(errorMessage));
  },
);

export default api;
