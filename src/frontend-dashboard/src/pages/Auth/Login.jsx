import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { axiosAppJson } from "../../config/axios.config";
import logo from "../../assets/images/logo.png";

// Đăng nhập tài khoản quản trị
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.Role === "Admin") {
            navigate("/admin");
        }
    }, [user, navigate]);

    // Xử lý đăng nhập
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosAppJson.post("/api/auth/login", {
                Email: formData.email,
                Password: formData.password,
            });

            console.log("Response data:", response.data); // Debug

            // Kiểm tra role Admin (phải dùng role thường vì server trả về role)
            if (response.data.user.role !== "Admin") {
                toast.error("Bạn không có quyền truy cập trang quản trị");
                return;
            }

            // Chuyển đổi role thành Role trước khi lưu vào context
            const userData = {
                ...response.data.user,
                Role: response.data.user.role, // Chuyển đổi key từ role sang Role
            };

            // Lưu token và thông tin user
            localStorage.setItem("token", response.data.token);
            await login(userData);
            toast.success("Đăng nhập thành công!");
            navigate("/admin");
        } catch (error) {
            // Xóa token nếu có lỗi
            localStorage.removeItem("token");

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.code === "ECONNABORTED") {
                toast.error(
                    "Không thể kết nối đến server. Vui lòng thử lại sau."
                );
            } else {
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
                <div className="text-center">
                    <img
                        className="mx-auto h-16 w-auto"
                        src={logo}
                        alt="Logo"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Đăng nhập quản trị
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Vui lòng đăng nhập để tiếp tục
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nhập email của bạn"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nhập mật khẩu của bạn"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Nghia Store Admin
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
