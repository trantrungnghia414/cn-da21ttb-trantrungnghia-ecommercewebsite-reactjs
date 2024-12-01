import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Products() {
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tất cả sản phẩm</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <select 
              className="border rounded-md px-3 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Nổi bật</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
            <Link to={`/products/${item}`} className="block">
              <div className={`${viewMode === 'grid' ? 'aspect-w-1 aspect-h-1' : 'w-48'} bg-gray-200`}>
                {/* Product image placeholder */}
                <div className="w-full h-48 bg-gray-200"></div>
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Sản phẩm {item}</h3>
                <p className="text-red-500 font-semibold mb-4">1.999.000 ₫</p>
                <button 
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Trước</button>
          <button className="px-4 py-2 border rounded-md bg-red-500 text-white">1</button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">2</button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">3</button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Sau</button>
        </div>
      </div>
    </div>
  );
}

export default Products;