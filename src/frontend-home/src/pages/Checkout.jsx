import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { axiosClient } from '../config/axios.config';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/format';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, appliedPromotion, calculateDiscount } = useCart();
  const { user } = useAuth();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingFee, setShippingFee] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo shippingInfo
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    provinceCode: '',
    provinceName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    address: '',
  });

  // Thêm state để kiểm tra có đơn hàng trước đó không
  const [hasPreviewOrder, setHasPreviewOrder] = useState(false);

  // Cập nhật useEffect để lấy thông tin từ user và đơn hàng gần nhất
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Lấy thông tin user profile
        const profileResponse = await axiosClient.get('/api/users/profile');

        // Lấy thông tin địa chỉ gần nhất
        const addressResponse = await axiosClient.get(
          '/api/users/latest-address',
        );

        // Luôn cập nhật thông tin từ profile trước
        if (profileResponse.data) {
          setShippingInfo((prev) => ({
            ...prev,
            fullName: profileResponse.data.FullName || '',
            phone: profileResponse.data.PhoneNumber || '',
          }));
        }

        // Chỉ cập nhật thông tin địa chỉ nếu có dữ liệu
        if (addressResponse.data && addressResponse.data.provinceCode) {
          setHasPreviewOrder(true);
          setShippingInfo((prev) => ({
            ...prev,
            address: addressResponse.data.address,
            phone: addressResponse.data.phone || prev.phone,
            provinceCode: addressResponse.data.provinceCode,
            provinceName: addressResponse.data.provinceName,
            districtCode: addressResponse.data.districtCode,
            districtName: addressResponse.data.districtName,
            wardCode: addressResponse.data.wardCode,
            wardName: addressResponse.data.wardName,
          }));

          // Fetch districts và wards chỉ khi có provinceCode
          if (addressResponse.data.provinceCode) {
            const districtsResponse = await axiosClient.get(
              `/api/shipping/districts/${addressResponse.data.provinceCode}`,
            );
            setDistricts(districtsResponse.data);
          }

          if (addressResponse.data.districtCode) {
            const wardsResponse = await axiosClient.get(
              `/api/shipping/wards/${addressResponse.data.districtCode}`,
            );
            setWards(wardsResponse.data);
          }

          // Tính phí ship nếu có đủ thông tin
          if (
            addressResponse.data.districtCode &&
            addressResponse.data.wardCode
          ) {
            const shippingResponse = await axiosClient.post(
              '/api/shipping/calculate-fee',
              {
                districtCode: addressResponse.data.districtCode,
                wardCode: addressResponse.data.wardCode,
              },
            );

            if (shippingResponse.data && shippingResponse.data.code === 200) {
              setShippingFee(shippingResponse.data.data.total);
            }
          }
        }

        // Luôn fetch danh sách tỉnh/thành
        const provincesResponse = await axiosClient.get(
          '/api/shipping/provinces',
        );
        setProvinces(provincesResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Không thể tải thông tin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Tính tổng tiền hàng
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.Price * item.Quantity,
    0,
  );

  const discount = calculateDiscount();
  const total = subtotal - discount + shippingFee;

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    const province = provinces.find((p) => p.code === parseInt(provinceCode));

    if (province) {
      setShippingInfo((prev) => ({
        ...prev,
        provinceCode: province.code,
        provinceName: province.name,
        districtCode: '',
        districtName: '',
        wardCode: '',
        wardName: '',
      }));

      try {
        const response = await axiosClient.get(
          `/api/shipping/districts/${provinceCode}`,
        );
        setDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    const district = districts.find((d) => d.code === parseInt(districtCode));

    if (district) {
      setShippingInfo((prev) => ({
        ...prev,
        districtCode: district.code,
        districtName: district.name,
        wardCode: '',
        wardName: '',
      }));

      try {
        const response = await axiosClient.get(
          `/api/shipping/wards/${districtCode}`,
        );
        setWards(response.data);
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    }
  };

  const handleWardChange = async (e) => {
    const wardCode = e.target.value;
    const ward = wards.find((w) => w.code === wardCode);

    if (ward) {
      setShippingInfo((prev) => ({
        ...prev,
        wardCode: ward.code,
        wardName: ward.name,
      }));

      // Calculate shipping fee
      if (shippingInfo.districtCode) {
        try {
          const response = await axiosClient.post(
            '/api/shipping/calculate-fee',
            {
              districtCode: shippingInfo.districtCode,
              wardCode: ward.code,
            },
          );

          if (response.data && response.data.code === 200) {
            setShippingFee(response.data.data.total);
          }
        } catch (error) {
          console.error('Error calculating shipping fee:', error);
          toast.error('Không thể tính phí vận chuyển');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin giao hàng
    if (
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.provinceCode ||
      !shippingInfo.districtCode ||
      !shippingInfo.wardCode
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      toast.error('Số điện thoại không hợp lệ!');
      return;
    }

    // Kiểm tra giỏ hàng
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }

    try {
      const orderData = {
        items: cartItems,
        shippingInfo,
        paymentMethod,
        shippingFee,
        promotionId: appliedPromotion?.PromotionID,
        discount,
        subtotal,
        total,
      };

      const response = await axiosClient.post('/api/orders', orderData);

      if (paymentMethod === 'vnpay') {
        window.location.href = response.data.paymentUrl;
      } else {
        navigate(`/order-success/${response.data.orderId}`);
      }
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng',
      );
      navigate('/order-failed');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Quay lại
          </button>
        </div>

        <h1 className="text-2xl font-semibold mb-8">Thanh toán</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form thông tin giao hàng */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin giao hàng
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tỉnh/Thành phố
                    </label>
                    <select
                      value={shippingInfo.provinceCode}
                      onChange={handleProvinceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quận/Huyện
                    </label>
                    <select
                      value={shippingInfo.districtCode}
                      onChange={handleDistrictChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phường/Xã
                    </label>
                    <select
                      value={shippingInfo.wardCode}
                      onChange={handleWardChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phương thức thanh toán
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="cod" className="ml-2">
                          Thanh toán khi nhận hàng (COD)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="vnpay"
                          name="paymentMethod"
                          value="vnpay"
                          checked={paymentMethod === 'vnpay'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="vnpay" className="ml-2">
                          Thanh toán qua VNPAY
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                >
                  Đặt hàng
                </button>
              </form>
            </div>
          </div>

          {/* Tổng quan đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Tổng quan đơn hàng</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.CartID} className="flex gap-4">
                    <img
                      src={item.productVariant.product.Thumbnail}
                      alt={item.productVariant.product.Name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">
                        {item.productVariant.product.Name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.productVariant.memorySize.MemorySize} -{' '}
                        {item.productColor.ColorName}
                      </p>
                      <p className="text-sm">
                        {formatCurrency(item.Price)} x {item.Quantity}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {appliedPromotion && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>- {formatCurrency(discount)}</span>
                    </div>
                  )}

                  {shippingFee > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span>{formatCurrency(shippingFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-medium text-gray-900 pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
