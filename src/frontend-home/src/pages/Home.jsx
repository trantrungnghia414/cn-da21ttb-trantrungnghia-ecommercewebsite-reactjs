import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '~/utils/format';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const PRODUCTS_PER_PAGE = 12;

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosClient.get('/api/products'),
          axiosClient.get('/api/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn chặn Link chuyển trang

    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    // Xử lý thêm vào giỏ hàng ở đây
    toast.success('Đã thêm vào giỏ hàng!');
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
              <Link to={`/products/${product.Slug}`} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative w-full">
                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                      <img
                        src={product.Thumbnail}
                        alt={product.Name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600">
                      {product.Name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-red-600 font-bold">
                        {formatCurrency(
                          product.variants?.length > 0
                            ? Math.min(...product.variants.map((v) => v.Price))
                            : 0,
                        )}
                      </p>
                      <span className="text-sm text-gray-500">
                        {product.variants?.[0]?.memorySize?.MemorySize}
                      </span>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </Link>
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
