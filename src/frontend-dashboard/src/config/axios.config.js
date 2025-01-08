import axios from "axios";
import { toast } from "react-hot-toast";

// Tạo axios instance cho các request JSON (để gửi dữ liệu dạng JSON)
const axiosAppJson = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API || "http://localhost:5000",
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Tạo axios instance cho các request dạng form-data
const axiosFromData = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API || "http://localhost:5000",
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-type": "multipart/form-data",
        Accept: "application/json",
    },
});

// Request interceptor cho các request JSON (để gửi dữ liệu dạng JSON)
axiosAppJson.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor cho các request JSON
axiosAppJson.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Bỏ qua việc hiển thị thông báo cho route đăng nhập
        if (originalRequest.url === "/api/auth/login") {
            return Promise.reject(error);
        }

        // Nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
        if (
            (error.response?.status === 401 ||
                error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            // Xóa token cũ
            localStorage.removeItem("token");

            // Chuyển về trang login
            window.location.href = "/";

            // Hiển thị thông báo
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        }
        return Promise.reject(error);
    }
);
export { axiosAppJson, axiosFromData };
