import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import logo from '~/assets/images/logo.png';
import { toast } from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  console.log(user);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất',
      );
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
            {/* <Link
              to="/cart"
              className="text-gray-700 hover:text-red-500 flex items-center relative"
            >
              Giỏ hàng
              <FaShoppingCart className="h-5 w-5 ml-1" />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    <motion.span
                      key={cartItems.length}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {cartItems.length}
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link> */}
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/cart"
              className="text-gray-700 hover:text-red-500 flex items-center relative"
            >
              <FaShoppingCart className="h-5 w-5 ml-1" />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    <motion.span
                      key={cartItems.length}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {cartItems.length}
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Link
                    to="/profile"
                    className="flex items-center hover:opacity-80"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.FullName || user?.fullName,
                      )}`}
                      alt="User avatar"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.FullName || user?.fullName}
                      </p>
                      {/* <button
                        onClick={handleLogout}
                        className="text-xs text-gray-500 hover:text-red-500"
                      >
                        Đăng xuất
                      </button> */}
                    </div>
                  </Link>
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
