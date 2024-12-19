import { useState } from 'react';
import { Link } from 'react-router-dom';

function OrderList() {
  // Dữ liệu mẫu
  const [orders] = useState([
    {
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
      }
    },
    {
      OrderID: 2,
      UserID: 2,
      OrderDate: '2024-03-20T09:15:00',
      TotalAmount: 24990000,
      ShippingAddress: '456 Lê Văn Việt, Q.9, TP.HCM',
      OrderStatus: 'Shipped',
      PaymentMethod: 'Banking',
      PaymentStatus: 'Paid',
      user: {
        FullName: 'Trần Thị B',
        Email: 'tranthib@gmail.com',
        Phone: '0987654321'
      }
    },
    {
      OrderID: 3,
      UserID: 3,
      OrderDate: '2024-03-20T10:00:00',
      TotalAmount: 44980000,
      ShippingAddress: '789 Võ Văn Ngân, TP.Thủ Đức, TP.HCM',
      OrderStatus: 'Delivered',
      PaymentMethod: 'Banking',
      PaymentStatus: 'Paid',
      user: {
        FullName: 'Phạm Văn C',
        Email: 'phamvanc@gmail.com',
        Phone: '0369852147'
      }
    }
  ]);

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Danh sách đơn hàng</h1>
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
                      <span className="sr-only">Actions</span>
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
                        <div className="text-sm text-gray-900">{order.user.FullName}</div>
                        <div className="text-sm text-gray-500">{order.user.Email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(order.OrderDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(order.TotalAmount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.OrderStatus)}`}>
                          {order.OrderStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPaymentStatusColor(order.PaymentStatus)}`}>
                          {order.PaymentStatus}
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
