import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosClient.get(`/api/orders/${orderId}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải thông tin đơn hàng');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipping: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      Pending: 'Chờ xử lý',
      Processing: 'Đang xử lý',
      Shipping: 'Đang vận chuyển',
      Delivered: 'Đã giao hàng',
      Cancelled: 'Đã hủy',
    };
    return statusTexts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Không tìm thấy đơn hàng
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Theo dõi đơn hàng #{order.OrderID}
          </h1>

          {/* Trạng thái đơn hàng */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Trạng thái đơn hàng:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.OrderStatus,
                )}`}
              >
                {getStatusText(order.OrderStatus)}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200"></div>
              <div className="space-y-8">
                {['Pending', 'Processing', 'Shipping', 'Delivered'].map(
                  (status, index) => (
                    <div
                      key={status}
                      className={`flex items-center ${
                        index % 2 === 0 ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-1/2 ${
                          index % 2 === 0 ? 'text-right pr-8' : 'pl-8'
                        }`}
                      >
                        <div
                          className={`inline-flex items-center ${
                            order.OrderStatus === status
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-500'
                          }`}
                        >
                          {getStatusText(status)}
                        </div>
                      </div>
                      <div
                        className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                          order.OrderStatus === status
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300'
                        }`}
                      ></div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
            <div className="space-y-4">
              {order.OrderDetails.map((item) => (
                <div
                  key={item.OrderDetailID}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={
                      item.productVariant?.product?.Thumbnail
                        ? `${process.env.REACT_APP_DOMAIN_SERVER_API}/assets/image/products/${item.productVariant.product.Thumbnail}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={item.productVariant?.product?.Name || 'Sản phẩm'}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.productVariant?.product?.Name ||
                        'Sản phẩm không còn tồn tại'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.productVariant?.memorySize?.MemorySize} -{' '}
                      {item.productVariant?.color?.ColorName}
                    </p>
                    <p className="text-sm">
                      {formatCurrency(item.Price)} x {item.Quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng cộng */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>
                  {formatCurrency(order.TotalAmount - order.ShippingFee)}
                </span>
              </div>
              {order.DiscountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>- {formatCurrency(order.DiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(order.ShippingFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900 pt-2 border-t">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.TotalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div className="border-t mt-6 pt-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Địa chỉ:</p>
                <p>
                  {order.ShippingAddress}, {order.WardName},{' '}
                  {order.DistrictName}, {order.ProvinceName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Số điện thoại:</p>
                <p>{order.ShippingPhone}</p>
              </div>
              {order.ShippingCode && (
                <div>
                  <p className="text-gray-600">Mã vận đơn:</p>
                  <p>{order.ShippingCode}</p>
                </div>
              )}
              {order.ExpectedDeliveryTime && (
                <div>
                  <p className="text-gray-600">Dự kiến giao hàng:</p>
                  <p>
                    {new Date(order.ExpectedDeliveryTime).toLocaleDateString(
                      'vi-VN',
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
