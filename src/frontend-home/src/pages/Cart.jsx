import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { axiosClient } from '~/config/axios.config';

function Cart() {
  const {
    cartItems,
    loading,
    updateCartItem,
    removeFromCart,
    appliedPromotion,
    setAppliedPromotion,
    calculateDiscount,
  } = useCart();

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.Price * item.Quantity,
    0,
  );

  const discount = calculateDiscount();
  const total = subtotal - discount;

  const handleApplyPromoCode = async () => {
    try {
      setPromoError('');
      if (!promoCode.trim()) {
        setPromoError('Vui lòng nhập mã giảm giá');
        return;
      }

      const response = await axiosClient.post('/api/promotions/apply', {
        code: promoCode,
        orderTotal: subtotal,
      });

      if (response.data.success) {
        setAppliedPromotion(response.data.promotion);
        toast.success('Áp dụng mã giảm giá thành công');
      }
    } catch (error) {
      setPromoError(
        error.response?.data?.message || 'Mã giảm giá không hợp lệ',
      );
      setAppliedPromotion(null);
    }
  };

  const handleRemovePromoCode = async () => {
    try {
      if (appliedPromotion) {
        await axiosClient.post(
          `/api/promotions/${appliedPromotion.PromotionID}/decrease-usage`,
        );
      }
      setPromoCode('');
      setAppliedPromotion(null);
      setPromoError('');
    } catch (error) {
      console.error('Error removing promotion:', error);
    }
  };

  const handleUpdateQuantity = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity === 0) {
      const isConfirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?`,
      );

      if (isConfirmed) {
        const result = await removeFromCart(cartId);
        if (!result.success) {
          toast.error(result.error);
        }
      }
    } else if (newQuantity >= 1) {
      const result = await updateCartItem(cartId, newQuantity);
      if (!result.success) {
        toast.error(result.error);
      }
    }
  };

  const handleRemoveItem = async (cartId) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?`,
    );

    if (isConfirmed) {
      const result = await removeFromCart(cartId);
      if (!result.success) {
        toast.error(result.error);
      }
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link
            to="/products"
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item.CartID}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <img
                  src={item.productVariant.product.Thumbnail}
                  alt={item.productVariant.product.Name}
                  className="w-24 h-24 object-contain rounded-md"
                />
                <div className="flex-grow">
                  <Link
                    to={`/products/${item.productVariant.product.Slug}?variant=${item.productVariant.VariantID}&color=${item.productColor.ColorID}`}
                    className="hover:text-red-500"
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {item.productVariant.product.Name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.productVariant.memorySize.MemorySize} -{' '}
                      {item.productColor.ColorName}
                    </p>
                  </Link>
                  <p className="text-red-500 font-semibold">
                    {formatCurrency(item.Price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.CartID,
                        item.Quantity,
                        -1,
                        item.productVariant.product.Name,
                      )
                    }
                    className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.Quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.CartID, item.Quantity, 1)
                    }
                    className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200"
                    disabled={item.Quantity >= item.productColor.Stock}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    handleRemoveItem(
                      item.CartID,
                      item.productVariant.product.Name,
                    )
                  }
                  className="text-gray-500 hover:text-red-500"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Tổng tiền và thanh toán */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Mã giảm giá
              </h2>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                {appliedPromotion ? (
                  <button
                    onClick={handleRemovePromoCode}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Xóa
                  </button>
                ) : (
                  <button
                    onClick={handleApplyPromoCode}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Áp dụng
                  </button>
                )}
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-1">{promoError}</p>
              )}
              {appliedPromotion && (
                <div className="text-green-600 text-sm mt-1">
                  Đã áp dụng mã giảm giá: {appliedPromotion.Name}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Tổng đơn hàng
              </h2>
              <div className="space-y-2">
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
                <div className="flex justify-between text-lg font-medium text-gray-900 pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-4 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
