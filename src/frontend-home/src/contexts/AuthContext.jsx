import { createContext, useContext, useState, useEffect } from 'react';
import { axiosClient } from '../config/axios.config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.post('/api/auth/check', { token });
        const userData = response.data.data.user;

        if (userData.Role === 'Customer' && userData.Status === 'active') {
          setUser(userData);
        } else {
          await handleLogout();
        }
      } catch (error) {
        await handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const saveToken = (token, remember) => {
    if (remember) {
      localStorage.setItem('token', token);
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('rememberMe');
    }
  };

  const login = (userData, remember = false) => {
    setUser(userData);
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      setUser(null);
      navigate('/login');
    } catch (error) {
      // console.error('Logout error:', error);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/api/auth/logout');
      await handleLogout();
    } catch (error) {
      await handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
