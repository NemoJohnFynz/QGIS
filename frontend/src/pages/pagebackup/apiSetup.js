import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001", // Backend server
  withCredentials: true, // Nếu bạn dùng cookie/session
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
