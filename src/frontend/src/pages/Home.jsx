import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Điện thoại', 'Laptop', 'Phụ kiện'].map((category) => (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/products/${item}`} className="block">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  {/* Product image placeholder */}
                  <div className="w-full h-48 bg-gray-200"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Sản phẩm {item}</h3>
                  <p className="text-red-500 font-semibold">1.999.000 ₫</p>
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