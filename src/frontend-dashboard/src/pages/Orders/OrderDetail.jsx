import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Dữ liệu mẫu
  const [order, setOrder] = useState({
    OrderID: 1,
    UserID: 1,
    OrderDate: '2024-03-20T08:30:00',
    TotalAmount: 32990000,
    ShippingAddress: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
    OrderStatus: 'Pending',
    PaymentMethod: 'COD',
    PaymentStatus: 'Unpaid',
    user: {
      FullName: 'Nguyễn Văn A',
      Email: 'nguyenvana@gmail.com',
      Phone: '0123456789'
    },
    orderDetails: [
      {
        ProductID: 1,
        ProductName: 'iPhone 15 Pro Max',
        ColorName: 'Titan Tự Nhiên',
        MemorySize: '256GB',
        Quantity: 1,
        Price: 32990000,
        Subtotal: 32990000
      }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    setOrder(prev => ({
      ...prev,
      OrderStatus: newStatus
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Chi tiết đơn hàng #{order.OrderID}
        </h1>
        <button
          onClick={() => navigate('/admin/orders')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Quay lại
        </button>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Thông tin đơn hàng
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Ngày đặt</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(order.OrderDate).toLocaleDateString('vi-VN')}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Tổng tiền</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.TotalAmount)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.OrderStatus)}`}>
                  {order.OrderStatus}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Thanh toán</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.PaymentStatus)}`}>
                  {order.PaymentStatus}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phương thức thanh toán</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.PaymentMethod}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.ShippingAddress}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Khách hàng</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="text-sm text-gray-900">{order.user.FullName}</div>
                <div className="text-sm text-gray-500">{order.user.Email}</div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Chi tiết đơn hàng */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Chi tiết đơn hàng
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Mã sản phẩm
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Tên sản phẩm
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Màu sắc
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Dung lượng
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Số lượng
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Đơn giá
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {order.orderDetails.map((detail) => (
                  <tr key={detail.ProductID}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      #{detail.ProductID}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="text-sm text-gray-900">{detail.ProductName}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {detail.ColorName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {detail.MemorySize}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {detail.Quantity}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(detail.Price)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(detail.Subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
