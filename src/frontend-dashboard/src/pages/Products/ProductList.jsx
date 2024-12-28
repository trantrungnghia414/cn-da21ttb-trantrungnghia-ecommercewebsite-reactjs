import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { axiosAppJson } from "~/config/axios.config";

function ProductList() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axiosAppJson.get("/products");
            // console.log("Dữ liệu sản phẩm nhận được:", response.data);
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (slug) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?"))
            return;

        try {
            // Kiểm tra sản phẩm tồn tại
            await axiosAppJson.get(`/products/${slug}`);

            // Nếu sản phẩm tồn tại, thực hiện xóa
            await axiosAppJson.delete(`/products/${slug}`);

            // Cập nhật lại danh sách sản phẩm sau khi xóa
            fetchProducts();
        } catch (error) {
            console.error(
                "Lỗi khi xóa sản phẩm:",
                error.response ? error.response.data : error.message
            );
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Sản phẩm
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Danh sách tất cả sản phẩm trong cửa hàng
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        to="/admin/products/create"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
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
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                            Tên sản phẩm
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Danh mục
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Thương hiệu
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Nhà cung cấp
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Chi tiết
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Hoạt động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products.map((product) => (
                                        <tr key={product.ProductID}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                                {product.Name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {product.category?.Name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {product.brand?.Name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {product.supplier?.Name}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                <Link
                                                    to={`/admin/products/detail/${product.Slug}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <Link
                                                    to={`/admin/products/edit/${product.Slug}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.Slug
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

export default ProductList;
