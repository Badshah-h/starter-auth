import api from "./api";

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
  },

  /**
   * Update user password
   */
  async updatePassword(data: PasswordUpdateData) {
    const response = await api.put("/user/password", data);
    return response.data;
  },
};
