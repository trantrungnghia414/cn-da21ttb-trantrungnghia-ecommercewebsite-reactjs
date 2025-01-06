import { createContext, useContext, useState, useEffect } from 'react';
import { axiosClient } from '../config/axios.config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Provider cho AuthContext
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(user);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    let interval;
    let isSubscribed = true; // Để tránh memory leak

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.post('/api/auth/check', {
          token,
        });

        const userData = response.data.data.user;

        if (!isSubscribed) return;

        if (userData.Role === 'Customer' && userData.Status === 'active') {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          if (userData.Status === 'inactive') {
            toast.error(
              'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.',
            );
          }
        }
      } catch (error) {
        console.error('Check auth error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    interval = setInterval(checkAuth, 24 * 60 * 60 * 1000); // thời gian sống của token 1 ngày
    
    // Cleanup function
    return () => {
      clearInterval(interval);
      isSubscribed = false;
    };
  }, []); // Empty dependency array - chỉ chạy một lần khi mount

  // Đăng nhập
  const login = (userData) => {
    setUser(userData);
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await axiosClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Trả về AuthContext.Provider với các giá trị user, login, logout, loading
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook để sử dụng AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
