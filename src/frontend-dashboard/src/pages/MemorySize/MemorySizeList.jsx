import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";

function MemorySizeList() {
    const [memorySizes, setMemorySizes] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemorySizes = async () => {
            try {
                const response = await axiosAppJson.get("/memorysizes");
                setMemorySizes(response.data);
            } catch (err) {
                // setError("Lỗi khi tải kích thước bộ nhớ");
                console.error(err);
            } finally {
                // setLoading(false);
            }
        };        

        const fetchCategories = async () => {
            try {
                const response = await axiosAppJson.get("/categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
            }
        };

        fetchCategories();
        fetchMemorySizes();
    }, []);

    const handleDelete = async (memorySizeID) => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa kích thước bộ nhớ này không?"
            )
        ) {
            try {
                await axiosAppJson.delete(`/memorysizes/${memorySizeID}`);
                setMemorySizes(
                    memorySizes.filter(
                        (size) => size.MemorySizeID !== memorySizeID
                    )
                );
            } catch (err) {
                console.error("Lỗi khi xóa kích thước bộ nhớ:", err);
            }
        }
    };

    // if (loading) return <div>Đang tải...</div>;
    // if (error) return <div>{error}</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Danh sách kích thước bộ nhớ
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Quản lý các kích thước bộ nhớ trong hệ thống
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="/admin/memorysizes/create"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Thêm kích thước bộ nhớ
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Kích thước
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Danh mục
                                        </th>
                                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {memorySizes.map((size) => (
                                        <tr key={size.MemorySizeID}>
                                            <td className="px-3 py-4 text-sm font-medium text-gray-900">
                                                {size.MemorySize}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                            {categories.find(category => category.CategoryID === size.CategoryID)?.Name || "Không xác định"}
                                            </td>
                                            <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link
                                                    to={`/admin/memorysizes/edit/${size.MemorySizeID}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            size.MemorySizeID
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
            </div>
        </div>
    );
}

export default MemorySizeList;
