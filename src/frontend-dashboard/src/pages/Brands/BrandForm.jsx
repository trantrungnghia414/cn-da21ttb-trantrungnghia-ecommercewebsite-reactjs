import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function BrandForm() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const isEditMode = Boolean(slug);

    const [formData, setFormData] = useState({
        Name: "",
        Description: "",
    });

    const fetchBrand = async () => {
        try {
            const response = await axiosAppJson.get(`/api/brands/${slug}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching brand:", error);
            toast.error("Lỗi khi tải thông tin thương hiệu");
        }
    };

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            fetchBrand();
        }
    }, [isEditMode, slug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Tự động tạo slug từ tên thương hiệu
            ...(name === "Name"
                ? {
                      Slug: value
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/[đĐ]/g, "d")
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, ""),
                  }
                : {}),
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Name?.trim()) {
            newErrors.Name = "Vui lòng nhập tên thương hiệu";
        }
        if (!formData.Description?.trim()) {
            newErrors.Description = "Vui lòng nhập mô tả";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEditMode) {
                await axiosAppJson.put(`/api/brands/${slug}`, formData);
                toast.success("Cập nhật thương hiệu thành công!");
            } else {
                await axiosAppJson.post("/api/brands", formData);
                toast.success("Thêm thương hiệu thành công!");
            }
            navigate("/admin/brands");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Có lỗi xảy ra khi lưu thương hiệu!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {isEditMode ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="Name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Tên thương hiệu
                    </label>
                    <input
                        type="text"
                        name="Name"
                        id="Name"
                        value={formData?.Name}
                        onChange={handleChange}
                        className={`h-10 px-4 mt-1 block w-full rounded-md shadow-sm sm:text-sm
              ${
                  errors.Name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
                    />
                    {errors.Name && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.Name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="Description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Mô tả
                    </label>
                    <textarea
                        name="Description"
                        id="Description"
                        rows={3}
                        value={formData?.Description}
                        onChange={handleChange}
                        className={`px-4 py-2 mt-1 block w-full rounded-md shadow-sm sm:text-sm
              ${
                  errors.Description
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
                    />
                    {errors.Description && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.Description}
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/brands")}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {isEditMode ? "Cập nhật" : "Thêm"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BrandForm;
