import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5021/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 90000,
});
// Thêm interceptor để đính kèm Token tự động
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosClient;