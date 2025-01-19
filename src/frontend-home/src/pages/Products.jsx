import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '~/utils/format';
import { FiFilter } from 'react-icons/fi';
import { IoGridOutline } from 'react-icons/io5';
import { BsListUl } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Tính toán sản phẩm hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  // Tính tổng số trang dựa trên tổng số sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          axiosClient.get('/api/products', {
            params: {
              category:
                selectedCategory !== 'all' ? selectedCategory : undefined,
              brand: selectedBrand !== 'all' ? selectedBrand : undefined,
              sort: sortBy !== 'default' ? sortBy : undefined,
            },
          }),
          axiosClient.get('/api/categories'),
          axiosClient.get('/api/brands'),
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        // Tính tổng số trang dựa trên tổng số sản phẩm
        setTotalPages(Math.ceil(productsRes.data.length / itemsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedBrand, sortBy, itemsPerPage]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FiFilter className="text-lg" />
            <span>Bộ lọc</span>
          </button>
          <button
            onClick={toggleViewMode}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            {viewMode === 'grid' ? (
              <BsListUl className="text-xl" />
            ) : (
              <IoGridOutline className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div
        className={`bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                  ${
                    selectedCategory === 'all'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.CategoryID}
                  onClick={() => handleCategoryChange(category.CategoryID)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors
                    ${
                      selectedCategory === category.CategoryID
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.Name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thương hiệu</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBrandChange('all')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                  ${
                    selectedBrand === 'all'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Tất cả
              </button>
              {brands.map((brand) => (
                <button
                  key={brand.BrandID}
                  onClick={() => handleBrandChange(brand.BrandID)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors
                    ${
                      selectedBrand === brand.BrandID
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {brand.Name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sắp xếp</h3>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="name-desc">Tên: Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {displayedProducts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {displayedProducts.map((product) => (
            <Link
              key={product.ProductID}
              to={`/products/${product.Slug}`}
              className={`group ${viewMode === 'list' ? 'w-full' : ''}`}
            >
              <div
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                ${viewMode === 'list' ? 'flex gap-4' : ''}`}
              >
                <div
                  className={`relative ${
                    viewMode === 'list' ? 'w-48' : 'w-full'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-50">
                    <img
                      src={product.Thumbnail}
                      alt={product.Name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                </div>
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="h-14 text-xl font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600">
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
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không có sản phẩm nào
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
          >
            Trang trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === i + 1
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
