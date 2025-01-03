import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { axiosClient } from '../config/axios.config';
import { formatCurrency } from '~/utils/format';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '~/assets/styles/index.css';

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/api/products/${slug}`);
        setProduct(response.data);
        // Mặc định chọn variant đầu tiên
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
          if (
            response.data.variants[0].colors &&
            response.data.variants[0].colors.length > 0
          ) {
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
  }, [slug]);

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
          <p className="text-gray-600">{product.Description}</p>

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
              <div className="flex gap-2">
                {selectedVariant.colors.map((color) => (
                  <button
                    key={color.ColorID}
                    onClick={() => handleColorChange(color)}
                    className={`p-2 rounded-full border-2 ${
                      selectedColor?.ColorID === color.ColorID
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.ColorCode }}
                    title={color.ColorName}
                  />
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

          {/* Giá và nút mua */}
          <div className="space-y-4">
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(selectedVariant?.Price)}
            </p>
            <button className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300">
              Thêm vào giỏ hàng
            </button>
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
    </div>
  );
}

export default ProductDetail;
