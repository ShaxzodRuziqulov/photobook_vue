import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API, // https://photobook-backend-production.up.railway.app
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            // localStorage.removeItem("access_token");
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;