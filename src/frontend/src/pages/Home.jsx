import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// TẠO MẢNG CATEGORY
const categories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Đồng hồ'];

// TẠO MẢNG SẢN PHẨM
const products = [
  {
    id: 1,
    name: 'iPhone 13 Pro Max',
    price: 29990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 2,
    name: 'MacBook Air M1',
    price: 24990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 3, 
    name: 'Apple Watch Series 6',
    price: 14990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 4,
    name: 'AirPods Pro',
    price: 5990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 5,
    name: 'Samsung Galaxy S21 Ultra',
    price: 23990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 6,
    name: 'Dell XPS 13',
    price: 29990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 7,
    name: 'Samsung Galaxy Watch 4',
    price: 6990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 8,
    name: 'Samsung Galaxy Buds Pro',
    price: 3990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 9,
    name: 'Xiaomi Mi 11',
    price: 14990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'
  },
  {
    id: 10,
    name: 'Asus ZenBook 14',
    price: 19990000,
    image: 'https://itnstore.com/thumbs/385x385x2/upload/product/iphone-16-pro-max-titan-trang-8658.png'  
  }
]

// TẠO MẢNG LƯU ẢNH SLIDER
const sliders = [
  'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/37/9c/379c328de0184e890066dba008949506.png',
  'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/f4/9a/f49a3abfff8a02249001d4d0d6c9bb91.png',
  'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e7/57/e757e38ba37740d9812b7a0af7909e52.jpg',
  'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b7/e0/b7e05e63dcacde4d2a8e76d2f03e61cd.png',
]

function Home() {
  const [currentSlider, setCurrentSlider] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlider((prevBanner) => (prevBanner + 1) % sliders.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Slider Section */}
      <section className="mb-12">
        <div className="relative w-full overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlider * 100}%)` }}>
            {sliders.map((banner, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img src={banner} alt={`Banner ${index + 1}`} className="w-full object-cover" />
              </div>
            ))}
            {sliders.map((banner, index) => (
              <div key={index + sliders.length} className="w-full flex-shrink-0">
                <img src={banner} alt={`Banner ${index + 1}`} className="w-full object-cover" />
              </div>
            ))}
          </div>
          {/* Thêm các nút điều hướng hoặc chỉ báo nếu cần */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700" onClick={() => setCurrentSlider((prevBanner) => (prevBanner - 1 + sliders.length) % sliders.length)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700" onClick={() => setCurrentSlider((prevBanner) => (prevBanner + 1) % sliders.length)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Chào mừng đến với cửa hàng của chúng tôi
        </h1>
        <p className="text-gray-600 mb-6">
          Khám phá bộ sưu tập sản phẩm đa dạng và chất lượng
        </p>
        <Link
          to="/products"
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
        >
          Xem sản phẩm
        </Link>
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Danh mục nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-medium text-gray-800 mb-2">{category}</h3>
              <Link to="/products" className="text-red-500 hover:text-red-600">
                Xem thêm →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full  object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-red-500 font-semibold">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </p>
                  <button 
                    className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic here
                    }}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;