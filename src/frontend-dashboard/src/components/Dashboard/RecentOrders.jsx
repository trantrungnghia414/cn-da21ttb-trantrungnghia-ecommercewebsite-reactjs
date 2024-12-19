import { useState } from 'react';
import { Link } from 'react-router-dom';

function RecentOrders() {
  // Dữ liệu mẫu dựa trên cấu trúc bảng orders và orderdetails
  const [orders] = useState([
    {
      OrderID: 1,
      UserID: 1,
      OrderDate: '2024-03-20T08:30:00',
      TotalAmount: 32990000,
      ShippingAddress: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      OrderStatus: 'Pending',
      user: {
        FullName: 'Nguyễn Văn A',
        Email: 'nguyenvana@gmail.com'
      },
      orderDetails: [
        {
          ProductName: 'iPhone 15 Pro Max',
          Quantity: 1,
          Price: 32990000
        }
      ]
    },
    {
      OrderID: 2,
      UserID: 2,
      OrderDate: '2024-03-20T09:15:00',
      TotalAmount: 24990000,
      ShippingAddress: '456 Lê Văn Việt, Q.9, TP.HCM',
      OrderStatus: 'Shipped',
      user: {
        FullName: 'Trần Thị B',
        Email: 'tranthib@gmail.com'
      },
      orderDetails: [
        {
          ProductName: 'MacBook Air M1',
          Quantity: 1,
          Price: 24990000
        }
      ]
    },
    {
      OrderID: 3,
      UserID: 3,
      OrderDate: '2024-03-20T10:00:00',
      TotalAmount: 44980000,
      ShippingAddress: '789 Võ Văn Ngân, TP.Thủ Đức, TP.HCM',
      OrderStatus: 'Delivered',
      user: {
        FullName: 'Phạm Văn C',
        Email: 'phamvanc@gmail.com'
      },
      orderDetails: [
        {
          ProductName: 'iPhone 15',
          Quantity: 2,
          Price: 22490000
        }
      ]
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã đơn hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khách hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tổng tiền
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.OrderID}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.OrderID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.user.FullName}</div>
                <div className="text-sm text-gray-500">{order.user.Email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {order.orderDetails[0].ProductName}
                </div>
                <div className="text-sm text-gray-500">
                  Số lượng: {order.orderDetails[0].Quantity}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.TotalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.OrderStatus)}`}>
                  {order.OrderStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link to={`/admin/orders/${order.OrderID}`} className="text-blue-600 hover:text-blue-900">
                  Chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;
