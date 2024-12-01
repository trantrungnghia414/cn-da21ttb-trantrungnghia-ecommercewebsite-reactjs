import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Mock product data - replace with actual API call
  const product = {
    id: id,
    name: 'iPhone 13 Pro Max',
    price: 29990000,
    description: 'Điện thoại iPhone 13 Pro Max với màn hình Super Retina XDR 6.7 inch, chip A15 Bionic mạnh mẽ và hệ thống camera chuyên nghiệp.',
    specs: [
      'Màn hình 6.7" Super Retina XDR',
      'Chip A15 Bionic',
      'RAM 6GB',
      'Bộ nhớ 128GB',
      'Camera sau 12MP',
      'Pin 4352 mAh'
    ]
  };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const addToCart = () => {
    // Implement add to cart functionality
    console.log(`Added ${quantity} of product ${id} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200">
            <div className="w-full h-96 bg-gray-200"></div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-2xl text-red-500 font-semibold mb-6">
            {product.price.toLocaleString('vi-VN')} ₫
          </p>
          
          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Số lượng:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded-md px-3 py-2 w-24"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 mb-6"
          >
            Thêm vào giỏ hàng
          </button>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông số kỹ thuật</h2>
            <ul className="space-y-2">
              {product.specs.map((spec, index) => (
                <li key={index} className="text-gray-600">• {spec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
