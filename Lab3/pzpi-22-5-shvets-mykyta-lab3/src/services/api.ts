// src/services/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7258/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default api;
