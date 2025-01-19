import { createContext, useContext, useState, useEffect } from 'react';
import { axiosClient } from '~/config/axios.config';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/carts');
      setCartItems(response.data);
      // console.log(response.data);
    } catch (error) {
      // console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        logout();
      }
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (variantId, colorId, quantity = 1) => {
    try {
      const response = await axiosClient.post('/api/carts/add', {
        variantId,
        colorId,
        quantity,
      });
      await fetchCart();
      return { success: true, data: response.data };
    } catch (error) {
      // console.error('Error adding to cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra',
      };
    }
  };

  const updateCartItem = async (cartId, quantity) => {
    try {
      await axiosClient.put(`/api/carts/${cartId}`, { quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      // console.error('Error updating cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra',
      };
    }
  };

  const updateCartItemStatus = async (cartId, status) => {
    try {
      await axiosClient.put(`/api/cart/${cartId}`, { status });
      await fetchCart();
      return { success: true };
    } catch (error) {
      // console.error('Error updating cart status:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra',
      };
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await axiosClient.delete(`/api/carts/${cartId}`);
      await fetchCart();
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      return { success: true };
    } catch (error) {
      // console.error('Error removing from cart:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra',
      };
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromotion) return 0;

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0,
    );

    let discount = 0;
    if (appliedPromotion.DiscountType === 'Percentage') {
      discount = (subtotal * appliedPromotion.DiscountValue) / 100;
      if (appliedPromotion.MaximumDiscount) {
        discount = Math.min(discount, appliedPromotion.MaximumDiscount);
      }
    } else {
      discount = appliedPromotion.DiscountValue;
    }
    return discount;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    loading,
    appliedPromotion,
    setAppliedPromotion,
    addToCart,
    updateCartItem,
    updateCartItemStatus,
    removeFromCart,
    calculateDiscount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
