import axios from "axios";

const axiosAppJson = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API || "http://localhost:5000",
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const axiosFromData = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API || "http://localhost:5000",
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-type": "multipart/form-data",
        Accept: "application/json",
    },
});

// Thêm interceptor để log chi tiết hơn
axiosAppJson.interceptors.request.use(
    (config) => {
        console.log("Request:", config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosAppJson.interceptors.response.use(
    (response) => {
        console.log("Response:", response.status, response.data);
        return response;
    },
    (error) => {
        console.error("API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config,
        });
        return Promise.reject(error);
    }
);

export { axiosAppJson, axiosFromData };
