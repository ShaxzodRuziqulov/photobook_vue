import axios from "axios";
import { createToastInterface } from "vue-toastification";

const toast = createToastInterface();

const localizeErrorMessage = (message: string): string => {
    const normalized = message.trim().toLowerCase();

    if (normalized.includes("processed_count increment cannot exceed remaining page_count")) {
        return "Kiritilgan son qoldiqdan oshib ketdi.";
    }

    if (normalized.includes("the username or password is incorrect")) {
        return "Login yoki parol xato.";
    }

    if (normalized.includes("network error")) {
        return "Server bilan bog'lanib bo'lmadi.";
    }

    if (normalized.includes("forbidden")) {
        return "Bu amal uchun ruxsat yo'q.";
    }

    if (normalized.includes("unauthorized")) {
        return "Tizimga qayta kiring.";
    }

    if (normalized.includes("not found")) {
        return "Ma'lumot topilmadi.";
    }

    if (normalized.includes("already exists")) {
        return "Bu ma'lumot allaqachon mavjud.";
    }

    if (normalized.includes("validation")) {
        return "Kiritilgan ma'lumotni tekshiring.";
    }

    return "Xatolik yuz berdi. Qayta urinib ko'ring.";
};

const extractErrorMessage = (error: any): string => {
    const data = error?.response?.data;

    if (Array.isArray(data?.errors?.request) && data.errors.request.length) {
        return localizeErrorMessage(String(data.errors.request[0]));
    }

    if (typeof data?.message === "string" && data.message.trim()) {
        return localizeErrorMessage(data.message);
    }

    if (typeof data?.description === "string" && data.description.trim()) {
        return localizeErrorMessage(data.description);
    }

    return "Xatolik yuz berdi. Qayta urinib ko'ring.";
};

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
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem("access_token");
            if (!window.location.pathname.startsWith("/login")) {
                window.location.assign("/login");
            }
            return Promise.reject(error);
        }

        if (error.response) {
            toast.error(extractErrorMessage(error));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
