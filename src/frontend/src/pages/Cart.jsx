import React from 'react';
import { Link } from 'react-router-dom';

function Cart() {
  // Giả lập dữ liệu giỏ hàng
  const cartItems = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      price: 28990000,
      quantity: 1,
      image: 'https://placeholder.com/300'
    },
    {
      id: 2, 
      name: 'MacBook Air M1',
      price: 24990000,
      quantity: 1,
      image: 'https://placeholder.com/300'
    }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link
            to="/products"
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  <p className="text-red-500 font-semibold">
                    {item.price.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 bg-gray-100 rounded-full">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button className="w-8 h-8 bg-gray-100 rounded-full">+</button>
                </div>
                <button className="text-gray-500 hover:text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Tổng kết đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tổng đơn hàng</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{total.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">0 ₫</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-semibold">Tổng cộng</span>
                    <span className="text-red-500 font-bold">
                      {total.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-red-500 text-white text-center px-6 py-3 rounded-md hover:bg-red-600"
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
