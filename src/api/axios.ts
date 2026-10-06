import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5021/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 90000,
});
// REQUEST: Gắn JWT vào request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);


// RESPONSE: Bắt lỗi 401

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Tránh redirect nếu đang ở trang login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
export default axiosClient;
