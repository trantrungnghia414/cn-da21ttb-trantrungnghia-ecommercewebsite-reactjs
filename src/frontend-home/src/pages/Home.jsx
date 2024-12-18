import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// TẠO MẢNG CATEGORY
const categories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Đồng hồ'];

// TẠO MẢNG SẢN PHẨM
const products = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    price: 32990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-sa-mac-thumb-600x600.jpg',
  },
  {
    id: 2,
    name: 'iPhone 16 Plus',
    price: 29990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/329138/iphone-16-plus-xanh-thumb-600x600.jpg',
  },
  {
    id: 3,
    name: 'iPhone 15 Plus',
    price: 27990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-xanh-thumb-600x600.jpg',
  },
  {
    id: 4,
    name: 'iPhone 12',
    price: 19990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-xanh-la-new-2-600x600.jpg',
  },
  {
    id: 5,
    name: 'iPhone 11',
    price: 14990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-11-trang-600x600.jpg',
  },
  {
    id: 6,
    name: 'iPhone 15',
    price: 24990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/281570/iphone-15-hong-thumb-1-600x600.jpg',
  },
  {
    id: 7,
    name: 'iPhone 14 Plus',
    price: 22990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-plus-thumb-xanh-600x600.jpg',
  },
  {
    id: 8,
    name: 'iPhone 13',
    price: 20990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-midnight-2-600x600.jpg',
  },
  {
    id: 9,
    name: 'Samsung Galaxy S24 Ultra',
    price: 34990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
  },
  {
    id: 10,
    name: 'Samsung Galaxy Z Fold 6',
    price: 41990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-thumbn-600x600.jpg',
  },
  {
    id: 11,
    name: 'Samsung Galaxy Z Flip 6',
    price: 24990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-z-flip6-xam-thumbn-600x600.jpg',
  },
  {
    id: 12,
    name: 'Samsung Galaxy S24 Plus',
    price: 29990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/307172/samsung-galaxy-s24-plus-violet-thumbnew-600x600.jpg',
  },
  {
    id: 13,
    name: 'Samsung Galaxy S24',
    price: 27990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/319665/samsung-galaxy-s24-yellow-thumbnew-600x600.jpg',
  },
  {
    id: 14,
    name: 'Samsung Galaxy S24 FE',
    price: 25990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/322789/samsung-galaxy-s24-fe-mint-thumb-1-600x600.jpg',
  },
  {
    id: 15,
    name: 'Samsung Galaxy A55 5G',
    price: 15990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-1-600x600.jpg',
  },
  {
    id: 16,
    name: 'Samsung Galaxy S23 FE',
    price: 19990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/306994/samsung-galaxy-s23-fe-mint-thumbnew-600x600.jpg',
  },
  {
    id: 17,
    name: 'Asus FA401WV',
    price: 32990000,
    image: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/329856/asus-fa401wv-r9-ai-hx-370-rg061ws-thumb-638621792123167604-600x600.jpg',
  },
  {
    id: 18,
    name: 'Asus UX5406SA',
    price: 29990000,
    image: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/330579/asus-ux5406sa-ultra-7-pv140ws-thumb-638633337721625951-600x600.jpg',
  },
  {
    id: 19,
    name: 'Asus ZenBook 14 OLED',
    price: 27990000,
    image: 'https://cdn.tgdd.vn/Products/Images/44/324821/asus-zenbook-14-oled-ux3405ma-ultra-9-pp475w-thumb-600x600.jpg',
  },
  {
    id: 20,
    name: 'Asus S5507QA',
    price: 25990000,
    image: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/331749/asus-s5507qa-x1e-78-100-ma090ws-thumb-638666583407420969-600x600.jpg',
  },
  {
    id: 21,
    name: 'Asus FA507UV',
    price: 23990000,
    image: 'https://cdn.tgdd.vn/Products/Images/44/327897/asus-fa507uv-r7-lp142w-thumb-600x600.jpg',
  },
  {
    id: 22,
    name: 'Asus VivoBook S 16 OLED',
    price: 21990000,
    image: 'https://cdn.tgdd.vn/Products/Images/44/325479/asus-vivobook-s-16-oled-s5606ma-ultra-5-mx050w-thumb-600x600.jpg',
  },
  {
    id: 23,
    name: 'Asus VivoBook 14X OLED',
    price: 19990000,
    image: 'https://cdn.tgdd.vn/Products/Images/44/311117/asus-vivobook-14x-oled-k3405vc-i5-km006w-glr-thumb-600x600.jpg',
  },
  {
    id: 24,
    name: 'Asus TUF Gaming FX517ZE',
    price: 17990000,
    image: 'https://cdn.tgdd.vn/Products/Images/44/284343/asus-tuf-gaming-fx517ze-i5-hn045w-thumb-600x600.jpg',
  },
  {
    id: 25,
    name: 'Apple Watch Ultra 2',
    price: 19990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/329719/apple-watch-ultra-2-gps-cellular-49mm-vien-titanium-day-alpine-xanh-den-600x600.png',
  },
  {
    id: 26,
    name: 'Apple Watch Series 10 LTE',
    price: 14990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/329159/apple-watch-s10-lte-42mm-vien-titanium-day-thep-thumb-1-600x600.jpg',
  },
  {
    id: 27,
    name: 'Apple Watch Ultra LTE',
    price: 12990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/314714/apple-watch-ultra-lte-49mm-vien-titanium-day-trail-xanh-tb-600x600.jpg',
  },
  {
    id: 28,
    name: 'Apple Watch Series 10 LTE',
    price: 11990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/330051/apple-watch-s10-lte-vien-titanium-den-day-the-thao-tb-600x600.jpg',
  },
  {
    id: 29,
    name: 'Apple Watch Series 10 LTE',
    price: 10990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/329156/apple-watch-s10-lte-day-silicone-bac-tb-600x600.jpg',
  },
  {
    id: 30,
    name: 'Apple Watch Series 10 LTE',
    price: 9990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/329708/apple-watch-s10-lte-day-vai-den-bong-tb-600x600.jpg',
  },
  {
    id: 31,
    name: 'Apple Watch Series 10',
    price: 8990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/329704/apple-watch-s10-day-vai-vang-hong-tb-600x600.jpg',
  },
  {
    id: 32,
    name: 'Apple Watch Series 9',
    price: 7990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/316002/apple-watch-s9-vien-nhom-day-the-thao-den-tb-600x600.jpg',
  },
  {
    id: 33,
    name: 'Apple Watch SE LTE 2023',
    price: 6990000,
    image: 'https://cdn.tgdd.vn/Products/Images/7077/316011/apple-watch-se-lte-2023-vien-nhom-day-vai-bac-tb-600x600.jpg',
  },
];

const PRODUCTS_PER_PAGE = 12; // 2 rows of 6 products each

function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const selectedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between text-center mb-12 bg-gradient-to-r from-red-500 to-red-700 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-500">
        <div className="md:w-full mb-6 md:mb-0">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Chào mừng đến với cửa hàng của chúng tôi
          </h1>
          <p className="text-white mb-6">
            Khám phá bộ sưu tập sản phẩm đa dạng và chất lượng
          </p>
          <Link
            to="/products"
            className="bg-white text-red-500 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Xem sản phẩm
          </Link>
        </div>
      </section>

      {/* Feature Category */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          Danh mục nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-white p-6 rounded-lg shadow-2xl transform hover:scale-105 transition duration-500"
            >
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                {category}
              </h3>
              <Link to="/products" className="text-red-500 hover:text-red-600">
                Xem thêm →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          Sản phẩm nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:scale-105"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 p-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="text-lg font-medium text-gray-900 mb-2"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <p className="text-red-600 font-semibold">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </p>
                  <button
                    className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <section>
          <nav className="flex justify-center items-center mt-8 space-x-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-l-lg hover:bg-red-600 transition duration-300"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  currentPage === index + 1
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-red-500 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-r-lg hover:bg-red-600 transition duration-300"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Trang sau
            </button>
          </nav>
        </section>
      )}

      {/* Back to Top Button */}
      <section>
        <button
          className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition duration-300"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
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
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </section>
    </div>
  );
}

export default Home;
