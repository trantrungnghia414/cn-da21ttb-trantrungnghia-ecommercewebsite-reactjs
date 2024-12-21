import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function BrandForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Status: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      // Giả lập dữ liệu khi edit
      setFormData({
        Name: 'Apple',
        Description: 'Công nghệ cao cấp từ Mỹ',
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
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name.trim()) {
      newErrors.Name = 'Vui lòng nhập tên thương hiệu';
    }
    if (!formData.Description.trim()) {
      newErrors.Description = 'Vui lòng nhập mô tả';
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
      navigate('/admin/brands');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
            Tên thương hiệu
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
            rows={3}
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

        <div className="flex items-center">
          <input
            type="checkbox"
            name="Status"
            id="Status"
            checked={formData.Status}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="Status" className="ml-2 block text-sm text-gray-900">
            Hoạt động
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/brands')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditMode ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BrandForm;