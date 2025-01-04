import { createContext, useContext, useState, useEffect } from 'react';
import { axiosClient } from '../config/axios.config';

const AuthContext = createContext();

// Provider cho AuthContext
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(user);  

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
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

        console.log(response.data.data.user);

        if (response.data.data.user.Role === 'Customer') {
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error('Check auth error:', error);
        // localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
