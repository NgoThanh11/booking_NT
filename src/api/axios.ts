import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5021/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 90000,
});

export default axiosClient;