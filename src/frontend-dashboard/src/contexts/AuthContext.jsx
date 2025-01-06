import { createContext, useContext, useState, useEffect } from "react";
import { axiosAppJson } from "../config/axios.config";
// import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let interval;
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

                console.log(response.data.data.user);

                if (
                    response.data.data.user &&
                    response.data.data.user.Role === "Admin"
                ) {
                    setUser(response.data.data.user);
                }
            } catch (error) {
                console.error("Check auth error:", error);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();

        interval = setInterval(checkAuth, 24 * 60 * 60 * 1000); // Thời gian sống của token 1 ngày
        return () => clearInterval(interval);

    }, []);

    const login = (userData) => {
        setUser(userData);
    };

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
