import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '~/assets/images/logo.png';
import { toast } from 'react-hot-toast';

function Header() {
  const { user, logout } = useAuth();

  console.log(user);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đăng xuất");
    }
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-red-500"
          >
            <img src={logo} alt="logo" className="h-8 mr-2" />
            NGHIASTORE
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
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.FullName || user?.fullName)}`}
                    alt="User avatar"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.FullName || user?.fullName}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-red-500">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
