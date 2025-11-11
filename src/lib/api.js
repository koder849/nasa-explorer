import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallback =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Unexpected error";
    return Promise.reject(new Error(fallback));
  }
);

export default api;
