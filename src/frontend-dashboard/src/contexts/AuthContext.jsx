import { createContext, useContext, useState, useEffect } from "react";
import { axiosAppJson } from "../config/axios.config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

                console.log(response.data.data.user);

                if (
                    response.data.data.user &&
                    response.data.data.user.Role === "Admin"
                ) {
                    setUser(response.data.data.user);
                }
            } catch (error) {
                console.error("Check auth error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
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
