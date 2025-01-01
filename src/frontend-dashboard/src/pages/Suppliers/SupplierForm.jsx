import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function SupplierForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        Name: "",
        ContactInfo: "",
    });

    const fetchSupplier = async () => {
        try {
            const response = await axiosAppJson.get(`/api/suppliers/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching supplier:", error);
            toast.error("Lỗi khi tải thông tin nhà cung cấp");
        }
    };

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            fetchSupplier();
        }
    }, [isEditMode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Xóa lỗi khi người dùng nhập
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Name?.trim()) {
            newErrors.Name = "Vui lòng nhập tên nhà cung cấp";
        }
        if (!formData.ContactInfo?.trim()) {
            newErrors.ContactInfo = "Vui lòng nhập thông tin liên hệ";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEditMode) {
                await axiosAppJson.put(`/api/suppliers/${id}`, formData);
                toast.success("Cập nhật nhà cung cấp thành công!");
            } else {
                await axiosAppJson.post("/api/suppliers", formData);
                toast.success("Thêm nhà cung cấp thành công!");
            }
            navigate("/admin/suppliers");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Có lỗi xảy ra khi lưu nhà cung cấp!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {isEditMode
                    ? "Chỉnh sửa nhà cung cấp"
                    : "Thêm nhà cung cấp mới"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="Name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Tên nhà cung cấp
                    </label>
                    <input
                        type="text"
                        name="Name"
                        id="Name"
                        value={formData?.Name}
                        onChange={handleChange}
                        className={`h-10 pl-4 mt-1 block w-full rounded-md shadow-sm sm:text-sm
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
                        htmlFor="ContactInfo"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Thông tin liên hệ
                    </label>
                    <textarea
                        name="ContactInfo"
                        id="ContactInfo"
                        rows={3}
                        value={formData?.ContactInfo}
                        onChange={handleChange}
                        className={`px-4 py-2 mt-1 block w-full rounded-md shadow-sm sm:text-sm
              ${
                  errors.ContactInfo
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
                    />
                    {errors.ContactInfo && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.ContactInfo}
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/suppliers")}
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

export default SupplierForm;
