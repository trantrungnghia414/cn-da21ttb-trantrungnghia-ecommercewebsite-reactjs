import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await axiosAppJson.get(`/api/orders/${id}`);
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order:", error);
                setError("Không thể tải thông tin đơn hàng");
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    //get user profile có id là order.UserID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (order?.UserID) {
                    const response = await axiosAppJson.get(
                        `/api/users/${order.UserID}`
                    );
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [order?.UserID]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20";
            case "processing":
                return "bg-blue-100 text-blue-800 ring-1 ring-blue-600/20";
            case "shipping":
                return "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-600/20";
            case "delivered":
                return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20";
            case "cancelled":
                return "bg-rose-100 text-rose-800 ring-1 ring-rose-600/20";
            default:
                return "bg-gray-100 text-gray-800 ring-1 ring-gray-600/20";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20";
            case "processing":
                return "bg-amber-100 text-amber-800 ring-1 ring-amber-600/20";
            case "failed":
                return "bg-rose-100 text-rose-800 ring-1 ring-rose-600/20";
            case "unpaid":
                return "bg-gray-100 text-gray-800 ring-1 ring-gray-600/20";
            case "pending":
                return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20";
            default:
                return "bg-gray-100 text-gray-800 ring-1 ring-gray-600/20";
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: "Chờ xử lý",
            processing: "Đang xử lý",
            shipping: "Đang giao hàng",
            delivered: "Đã giao hàng",
            cancelled: "Đã hủy",
        };
        return statusMap[status?.toLowerCase()] || "Không xác định";
    };

    const getPaymentStatusText = (status) => {
        const statusMap = {
            pending: "Chờ thanh toán",
            processing: "Đang xử lý",
            completed: "Hoàn thành",
            failed: "Thất bại",
            unpaid: "Chưa thanh toán",
        };
        return statusMap[status?.toLowerCase()] || "Không xác định";
    };

    const handleStatusChange = async (newStatus) => {
        try {
            // Hiển thị confirm trước khi cập nhật
            const isConfirmed = window.confirm(
                "Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?"
            );

            if (!isConfirmed) return;

            // Gọi API cập nhật trạng thái
            await axiosAppJson.patch(`/api/orders/${id}/status`, {
                status: newStatus,
            });

            // Cập nhật state local
            setOrder((prev) => ({ ...prev, OrderStatus: newStatus }));

            toast.success("Cập nhật trạng thái đơn hàng thành công!");
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Không thể cập nhật trạng thái đơn hàng");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-red-500 text-center py-4">{error}</div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Chi tiết đơn hàng #{order.OrderID}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Đặt ngày{" "}
                        {new Date(order.OrderDate).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/orders")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Quay lại
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Thông tin đơn hàng */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Thông tin đơn hàng
                        </h3>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(
                                order.PaymentStatus
                            )}`}
                        >
                            {getPaymentStatusText(order.PaymentStatus)}
                        </span>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Phương thức thanh toán
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {order.PaymentMethod === "cod"
                                        ? "Thanh toán khi nhận hàng"
                                        : "Thanh toán online"}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Trạng thái đơn hàng
                                </dt>
                                <dd className="mt-1">
                                    <select
                                        value={order.OrderStatus}
                                        onChange={(e) =>
                                            handleStatusChange(e.target.value)
                                        }
                                        className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${getStatusColor(
                                            order.OrderStatus
                                        )}`}
                                    >
                                        <option value="Pending">
                                            Chờ xử lý
                                        </option>
                                        <option value="Processing">
                                            Đang xử lý
                                        </option>
                                        <option value="Shipping">
                                            Đang giao hàng
                                        </option>
                                        <option value="Delivered">
                                            Đã giao hàng
                                        </option>
                                        <option value="Cancelled">
                                            Đã hủy
                                        </option>
                                    </select>
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">
                                    Tổng tiền
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order.TotalAmount)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Thông tin khách hàng
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <UserIcon className="h-10 w-10 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.FullName || "Không có tên"}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                        {user?.Email || "Không có email"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                        {user?.PhoneNumber ||
                                            "Không có số điện thoại"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-start space-x-2">
                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    {order.ShippingAddress ||
                                        "Không có địa chỉ"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Chi tiết sản phẩm
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                        {order.OrderDetails?.map((item) => (
                            <li
                                key={item.OrderDetailID}
                                className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-20 h-20 relative">
                                        <img
                                            src={
                                                `http://localhost:5000/assets/image/products/${item.ProductVariant?.product?.Thumbnail}` ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt={
                                                item.ProductVariant?.product
                                                    ?.Name || "Không có tên"
                                            }
                                            className="absolute w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/150";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">
                                                {
                                                    item.ProductVariant?.product
                                                        ?.Name
                                                }
                                            </p>
                                            {/* <p className="text-sm font-medium text-gray-900">
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                ).format(item.Price)}
                                            </p> */}
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-sm text-gray-500">
                                                Phiên bản:{" "}
                                                {
                                                    item.ProductVariant
                                                        ?.memorySize?.MemorySize
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Màu sắc:{" "}
                                                {
                                                    item.ProductVariant?.color
                                                        ?.ColorName
                                                }
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Số lượng: {item.Quantity}
                                                </p>
                                                {/* <p className="text-sm font-medium text-gray-900">
                                                    Tổng:{" "}
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    ).format(
                                                        item.Quantity *
                                                            item.Price
                                                    )}
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
