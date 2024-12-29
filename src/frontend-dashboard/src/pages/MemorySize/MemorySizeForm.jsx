import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";

function MemorySizeForm() {
    const navigate = useNavigate();
    const { memorySizeID } = useParams();
    const isEditMode = Boolean(memorySizeID);

    const [formData, setFormData] = useState({
        MemorySize: "",
        CategoryID: "",
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosAppJson.get("/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchMemorySize = async () => {
            if (isEditMode) {
                try {
                    const response = await axiosAppJson.get(`/memorysizes/${memorySizeID}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Error fetching memory size:", error);
                }
            }
        };

        fetchCategories();
        fetchMemorySize();
    }, [isEditMode, memorySizeID]);

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
        if (!formData.MemorySize.trim()) {
            newErrors.MemorySize = "Vui lòng nhập kích thước bộ nhớ";
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
            if (isEditMode) {
                await axiosAppJson.put(`/memorysizes/${memorySizeID}`, formData);
            } else {
                await axiosAppJson.post("/memorysizes", formData);
            }
            navigate("/admin/memorysizes");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {isEditMode ? "Chỉnh sửa kích thước bộ nhớ" : "Thêm kích thước bộ nhớ mới"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="MemorySize" className="block text-sm font-medium text-gray-700">
                        Kích thước bộ nhớ
                    </label>
                    <input
                        type="text"
                        name="MemorySize"
                        id="MemorySize"
                        value={formData.MemorySize}
                        onChange={handleChange}
                        className={`h-10 px-4 mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.MemorySize ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                    />
                    {errors.MemorySize && (
                        <p className="mt-2 text-sm text-red-600">{errors.MemorySize}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="CategoryID" className="block text-sm font-medium text-gray-700">
                        Danh mục
                    </label>
                    <select
                        name="CategoryID"
                        id="CategoryID"
                        value={formData.CategoryID}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.CategoryID ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.CategoryID} value={category.CategoryID}>
                                {category.Name}
                            </option>
                        ))}
                    </select>
                    {errors.CategoryID && (
                        <p className="mt-2 text-sm text-red-600">{errors.CategoryID}</p>
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