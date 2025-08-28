import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: "https://taskflow-backend-dkwh.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const { access_token } = useAuthStore.getState();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

export default api;
