import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '~/utils/format';

const PRODUCTS_PER_PAGE = 12;

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosClient.get('/products'),
          axiosClient.get('/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const selectedProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between text-center mb-12 bg-gradient-to-r bg-red-600 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-500">
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

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          Danh mục nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.CategoryID}
              className="bg-white p-6 rounded-lg shadow-2xl transform hover:scale-105 transition duration-500"
            >
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                {category.Name}
              </h3>
              <Link
                to={`/products?category=${category.CategoryID}`}
                className="text-red-500 hover:text-red-600"
              >
                Xem thêm →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          Sản phẩm nổi bật
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {selectedProducts.map((product) => (
              <div
                key={product.ProductID}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:scale-105"
              >
                <Link to={`/products/${product.Slug}`} className="block">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 py-4">
                    <img
                      src={product.Thumbnail}
                      alt={product.Name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        // e.target.src = '/default-product.jpg';
                      }}
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
                      title={product.Name}
                    >
                      {product.Name}
                    </h3>
                    <p className="text-red-600 font-semibold">
                        {formatCurrency(product.variants && product.variants[0]?.Price)}
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
        ) : (
          <div className="text-center text-gray-500">Không có sản phẩm nào</div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
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
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
    </div>
  );
}

export default Home;
