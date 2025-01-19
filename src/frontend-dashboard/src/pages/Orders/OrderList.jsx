import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosAppJson.get("/api/stats/orders");
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Không thể tải danh sách đơn hàng");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-4">Đang tải...</div>
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

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Danh sách đơn hàng
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Quản lý tất cả đơn hàng trong hệ thống
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
                                            Mã đơn hàng
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Khách hàng
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Ngày đặt
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Tổng tiền
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Trạng thái
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Thanh toán
                                        </th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {orders.map((order) => (
                                        <tr key={order.OrderID}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                #{order.OrderID}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {order.User?.FullName ||
                                                        "Không có tên"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.User?.Email ||
                                                        "Không có email"}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {format(
                                                    new Date(
                                                        order.OrderDate ||
                                                            order.createdAt
                                                    ),
                                                    "HH:mm - dd/MM/yyyy",
                                                    { locale: vi }
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                ).format(order.TotalAmount)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                                        order.OrderStatus
                                                    )}`}
                                                >
                                                    {getStatusText(order.OrderStatus)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPaymentStatusColor(
                                                        order.PaymentStatus
                                                    )}`}
                                                >
                                                    {getPaymentStatusText(order.PaymentStatus)}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link
                                                    to={`/admin/orders/${order.OrderID}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Chi tiết
                                                </Link>
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

export default OrderList;
