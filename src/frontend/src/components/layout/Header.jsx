import React from 'react';
import { Link } from 'react-router-dom';
import logo from '~/assets/images/logo.png';

function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-red-500">
            <img src={logo} alt="logo" className="h-8" />
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-red-500">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-red-500">
              Sản phẩm
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-red-500">
              Giỏ hàng
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-red-500">
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
