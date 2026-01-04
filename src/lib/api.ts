import axios from "axios";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        Cookies.remove("TOKEN");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
