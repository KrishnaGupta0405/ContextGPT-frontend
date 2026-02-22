import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Adjust based on your environment
  withCredentials: true,
});

// Add a request interceptor (optional, e.g., for auth tokens)
api.interceptors.request.use(
  (config) => {
    console.log("Axios Request Debug:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL || ""}${config.url}`,
      headers: config.headers,
      data: config.data,
      params: config.params,
      withCredentials: config.withCredentials,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
