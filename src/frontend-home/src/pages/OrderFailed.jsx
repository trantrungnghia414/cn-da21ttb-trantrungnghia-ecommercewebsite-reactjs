import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function OrderFailed() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleContinueShopping = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Đặt hàng thất bại!
        </h1>
        <p className="text-gray-600 mb-8">
          Rất tiếc đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại sau.
        </p>
        <div className="space-x-4">
          <button
            onClick={handleContinueShopping}
            className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderFailed;
