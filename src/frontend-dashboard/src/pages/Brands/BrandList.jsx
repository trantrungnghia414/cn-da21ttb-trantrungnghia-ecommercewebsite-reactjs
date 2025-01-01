import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function BrandList() {
    const [brands, setBrands] = useState([]);

    const fetchBrands = async () => {
        try {
            console.log("Đang gọi API brands...");
            const response = await axiosAppJson.get("/api/brands");
            console.log("Response data:", response.data);
            setBrands(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
            toast.error("Lỗi khi tải danh sách thương hiệu");
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (slug) => {
        if (
            window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này không?")
        ) {
            try {
                await axiosAppJson.delete(`/api/brands/${slug}`);
                setBrands(brands.filter((brand) => brand.Slug !== slug));
                toast.success("Xóa thương hiệu thành công!");
            } catch (error) {
                console.error("Error deleting brand:", error);
                toast.error("Lỗi khi xóa thương hiệu!");
            }
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Thương hiệu
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Quản lý các thương hiệu sản phẩm trong hệ thống
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="/admin/brands/create"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon
                            className="-ml-1 mr-2 h-5 w-5"
                            aria-hidden="true"
                        />
                        Thêm thương hiệu
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
                                            Tên thương hiệu
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Mô tả
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Ngày tạo
                                        </th>
                                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {brands.map((brand) => (
                                        <tr key={brand.BrandID}>
                                            <td className="px-3 py-4 text-sm font-medium text-gray-900">
                                                {brand.Name}
                                            </td>
                                            <td className="w-[60%] px-3 py-4 text-sm text-gray-500">
                                                {brand.Description}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    brand.CreatedAt
                                                ).toLocaleDateString(
                                                    "vi-VN"
                                                )   }
                                            </td>
                                            <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link
                                                    to={`/admin/brands/edit/${brand.Slug}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(brand.Slug)
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

export default BrandList;
