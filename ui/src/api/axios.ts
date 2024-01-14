import axios from "axios";
import { routerString } from "../app/model/router";
const URL = import.meta.env.VITE_APP_BASE_URL;
const api = axios.create({
    baseURL: URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => {
  if(response.data) {
    return response.data;
  }
  return response
}, async (error) => {
    const status = await error.response?.status;
      if (status === 401) {
        window.open(`/#/${routerString.Forbidden}`, "_self")
      }
      return Promise.reject(error?.response?.data);
  }
);

export default api;