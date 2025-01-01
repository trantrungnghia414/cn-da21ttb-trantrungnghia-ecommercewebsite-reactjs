import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function MemorySizeForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        MemorySize: "",
        CategoryID: "",
        CreatedAt: new Date().toISOString(),
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await axiosAppJson.get("/api/categories");
                setCategories(categoriesRes.data);

                if (isEditMode) {
                    console.log("Edit mode with ID:", id);
                    const response = await axiosAppJson.get(
                        `/api/memorysizes/${id}`
                    );
                    const { MemorySize, CategoryID, CreatedAt } = response.data;
                    setFormData({
                        MemorySize,
                        CategoryID: CategoryID.toString(),
                        CreatedAt: CreatedAt || new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Lỗi khi tải dữ liệu");
                navigate("/admin/memorysizes");
            }
        };
        fetchData();
    }, [isEditMode, id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.MemorySize?.trim()) {
            newErrors.MemorySize = "Vui lòng nhập dung lượng bộ nhớ";
        } else if (!/^[0-9]+\s*(GB|TB|MB)$/i.test(formData.MemorySize.trim())) {
            newErrors.MemorySize = "Định dạng không hợp lệ (Ví dụ: 128GB, 1TB)";
        }

        if (!formData.CategoryID) {
            newErrors.CategoryID = "Vui lòng chọn danh mục";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                MemorySize: formData.MemorySize.trim(),
                CategoryID: parseInt(formData.CategoryID),
                CreatedAt: formData.CreatedAt,
            };

            if (isEditMode) {
                await axiosAppJson.put(`/api/memorysizes/${id}`, payload);
                toast.success("Cập nhật dung lượng bộ nhớ thành công!");
            } else {
                await axiosAppJson.post("/api/memorysizes", payload);
                toast.success("Thêm dung lượng bộ nhớ thành công!");
            }
            navigate("/admin/memorysizes");
        } catch (error) {
            console.error("Error:", error);
            if (error.response?.status === 409) {
                toast.error("Dung lượng này đã tồn tại trong danh mục đã chọn");
            } else {
                toast.error(
                    error.response?.data?.error ||
                        "Có lỗi xảy ra khi lưu dung lượng bộ nhớ!"
                );
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {isEditMode
                    ? "Chỉnh sửa dung lượng bộ nhớ"
                    : "Thêm dung lượng bộ nhớ mới"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="MemorySize"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Dung lượng bộ nhớ
                    </label>
                    <input
                        type="text"
                        name="MemorySize"
                        id="MemorySize"
                        value={formData.MemorySize}
                        onChange={handleChange}
                        placeholder="Ví dụ: 128GB, 256GB, 1TB"
                        className={`h-10 px-4 mt-1 block w-full rounded-md shadow-sm sm:text-sm
                            ${
                                errors.MemorySize
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.MemorySize && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.MemorySize}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="CategoryID"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Danh mục
                    </label>
                    <select
                        name="CategoryID"
                        id="CategoryID"
                        value={formData.CategoryID}
                        onChange={handleChange}
                        className={`h-10 px-4 mt-1 block w-full rounded-md shadow-sm sm:text-sm
                            ${
                                errors.CategoryID
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option
                                key={category.CategoryID}
                                value={category.CategoryID}
                            >
                                {category.Name}
                            </option>
                        ))}
                    </select>
                    {errors.CategoryID && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.CategoryID}
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/memorysizes")}
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

export default MemorySizeForm;
