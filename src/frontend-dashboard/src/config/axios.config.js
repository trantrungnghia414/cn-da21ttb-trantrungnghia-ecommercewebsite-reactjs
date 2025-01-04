import axios from "axios";

// Tạo axios instance cho các request JSON (để gửi dữ liệu dạng JSON)
const axiosAppJson = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API || "http://localhost:5000",
    timeout: 30000,
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

// Response interceptor cho các request JSON (để kiểm tra token và quyền truy cập)
axiosAppJson.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axiosAppJson.get("/api/auth/check");
                if (response.data.user && response.data.user.role === "Admin") {
                    return axiosAppJson(originalRequest);
                } else {
                    localStorage.removeItem("token");
                    // window.location.href = "/";
                }
            } catch (refreshError) {
                localStorage.removeItem("token");
                // window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export { axiosAppJson, axiosFromData };
