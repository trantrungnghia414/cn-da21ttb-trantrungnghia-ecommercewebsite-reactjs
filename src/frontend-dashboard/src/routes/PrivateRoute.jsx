import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        // Lưu lại URL hiện tại để sau khi đăng nhập xong quay lại
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (user.role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
