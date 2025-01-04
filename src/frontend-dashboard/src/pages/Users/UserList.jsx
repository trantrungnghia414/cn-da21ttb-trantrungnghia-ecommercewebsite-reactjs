import { useState, useEffect } from "react";
import { axiosAppJson } from "../../config/axios.config";
import { toast } from "react-toastify";

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosAppJson.get("/api/users");
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Không thể tải danh sách người dùng");
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        try {
            await axiosAppJson.patch(`/api/users/${userId}/status`, {
                status: currentStatus === "active" ? "inactive" : "active",
            });

            setUsers(
                users.map((user) =>
                    user.UserID === userId
                        ? {
                              ...user,
                              Status:
                                  currentStatus === "active"
                                      ? "inactive"
                                      : "active",
                          }
                        : user
                )
            );

            toast.success(
                `Đã ${
                    currentStatus === "active" ? "khóa" : "mở khóa"
                } tài khoản người dùng`
            );
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái người dùng");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Danh sách người dùng
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Quản lý tất cả người dùng trong hệ thống
                    </p>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                            Họ tên
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Vai trò
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Trạng thái
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Ngày tạo
                                        </th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user) => (
                                        <tr key={user.UserID}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                {user.FullName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {user.Email}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {user.Role}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        user.Status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {user.Status === "active"
                                                        ? "Hoạt động"
                                                        : "Đã khóa"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    user.CreatedAt
                                                ).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {user.Role !== "Admin" && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                user.UserID,
                                                                user.Status
                                                            )
                                                        }
                                                        className={`${
                                                            user.Status ===
                                                            "active"
                                                                ? "text-red-600 hover:text-red-900"
                                                                : "text-green-600 hover:text-green-900"
                                                        }`}
                                                    >
                                                        {user.Status ===
                                                        "active"
                                                            ? "Khóa"
                                                            : "Mở khóa"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserList;
