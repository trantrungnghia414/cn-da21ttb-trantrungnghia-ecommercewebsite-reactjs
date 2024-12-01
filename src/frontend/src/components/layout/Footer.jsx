import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
            <p className="text-gray-400">
              Chúng tôi cung cấp các sản phẩm chất lượng cao với giá cả hợp lý.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Trang chủ</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Sản phẩm</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white">Giỏ hàng</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Địa chỉ: 126 Nguyễn Thiện Thành, Phường 5, Trà Vinh, Việt Nam</li>
              <li>Email: trungnghia@gmail.com</li>
              <li>Điện thoại: (84) 929039414</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 N Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
