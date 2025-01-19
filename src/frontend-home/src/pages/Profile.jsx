import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { axiosClient } from '../config/axios.config';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

function Profile() {
  const { user, logout, login } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Khởi tạo formData với giá trị từ user ngay khi component được tạo
  const [formData, setFormData] = useState({
    fullName: user?.FullName || '',
    email: user?.Email || '',
    phoneNumber: user?.PhoneNumber || '',
    address: user?.Address || '',
  });

  // Thêm state cho form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Thêm state để điều khiển modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Thêm state cho modal xóa tài khoản
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.FullName || '',
        email: user.Email || '',
        phoneNumber: user.PhoneNumber || '',
        address: user.Address || '',
      });
    }
  }, [user?.FullName, user?.Email, user?.PhoneNumber, user?.Address]); // Thêm dependencies cụ thể

  // Cập nhật loading state
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.UserID) return;

        const response = await axiosClient.get('/api/orders');

        if (response.data) {
          const sortedOrders = response.data.sort(
            (a, b) => new Date(b.OrderDate) - new Date(a.OrderDate),
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải lịch sử đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.UserID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.put('/api/users/profile', {
        FullName: formData.fullName,
        PhoneNumber: formData.phoneNumber,
        Address: formData.address,
      });

      if (response.data) {
        // Cập nhật lại thông tin user trong context
        login(response.data);
        toast.success('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Không thể cập nhật thông tin',
      );
    }
  };

  const handleLogout = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (isConfirmed) {
      try {
        await logout();
        toast.success('Đăng xuất thành công!');
        navigate('/');
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đăng xuất');
      }
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.delete('/api/users/account', {
        data: { Password: deletePassword },
      });

      toast.success('Tài khoản đã được xóa thành công');
      await logout();
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản',
      );
      setDeletePassword('');
    }
  };

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    try {
      const response = await axiosClient.put('/api/users/change-password', {
        CurrentPassword: passwordForm.currentPassword,
        NewPassword: passwordForm.newPassword,
      });

      toast.success('Đổi mật khẩu thành công');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
    }
  };

  // Thêm hàm xử lý quay lại
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
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

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <img
                  className="h-24 w-24 rounded-full mb-4"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.FullName || user?.fullName,
                  )}&size=96`}
                  alt="Profile"
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  {user?.FullName || user?.fullName}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'orders'
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Lịch sử đơn hàng
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Cài đặt tài khoản
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Thông tin cá nhân
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
                  >
                    Cập nhật thông tin
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Lịch sử đơn hàng</h2>
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-6 py-3 text-left">Mã đơn hàng</th>
                          <th className="px-6 py-3 text-left">Ngày đặt</th>
                          <th className="px-6 py-3 text-left">Tổng tiền</th>
                          <th className="px-6 py-3 text-left">Trạng thái</th>
                          <th className="px-6 py-3 text-left">Thanh toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.OrderID}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">#{order.OrderID}</td>
                            <td className="px-6 py-4">
                              {new Date(
                                order.OrderDate || order.CreatedAt,
                              ).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4">
                              {formatCurrency(order.TotalAmount)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.OrderStatus === 'Completed' ||
                                  order.Status === 'Completed'
                                    ? 'bg-green-100 text-green-800'
                                    : order.OrderStatus === 'Pending' ||
                                        order.Status === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : order.OrderStatus === 'Cancelled' ||
                                          order.Status === 'Cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {order.OrderStatus === 'Completed' ||
                                order.Status === 'Completed'
                                  ? 'Đã giao'
                                  : order.OrderStatus === 'Pending' ||
                                      order.Status === 'Pending'
                                    ? 'Đang xử lý'
                                    : order.OrderStatus === 'Cancelled' ||
                                        order.Status === 'Cancelled'
                                      ? 'Đã hủy'
                                      : order.OrderStatus || order.Status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.PaymentStatus === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {order.PaymentStatus === 'Paid'
                                  ? 'Đã thanh toán'
                                  : 'Chưa thanh toán'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Bạn chưa có đơn hàng nào
                  </p>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Cài đặt tài khoản
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Đổi mật khẩu
                    </h3>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      Thay đổi mật khẩu
                    </button>
                  </div>
                  {/* <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Xóa tài khoản
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh
                      viễn và không thể khôi phục.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200"
                    >
                      Xóa tài khoản
                    </button>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa tài khoản */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận xóa tài khoản
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn
              tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
            </p>
            <form onSubmit={handleDeleteAccount}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhập mật khẩu để xác nhận
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Xác nhận xóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
