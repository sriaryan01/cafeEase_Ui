import axios from "axios";
import { getToken } from "./user_service"; // Import the getToken function
import { useState, useEffect } from "react";

export const BASE_URL = "http://localhost:8081";
// export const BASE_URL = "https://additionally-regnant-caroyln.ngrok-free.dev";

export const myAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers
myAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["ngrok-skip-browser-warning"] = "true";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
