import api from "./api";
import axios from "axios";

interface ProfileUpdateData {
  name?: string;
  email?: string;
  username?: string;
  avatar?: File;
}

interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const userService = {
  /**
   * Get user profile
   */
  async getProfile() {
    const response = await api.get("/user/profile");
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileUpdateData) {
    try {
      // If we have a file, we need to use FormData
      if (data.avatar) {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.username) formData.append("username", data.username);
        formData.append("avatar", data.avatar);

        const response = await api.post("/user/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      }

      // Regular JSON request
      const response = await api.put("/user/profile", data);
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error(
            "Network error. Please check your connection and try again.",
          );
        }
        // Handle validation errors
        if (error.response.status === 422 && error.response.data?.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            throw new Error(firstError[0]);
          }
        }
      }
      throw error;
    }
  },

  /**
   * Update user password
   */
  async updatePassword(data: PasswordUpdateData) {
    try {
      const response = await api.put("/user/password", data);
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error(
            "Network error. Please check your connection and try again.",
          );
        }
        // Handle validation errors
        if (error.response.status === 422 && error.response.data?.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            throw new Error(firstError[0]);
          }
        }
        // Handle incorrect current password
        if (error.response.status === 403) {
          throw new Error("Current password is incorrect.");
        }
      }
      throw error;
    }
  },
};
