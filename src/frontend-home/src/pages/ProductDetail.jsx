import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '~/utils/format';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '~/assets/styles/index.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';

function ProductDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('variant');
  const colorId = searchParams.get('color');
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    // Scroll lên đầu trang khi component mount
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/api/products/${slug}`);
        setProduct(response.data);

        // Tìm và chọn variant từ URL params
        if (variantId && response.data.variants) {
          const variant = response.data.variants.find(
            (v) => v.VariantID === parseInt(variantId),
          );
          if (variant) {
            setSelectedVariant(variant);
            // Tìm và chọn color từ URL params
            if (colorId && variant.colors) {
              const color = variant.colors.find(
                (c) => c.ColorID === parseInt(colorId),
              );
              if (color) {
                setSelectedColor(color);
              }
            }
          }
        } else if (
          response.data.variants &&
          response.data.variants.length > 0
        ) {
          // Fallback to first variant and color if no params
          setSelectedVariant(response.data.variants[0]);
          if (response.data.variants[0].colors?.length > 0) {
            setSelectedColor(response.data.variants[0].colors[0]);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Không thể tải thông tin sản phẩm');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, variantId, colorId]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (product?.CategoryID) {
          const response = await axiosClient.get(`/api/products`, {
            params: {
              category: product.CategoryID,
              exclude: product.ProductID,
              limit: 10, // Giới hạn 10 sản phẩm liên quan
            },
          });
          setRelatedProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    if (variant.colors && variant.colors.length > 0) {
      setSelectedColor(variant.colors[0]);
      // Reset slider về vị trí đầu
      if (mainSwiperRef.current?.swiper) {
        mainSwiperRef.current.swiper.slideTo(0);
      }
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Reset slider về vị trí đầu
    if (mainSwiperRef.current?.swiper) {
      mainSwiperRef.current.swiper.slideTo(0);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= selectedColor?.Stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    if (!selectedVariant || !selectedColor) {
      toast.error('Vui lòng chọn đầy đủ thông tin sản phẩm!');
      return;
    }

    if (selectedColor.Stock === 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }

    if (quantity > selectedColor.Stock) {
      toast.error(`Chỉ còn ${selectedColor.Stock} sản phẩm trong kho!`);
      return;
    }

    try {
      const result = await addToCart(
        selectedVariant.VariantID,
        selectedColor.ColorID,
        quantity,
      );

      if (result.success) {
        toast.success('Đã thêm vào giỏ hàng!');
      } else {
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần slider ảnh */}
        <div className="space-y-4">
          {/* Main Slider */}
          <Swiper
            ref={mainSwiperRef}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-[400px] rounded-lg"
          >
            {selectedColor?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center h-full rounded-lg">
                  <img
                    src={image.ImageURL}
                    alt={`${product.Name} - ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
            {(!selectedColor?.images || selectedColor.images.length === 0) && (
              <SwiperSlide>
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <img
                    src={product.Thumbnail}
                    alt={product.Name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Thumbnail Slider */}
          {selectedColor?.images && selectedColor.images.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              slidesPerView={8}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbs-slider h-20"
              breakpoints={{
                320: {
                  slidesPerView: 4,
                  spaceBetween: 6,
                },
                640: {
                  slidesPerView: 6,
                  spaceBetween: 6,
                },
                1024: {
                  slidesPerView: 8,
                  spaceBetween: 8,
                },
              }}
            >
              {selectedColor.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="h-full cursor-pointer rounded-lg overflow-hidden py-2">
                    <img
                      src={image.ImageURL}
                      alt={`${product.Name} - ${index + 1}`}
                      className="h-full w-full object-cover hover:opacity-75 transition-opacity"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.Name}</h1>
          {/* <p className="text-gray-600">{product.Description}</p> */}

          {/* Chọn dung lượng */}
          <div>
            {' '}
            <h3 className="text-lg font-semibold mb-2">Dung lượng:</h3>
            <div className="flex gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.VariantID}
                  onClick={() => handleVariantChange(variant)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedVariant?.VariantID === variant.VariantID
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {variant.memorySize.MemorySize}
                </button>
              ))}
            </div>
          </div>

          {/* Chọn màu */}
          {selectedVariant && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Màu sắc:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVariant.colors.map((color) => (
                  <button
                    key={color.ColorID}
                    onClick={() => handleColorChange(color)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 hover:border-red-400 transition-colors ${
                      selectedColor?.ColorID === color.ColorID
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.ColorCode }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {color.ColorName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thông kê xem còn hàng, hết hàng, sắp hết */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div
                className={`
            px-3 py-1 rounded-full font-semibold
            ${
              selectedColor?.Stock > 5
                ? 'bg-green-100 text-green-600 border border-green-200'
                : selectedColor?.Stock === 0
                  ? 'bg-red-100 text-red-600 border border-red-200'
                  : 'bg-yellow-100 text-yellow-600 border border-yellow-200'
            }
            flex items-center gap-2
        `}
              >
                <span
                  className={`
                w-2 h-2 rounded-full
                ${
                  selectedColor?.Stock > 5
                    ? 'bg-green-500 animate-pulse'
                    : selectedColor?.Stock === 0
                      ? 'bg-red-500'
                      : 'bg-yellow-500 animate-pulse'
                }
            `}
                ></span>
                <span>
                  {selectedColor?.Stock > 5
                    ? 'Còn hàng'
                    : selectedColor?.Stock === 0
                      ? 'Hết hàng'
                      : 'Sắp hết hàng'}
                </span>
                {selectedColor?.Stock > 0 && selectedColor?.Stock <= 5 && (
                  <span className="text-red-500 font-bold"></span>
                )}
              </div>
            </div>
          </div>

          {/* Phần chọn số lượng - chỉ hiển thị khi đã đăng nhập */}
          {user && selectedColor?.Stock > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng:
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={`p-2 rounded-md ${
                    quantity <= 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <span className="w-16 text-center border border-gray-300 rounded-md py-2">
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= selectedColor?.Stock}
                  className={`p-2 rounded-md ${
                    quantity >= selectedColor?.Stock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* <span className="text-sm text-gray-500">
                  Còn {selectedColor?.Stock} sản phẩm
                </span> */}
              </div>
            </div>
          )}

          {/* Giá và nút thêm vào giỏ */}
          <div className="space-y-4 mt-6">
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(selectedVariant?.Price)}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={!selectedColor || selectedColor.Stock === 0}
              className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white transition duration-300 ${
                !selectedColor || selectedColor.Stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {!selectedColor
                ? 'Vui lòng chọn phiên bản'
                : selectedColor.Stock === 0
                  ? 'Hết hàng'
                  : 'Thêm vào giỏ hàng'}
            </button>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: product.Description }}
            />
          </div>
        </div>
      </div>

      {/* Chức năng bình luận */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
        {/* Hiển thị bình luận ở đây */}
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Nhập bình luận của bạn"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Phần sản phẩm liên quan */}
      <div className="mt-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Sản phẩm liên quan
        </h2>

        {relatedProducts.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            navigation={true}
            modules={[Navigation]}
            className="related-products-slider"
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
            }}
          >
            {relatedProducts.map((relatedProduct) => (
              <SwiperSlide key={relatedProduct.ProductID}>
                <Link
                  to={`/products/${relatedProduct.Slug}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-w-1 aspect-h-1 p-4">
                      <img
                        src={relatedProduct.Thumbnail}
                        alt={relatedProduct.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 h-14">
                        {relatedProduct.Name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-red-600 font-bold">
                          {formatCurrency(relatedProduct.variants?.[0]?.Price)}
                        </p>
                        <span className="text-sm text-gray-500">
                          {relatedProduct.variants?.[0]?.memorySize?.MemorySize}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-500">
            Không có sản phẩm liên quan
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
