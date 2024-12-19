import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

function PromotionList() {
  // Dữ liệu mẫu
  const [promotions] = useState([
    {
      PromotionID: 1,
      Code: 'SUMMER2024',
      Name: 'Khuyến mãi hè 2024',
      Description: 'Giảm giá 10% cho tất cả sản phẩm',
      DiscountType: 'Percentage',
      DiscountValue: 10,
      MinimumOrder: 1000000,
      MaximumDiscount: 500000,
      StartDate: '2024-06-01T00:00:00',
      EndDate: '2024-08-31T23:59:59',
      UsageLimit: 100,
      UsageCount: 25,
      Status: true
    },
    {
      PromotionID: 2,
      Code: 'NEWUSER',
      Name: 'Chào mừng thành viên mới',
      Description: 'Giảm 200,000đ cho đơn hàng đầu tiên',
      DiscountType: 'Fixed',
      DiscountValue: 200000,
      MinimumOrder: 500000,
      MaximumDiscount: 200000,
      StartDate: '2024-01-01T00:00:00',
      EndDate: '2024-12-31T23:59:59',
      UsageLimit: 1000,
      UsageCount: 458,
      Status: true
    }
  ]);

  const handleDelete = (id) => {
    // Xử lý xóa promotion
    console.log('Delete promotion:', id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDiscount = (type, value) => {
    if (type === 'Percentage') {
      return `${value}%`;
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Mã khuyến mãi</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý các chương trình khuyến mãi trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/promotions/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Thêm khuyến mãi
          </Link>
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
                      Mã khuyến mãi
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Thông tin
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Giảm giá
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Thời gian
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sử dụng
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
                  {promotions.map((promotion) => (
                    <tr key={promotion.PromotionID}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {promotion.Code}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">{promotion.Name}</div>
                        <div className="text-gray-500">{promotion.Description}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>{formatDiscount(promotion.DiscountType, promotion.DiscountValue)}</div>
                        <div className="text-xs text-gray-400">
                          Tối thiểu: {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(promotion.MinimumOrder)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>Từ: {formatDate(promotion.StartDate)}</div>
                        <div>Đến: {formatDate(promotion.EndDate)}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {promotion.UsageCount}/{promotion.UsageLimit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            promotion.Status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {promotion.Status ? 'Đang chạy' : 'Đã dừng'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/admin/promotions/edit/${promotion.PromotionID}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(promotion.PromotionID)}
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

export default PromotionList;
