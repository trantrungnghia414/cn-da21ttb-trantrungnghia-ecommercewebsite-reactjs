import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { formatCurrency } from "~/config/format";
import "~/assets/styles/productDetail.css";

function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log("Fetching product with slug:", slug);
                const response = await axiosAppJson.get(
                    `/api/products/${slug}`
                );
                console.log("Product data:", response.data);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error(
                    "Error fetching product:",
                    error.response || error
                );
                setError(
                    error.response?.data?.message ||
                        "Không thể tải thông tin sản phẩm"
                );
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Chi tiết sản phẩm
                </h1>
                <Link
                    to="/admin/products"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Quay lại
                </Link>
            </div>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                {/* tên sản phẩm */}
                <div className="px-4 py-5 sm:px-6">
                    <p className="text-2xl font-bold">{product.Name}</p>
                </div>

                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Ảnh đại diện sản phẩm
                    </h3>
                    <div className="w-48 h-48 relative border rounded-lg overflow-hidden">
                        {product.Thumbnail ? (
                            <img
                                src={product.Thumbnail}
                                alt={`Thumbnail của ${product.Name}`}
                                className="w-full h-full p-2 object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                Không có ảnh
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Danh mục
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {product.category?.Name}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Thương hiệu
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {product.brand?.Name}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Nhà cung cấp
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {product.supplier?.Name}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Mô tả và Thông số kỹ thuật
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div
                                    className="prose prose-sm max-w-none description-content"
                                    dangerouslySetInnerHTML={{
                                        __html: product.Description,
                                    }}
                                />
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Biến thể sản phẩm
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    {product.variants?.map((variant, variantIndex) => (
                        <div
                            key={variant.VariantID}
                            className="border-b border-gray-200 last:border-b-0"
                        >
                            <div className="px-4 py-4 sm:px-6 bg-gray-50">
                                <h4 className="mb-2 text-md font-medium text-gray-900">
                                    Dung lượng:{" "}
                                    <span style={{ color: "red" }}>
                                        {variant.memorySize?.MemorySize}
                                    </span>
                                </h4>
                                <p className="font-semibold">
                                    Giá:{" "}
                                    <span style={{ color: "red" }}>
                                        {formatCurrency(variant.Price)}
                                    </span>
                                </p>
                            </div>
                            <div className="px-4 py-5 sm:px-6">
                                <h5 className="text-sm font-medium text-gray-900 mb-4">
                                    Màu sắc:
                                </h5>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                                    {variant.colors?.map((color) => (
                                        <div
                                            key={color.ColorID}
                                            className="border rounded-lg p-4 bg-slate-50"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            color.ColorCode,
                                                    }}
                                                ></div>
                                                <span className="text-sm font-medium">
                                                    {color.ColorName}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Số lượng: {color.Stock}
                                            </p>
                                            <div className="mt-4 grid grid-cols-10 gap-2">
                                                {color.images?.map((image) => (
                                                    <div
                                                        key={image.ImageID}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={
                                                                image?.ImageURL
                                                            }
                                                            alt={`${product.Name} - ${color.ColorName}`}
                                                            className="w-full h-full object-cover rounded bg-white p-2 border-[1px]"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
