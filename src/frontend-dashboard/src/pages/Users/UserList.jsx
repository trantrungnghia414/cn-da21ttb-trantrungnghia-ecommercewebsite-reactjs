import { useState } from 'react';

function UserList() {
  // Dữ liệu mẫu
  const [users] = useState([
    {
      UserID: 1,
      FullName: 'Nguyễn Văn A',
      Email: 'nguyenvana@gmail.com',
      Phone: '0123456789',
      Address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      Role: 'Customer',
      Status: true,
      CreatedAt: '2024-01-15T08:30:00',
      LastLogin: '2024-03-20T10:15:00',
      OrderCount: 5,
      TotalSpent: 15000000
    },
    {
      UserID: 2,
      FullName: 'Trần Thị B',
      Email: 'tranthib@gmail.com',
      Phone: '0987654321',
      Address: '456 Lê Văn Việt, Q.9, TP.HCM',
      Role: 'Customer',
      Status: true,
      CreatedAt: '2024-02-01T09:00:00',
      LastLogin: '2024-03-19T14:20:00',
      OrderCount: 3,
      TotalSpent: 8500000
    },
    {
      UserID: 3,
      FullName: 'Admin',
      Email: 'admin@example.com',
      Phone: '0369852147',
      Address: '789 Võ Văn Ngân, TP.Thủ Đức, TP.HCM',
      Role: 'Admin',
      Status: true,
      CreatedAt: '2024-01-01T00:00:00',
      LastLogin: '2024-03-20T08:00:00',
      OrderCount: 0,
      TotalSpent: 0
    }
  ]);

  const handleStatusChange = (userId) => {
    // Xử lý thay đổi trạng thái user
    console.log('Toggle status for user:', userId);
  };

  const handleDelete = (userId) => {
    // Xử lý xóa user
    console.log('Delete user:', userId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Danh sách người dùng</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Người dùng
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Liên hệ
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Vai trò
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Đơn hàng
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tổng chi tiêu
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Trạng thái
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.UserID}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                              <span className="font-medium leading-none text-white">
                                {user.FullName.charAt(0)}
                              </span>
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{user.FullName}</div>
                            <div className="text-gray-500">
                              Tham gia: {new Date(user.CreatedAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>{user.Email}</div>
                        <div>{user.Phone}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.Role === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.Role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.OrderCount} đơn
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(user.TotalSpent)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => handleStatusChange(user.UserID)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            user.Status ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              user.Status ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleDelete(user.UserID)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
