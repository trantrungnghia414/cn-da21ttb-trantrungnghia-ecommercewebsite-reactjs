import { useState } from "react";
import { Link } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";

function Header() {
    const [notifications] = useState([
        { id: 1, message: "Đơn hàng mới #1234", time: "5 phút trước" },
        {
            id: 2,
            message: "Đơn hàng #1233 đã hoàn thành",
            time: "10 phút trước",
        },
    ]);

    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Dashboard
                </h2>

                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            <BellIcon className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                                {notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => {/* Xử lý click thông báo */}}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <p className="font-medium">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {notification.time}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Admin Profile */}
                    <div className="flex items-center">
                        <img
                            className="h-8 w-8 rounded-full"
                            src="https://ui-avatars.com/api/?name=Admin"
                            alt="Admin avatar"
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">
                                Admin
                            </p>
                            <Link
                                to="/logout"
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Đăng xuất
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
