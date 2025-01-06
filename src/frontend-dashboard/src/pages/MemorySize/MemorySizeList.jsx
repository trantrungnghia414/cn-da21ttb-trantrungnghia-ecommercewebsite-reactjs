import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function MemorySizeList() {
    const [memorySizes, setMemorySizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
    });
    const [categories, setCategories] = useState([]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axiosAppJson.get("/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error);
        }
    };

    // Fetch memory sizes
    const fetchMemorySizes = async () => {
        try {
            const response = await axiosAppJson.get("/api/memorysizes");
            setMemorySizes(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách dung lượng:", error);
            toast.error("Lỗi khi tải danh sách dung lượng");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemorySizes();
        fetchCategories();
    }, []);

    // Lọc dữ liệu
    const filteredMemorySizes = memorySizes.filter((memorySize) => {
        const matchesSearch = memorySize.MemorySize.toLowerCase().includes(
            filters.search.toLowerCase()
        );
        const matchesCategory =
            filters.category === "all" ||
            memorySize.CategoryID === parseInt(filters.category);
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dung lượng này không?")) {
            try {
                await axiosAppJson.delete(`/api/memorysizes/${id}`);
                toast.success("Xóa dung lượng thành công!");
                fetchMemorySizes();
            } catch (error) {
                console.error("Lỗi khi xóa dung lượng:", error);
                toast.error(
                    error.response?.data?.error || "Lỗi khi xóa dung lượng!"
                );
            }
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Danh sách dung lượng bộ nhớ
                    </h1>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="/admin/memorysizes/create"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Thêm dung lượng
                    </Link>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <div className="w-1/6">
                    <label htmlFor="category" className="sr-only">
                        Danh mục
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-2"
                        value={filters.category}
                        onChange={(e) =>
                            setFilters({ ...filters, category: e.target.value })
                        }
                    >
                        <option value="all">Tất cả danh mục</option>
                        {categories.map((category) => (
                            <option
                                key={category.CategoryID}
                                value={category.CategoryID}
                            >
                                {category.Name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="mt-8 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" />
                </div>
            ) : (
                <div className="mt-8 flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                Dung lượng
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Danh mục
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Ngày tạo
                                            </th>
                                            <th className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900">
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredMemorySizes.map(
                                            (memorySize) => (
                                                <tr
                                                    key={
                                                        memorySize.MemorySizeID
                                                    }
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {memorySize.MemorySize}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            memorySize.Category
                                                                ?.Name
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {new Date(
                                                            memorySize.CreatedAt
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <Link
                                                            to={`/admin/memorysizes/edit/${memorySize.MemorySizeID}`}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Sửa
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    memorySize.MemorySizeID
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemorySizeList;
