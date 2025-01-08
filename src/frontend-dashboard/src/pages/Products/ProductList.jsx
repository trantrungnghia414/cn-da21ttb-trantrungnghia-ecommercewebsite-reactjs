import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        brand: "all",
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axiosAppJson.get("/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error);
        }
    };

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await axiosAppJson.get("/api/brands");
            setBrands(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await axiosAppJson.get("/api/products");
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            toast.error("Không thể tải danh sách sản phẩm");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    // Lọc sản phẩm
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.Name.toLowerCase().includes(
            filters.search.toLowerCase()
        );
        const matchesCategory =
            filters.category === "all" ||
            product.CategoryID === parseInt(filters.category);
        const matchesBrand =
            filters.brand === "all" ||
            product.BrandID === parseInt(filters.brand);
        return matchesSearch && matchesCategory && matchesBrand;
    });

    const handleDelete = async (slug) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?"))
            return;

        try {
            // Kiểm tra sản phẩm tồn tại
            await axiosAppJson.get(`/api/products/${slug}`);

            // Nếu sản phẩm tồn tại, thực hiện xóa
            await axiosAppJson.delete(`/api/products/${slug}`);

            // Thông báo thành công
            toast.success("Xóa sản phẩm thành công!");

            // Cập nhật lại danh sách sản phẩm sau khi xóa
            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            const errorMessage =
                error.response?.data?.error || "Có lỗi xảy ra khi xóa sản phẩm";
            toast.error(errorMessage);
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

            {/* Filters */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                {/* Search Filter */}
                <div className="col-span-2">
                    <label htmlFor="search" className="sr-only">
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FunnelIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={filters.search}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    search: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
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

                {/* Brand Filter */}
                <div>
                    <label htmlFor="brand" className="sr-only">
                        Thương hiệu
                    </label>
                    <select
                        id="brand"
                        name="brand"
                        className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-2"
                        value={filters.brand}
                        onChange={(e) =>
                            setFilters({ ...filters, brand: e.target.value })
                        }
                    >
                        <option value="all">Tất cả thương hiệu</option>
                        {brands.map((brand) => (
                            <option key={brand.BrandID} value={brand.BrandID}>
                                {brand.Name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table phần còn lại giữ nguyên */}
            {loading ? (
                <div className="mt-8 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" />
                </div>
            ) : (
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[4.5%]">
                                                Hình ảnh
                                            </th>
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
                                        {filteredProducts.map((product) => (
                                            <tr key={product.ProductID}>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-50">
                                                        <img
                                                            src={
                                                                product.Thumbnail
                                                            }
                                                            alt={product.Name}
                                                            className="h-full w-full object-contain"
                                                            onError={(e) => {
                                                                e.target.src =
                                                                    "/placeholder-image.png"; // Thay thế bằng ảnh placeholder của bạn
                                                                e.target.onerror =
                                                                    null;
                                                            }}
                                                        />
                                                    </div>
                                                </td>
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
            )}
        </div>
    );
}

export default ProductList;
