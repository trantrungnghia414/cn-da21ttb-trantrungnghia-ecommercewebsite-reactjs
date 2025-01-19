import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function OrderSuccess() {
  const { orderId } = useParams();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, []);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    navigate(`/order-tracking/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 flex justify-center">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: #{orderId}
        </p>
        <div className="space-y-4">
          <button
            onClick={handleViewOrder}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Theo dõi đơn hàng
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
