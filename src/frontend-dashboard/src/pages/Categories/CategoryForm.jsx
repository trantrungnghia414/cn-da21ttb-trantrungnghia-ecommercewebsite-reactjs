import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosAppJson } from '~/config/axios.config';

function CategoryForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  
  const [formData, setFormData] = useState({});

  const fetchCategories = async () => { // Lấy dữ liệu danh mục cần chỉnh sửa
    const response = await axiosAppJson.get(`/categories/${slug}`);
    setFormData(response.data);
  }

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchCategories();
    }
  }, [isEditMode]);

  const handleChange = (e) => { // Xử lý thay đổi giá trị của input
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => { // Kiểm tra lỗi trước khi submit
    const newErrors = {};
    if (!formData.Name.trim()) {
      newErrors.Name = 'Vui lòng nhập tên danh mục';
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
      if (isEditMode) {
        await axiosAppJson.put(`/categories/${slug}`, formData);
      } else {
        await axiosAppJson.post('/categories', formData);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
            Tên danh mục
          </label>
          <input
            type="text"
            name="Name"
            id="Name"
            value={formData?.Name}
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
          <label htmlFor="Slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            name="Slug"
            id="Slug"
            value={formData?.Slug}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
              ${errors.Slug 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
          />
          {errors.Slug && (
            <p className="mt-2 text-sm text-red-600">{errors.Slug}</p>
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
            value={formData?.Description}
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

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
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

export default CategoryForm;
