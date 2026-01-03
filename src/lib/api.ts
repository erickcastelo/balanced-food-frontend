import axios from "axios";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: "http://localhost:3000/",
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("TOKEN");

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
