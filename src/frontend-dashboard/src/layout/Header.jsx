import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    console.log(user);

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Đăng xuất thành công!");
            navigate("/");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi đăng xuất");
        }
    };

    return (
        <header className="bg-white shadow">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <img
                            className="h-8 w-8 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user?.FullName || "Admin"
                            )}`}
                            alt="Admin avatar"
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">
                                {user?.FullName || "Admin"}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
