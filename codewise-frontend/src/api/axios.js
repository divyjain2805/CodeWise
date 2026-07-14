import axios from "axios";

const api = axios.create({
  // Use Vite proxy (see `vite.config.js`) so cookies work reliably.
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
