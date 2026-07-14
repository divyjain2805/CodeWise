import axios from "axios";

const api = axios.create({
  // Use Vite proxy (see `vite.config.js`) so cookies work reliably.
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
