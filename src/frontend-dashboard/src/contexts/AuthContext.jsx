import { createContext, useContext, useState, useEffect } from "react";
import { axiosAppJson } from "../config/axios.config";
// import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userData) => {
        try {
            return new Promise((resolve) => {
                if (!userData) {
                    throw new Error("Dữ liệu người dùng không hợp lệ");
                }
                setUser(userData);
                resolve();
            });
        } catch (error) {
            console.error("Login error in AuthContext:", error);
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axiosAppJson.post("/api/auth/check", {
                    token,
                });

                if (
                    response.data.data.user &&
                    response.data.data.user.Role === "Admin"
                ) {
                    setUser(response.data.data.user);
                }
            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axiosAppJson.post("/api/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
