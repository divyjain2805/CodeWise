import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Note: backend is running on port 3000
  withCredentials: true, // Send cookies with requests for auth
});

export default axiosInstance;
