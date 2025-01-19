import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '~/utils/format';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// const PRODUCTS_PER_PAGE = 12;

function Home() {
  // const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosClient.get('/api/products'),
          axiosClient.get('/api/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);

        // Organize products by category and sort by newest first
        const productsByCat = {};
        productsRes.data.forEach((product) => {
          if (!productsByCat[product.CategoryID]) {
            productsByCat[product.CategoryID] = [];
          }
          productsByCat[product.CategoryID].push(product);
        });

        // Sort products in each category by CreatedAt (newest first)
        Object.keys(productsByCat).forEach((categoryId) => {
          productsByCat[categoryId].sort(
            (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt),
          );
        });

        setProductsByCategory(productsByCat);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  // const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  // const selectedProducts = products.slice(
  //   startIndex,
  //   startIndex + PRODUCTS_PER_PAGE,
  // );

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handleAddToCart = async (product, e) => {
  //   e.preventDefault();

  //   if (!user) {
  //     toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
  //     navigate('/login');
  //     return;
  //   }

  //   // Kiểm tra variant và color có tồn tại không
  //   if (!product.variants || product.variants.length === 0) {
  //     toast.error('Sản phẩm không có phiên bản');
  //     return;
  //   }

  //   const firstVariant = product.variants[0];
  //   if (!firstVariant.colors || firstVariant.colors.length === 0) {
  //     toast.error('Phiên bản không có màu sắc');
  //     return;
  //   }

  //   const firstColor = firstVariant.colors[0];

  //   try {
  //     const result = await addToCart(
  //       firstVariant.VariantID,
  //       firstColor.ColorID,
  //       1,
  //     );

  //     if (result.success) {
  //       toast.success('Đã thêm vào giỏ hàng!');
  //     } else {
  //       toast.error(result.error || 'Có lỗi xảy ra');
  //     }
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
  //     toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
  //   }
  // };

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
        {categories.map((category) => {
          const categoryProducts =
            productsByCategory[category.CategoryID] || [];
          const displayProducts = categoryProducts.slice(0, 12); // Show max 12 products (2 rows of 6)

          return displayProducts.length > 0 ? (
            <div key={category.CategoryID} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                {category.Name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {displayProducts.map((product) => (
                  <Link
                    key={product.ProductID}
                    to={`/products/${product.Slug}`}
                    className="group"
                  >
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
                        <h3 className="h-14 text-xl font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600">
                          {product.Name}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-red-600 font-bold">
                            {formatCurrency(
                              product.variants?.length > 0
                                ? Math.min(
                                    ...product.variants.map((v) => v.Price),
                                  )
                                : 0,
                            )}
                          </p>
                          <span className="text-sm text-gray-500">
                            {product.variants?.[0]?.memorySize?.MemorySize}
                          </span>
                        </div>
                        <Link
                          to={`/products/${product.Slug}`}
                          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          Mua ngay
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null;
        })}
      </section>

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
      )} */}

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
