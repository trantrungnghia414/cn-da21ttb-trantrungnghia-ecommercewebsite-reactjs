import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to login
      console.log('Login attempt:', formData);
      navigate('/');
    } catch (error) {
      setError('Email hoặc mật khẩu không đúng');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Đăng nhập
        </h2>
        <p className="text-center text-sm text-gray-600">
          Chào mừng bạn quay trở lại!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                />
                <label className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-red-500 hover:text-red-600 transition-colors duration-200">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-red-500 hover:text-red-600 transition-colors duration-200">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
