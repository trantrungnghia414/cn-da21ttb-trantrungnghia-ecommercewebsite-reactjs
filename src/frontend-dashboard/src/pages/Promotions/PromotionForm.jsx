import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PromotionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    Code: '',
    Name: '',
    Description: '',
    DiscountType: 'Percentage',
    DiscountValue: '',
    MinimumOrder: '',
    MaximumDiscount: '',
    StartDate: '',
    EndDate: '',
    UsageLimit: '',
    Status: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      // Giả lập dữ liệu khi edit
      setFormData({
        Code: 'SUMMER2024',
        Name: 'Khuyến mãi hè 2024',
        Description: 'Giảm giá 10% cho tất cả sản phẩm',
        DiscountType: 'Percentage',
        DiscountValue: '10',
        MinimumOrder: '1000000',
        MaximumDiscount: '500000',
        StartDate: '2024-06-01',
        EndDate: '2024-08-31',
        UsageLimit: '100',
        Status: true
      });
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Code.trim()) {
      newErrors.Code = 'Vui lòng nhập mã khuyến mãi';
    }
    if (!formData.Name.trim()) {
      newErrors.Name = 'Vui lòng nhập tên khuyến mãi';
    }
    if (!formData.DiscountValue) {
      newErrors.DiscountValue = 'Vui lòng nhập giá trị giảm giá';
    }
    if (!formData.MinimumOrder) {
      newErrors.MinimumOrder = 'Vui lòng nhập giá trị đơn hàng tối thiểu';
    }
    if (!formData.StartDate) {
      newErrors.StartDate = 'Vui lòng chọn ngày bắt đầu';
    }
    if (!formData.EndDate) {
      newErrors.EndDate = 'Vui lòng chọn ngày kết thúc';
    }
    if (formData.EndDate < formData.StartDate) {
      newErrors.EndDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Xử lý API call ở đây
      console.log('Form data:', formData);
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="Code" className="block text-sm font-medium text-gray-700">
              Mã khuyến mãi
            </label>
            <input
              type="text"
              name="Code"
              id="Code"
              value={formData.Code}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.Code 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.Code && (
              <p className="mt-2 text-sm text-red-600">{errors.Code}</p>
            )}
          </div>
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
              Tên khuyến mãi
            </label>
            <input
              type="text"
              name="Name"
              id="Name"
              value={formData.Name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.Name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.Name && (
              <p className="mt-2 text-sm text-red-600">{errors.Name}</p>
            )}
          </div>
          <div>
            <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="Description"
              id="Description"
              value={formData.Description}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.Description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.Description && (
              <p className="mt-2 text-sm text-red-600">{errors.Description}</p>
            )}
          </div>
          <div>
            <label htmlFor="DiscountType" className="block text-sm font-medium text-gray-700">
              Loại giảm giá
            </label>
            <select
              name="DiscountType"
              id="DiscountType"
              value={formData.DiscountType}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.DiscountType 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            >
              <option value="Percentage">Phần trăm</option>
              <option value="Fixed">Số tiền</option>
            </select>
            {errors.DiscountType && (
              <p className="mt-2 text-sm text-red-600">{errors.DiscountType}</p>
            )}
          </div>
          <div>
            <label htmlFor="DiscountValue" className="block text-sm font-medium text-gray-700">
              Giá trị giảm giá
            </label>
            <input
              type="number"
              name="DiscountValue"
              id="DiscountValue"
              value={formData.DiscountValue}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.DiscountValue 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.DiscountValue && (
              <p className="mt-2 text-sm text-red-600">{errors.DiscountValue}</p>
            )}
          </div>
          <div>
            <label htmlFor="MinimumOrder" className="block text-sm font-medium text-gray-700">
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              name="MinimumOrder"
              id="MinimumOrder"
              value={formData.MinimumOrder}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.MinimumOrder 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.MinimumOrder && (
              <p className="mt-2 text-sm text-red-600">{errors.MinimumOrder}</p>
            )}
          </div>
          <div>
            <label htmlFor="StartDate" className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="StartDate"
              id="StartDate"
              value={formData.StartDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.StartDate 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.StartDate && (
              <p className="mt-2 text-sm text-red-600">{errors.StartDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="EndDate" className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="EndDate"
              id="EndDate"
              value={formData.EndDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.EndDate 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.EndDate && (
              <p className="mt-2 text-sm text-red-600">{errors.EndDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="UsageLimit" className="block text-sm font-medium text-gray-700">
              Giới hạn sử dụng
            </label>
            <input
              type="number"
              name="UsageLimit"
              id="UsageLimit"
              value={formData.UsageLimit}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${errors.UsageLimit 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            {errors.UsageLimit && (
              <p className="mt-2 text-sm text-red-600">{errors.UsageLimit}</p>
            )}
          </div>
          <div>
            <label htmlFor="Status" className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <input
              type="checkbox"
              name="Status"
              id="Status"
              checked={formData.Status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            {isEditMode ? 'Cập nhật' : 'Thêm khuyến mãi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PromotionForm;
