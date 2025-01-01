import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            console.log("Đang gọi API categories...");
            const response = await axiosAppJson.get("/api/categories");
            console.log("Response data:", response.data);
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error);
            toast.error("Lỗi khi tải danh sách danh mục");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (slug) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            try {
                await axiosAppJson.delete(`/api/categories/${slug}`);
                toast.success("Xóa danh mục thành công!");
                fetchCategories(); // Tải lại danh sách sau khi xóa
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
                toast.error(
                    error.response?.data?.error || "Lỗi khi xóa danh mục!"
                );
            }
        }
    };

    // Format date để hiển thị
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Danh mục sản phẩm
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Quản lý các danh mục sản phẩm trong hệ thống
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="/admin/categories/create"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon
                            className="-ml-1 mr-2 h-5 w-5"
                            aria-hidden="true"
                        />
                        Thêm danh mục
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                {loading ? (
                    <div className="text-center py-4">Đang tải...</div>
                ) : (
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Tên danh mục
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Mô tả
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Ngày tạo
                                            </th>
                                            <th className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900">
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {categories.map((category) => (
                                            <tr key={category.CategoryID}>
                                                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                    {category.Name}
                                                </td>
                                                <td className="w-[60%] px-3 py-4 text-sm text-gray-500">
                                                    {category.Description}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    {new Date(
                                                        category.CreatedAt
                                                    ).toLocaleDateString(
                                                        "vi-VN"     
                                                    )}
                                                </td>
                                                <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        to={`/admin/categories/edit/${category.Slug}`}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Sửa
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.Slug
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryList;
