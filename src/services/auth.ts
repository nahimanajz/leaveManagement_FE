import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export const loginWithMicrosoft = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/microsoft`);
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getUserByEmailOrMicrosoftId = async (
  email: string,
  microsoftId: string
) => {
  try {
    const url = `${API_URL}/users/find`;
    const response = await axios.post(url, { email, microsoftId });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by email or Microsoft ID:", error);

  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error("Failed to get current user:", error);
    throw error;
  }
};
