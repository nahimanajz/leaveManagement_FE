import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use Vite's environment variable
  timeout: 10000, // Set a timeout for requests
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem("authToken"); // Replace with your token logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Handle specific HTTP status codes
      if (error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
        // Redirect to login page or handle token refresh
      } else if (error.response.status === 403) {
        console.error("Forbidden: You do not have access.");
      } else if (error.response.status === 500) {
        console.error("Server error: Please try again later.");
      }
    } else {
      console.error("Network error: Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
