import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";

function PromotionForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        Code: "",
        Name: "",
        Description: "",
        DiscountType: "Percentage",
        DiscountValue: "",
        MinimumOrder: "",
        MaximumDiscount: "",
        StartDate: "",
        EndDate: "",
        UsageLimit: "",
        Status: true,
    });

    useEffect(() => {
        if (isEditing) {
            fetchPromotionData();
        }
    }, [id]);

    const fetchPromotionData = async () => {
        try {
            const response = await axiosAppJson.get(`/api/promotions/${id}`);
            const promotion = response.data;
            setFormData({
                ...promotion,
                StartDate: promotion.StartDate.split("T")[0],
                EndDate: promotion.EndDate.split("T")[0],
            });
        } catch (error) {
            console.error("Error fetching promotion:", error);
            toast.error("Không thể tải thông tin khuyến mãi");
            navigate("/admin/promotions");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dữ liệu
        if (
            !formData.Code ||
            !formData.Name ||
            !formData.DiscountValue ||
            !formData.MinimumOrder
        ) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        // Format dữ liệu trước khi gửi
        const submitData = {
            ...formData,
            DiscountValue: parseFloat(formData.DiscountValue),
            MinimumOrder: parseFloat(formData.MinimumOrder),
            MaximumDiscount: formData.MaximumDiscount
                ? parseFloat(formData.MaximumDiscount)
                : null,
            UsageLimit: parseInt(formData.UsageLimit),
            StartDate: new Date(formData.StartDate).toISOString(),
            EndDate: new Date(formData.EndDate).toISOString(),
        };

        try {
            if (isEditing) {
                await axiosAppJson.put(`/api/promotions/${id}`, submitData);
                toast.success("Cập nhật khuyến mãi thành công");
            } else {
                await axiosAppJson.post("/api/promotions", submitData);
                toast.success("Thêm khuyến mãi thành công");
            }
            navigate("/admin/promotions");
        } catch (error) {
            console.error("Error saving promotion:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isEditing
                            ? "Chỉnh sửa khuyến mãi"
                            : "Thêm khuyến mãi mới"}
                    </h1>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mã khuyến mãi
                        </label>
                        <input
                            type="text"
                            name="Code"
                            value={formData.Code}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên khuyến mãi
                        </label>
                        <input
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Loại giảm giá
                        </label>
                        <select
                            name="DiscountType"
                            value={formData.DiscountType}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="Percentage">Phần trăm</option>
                            <option value="Fixed">Số tiền</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Giá trị giảm giá
                        </label>
                        <input
                            type="number"
                            name="DiscountValue"
                            value={formData.DiscountValue}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Giá trị đơn hàng tối thiểu
                        </label>
                        <input
                            type="number"
                            name="MinimumOrder"
                            value={formData.MinimumOrder}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Giảm giá tối đa
                        </label>
                        <input
                            type="number"
                            name="MaximumDiscount"
                            value={formData.MaximumDiscount}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Chỉ áp dụng cho giảm giá theo phần trăm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ngày bắt đầu
                        </label>
                        <input
                            type="date"
                            name="StartDate"
                            value={formData.StartDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ngày kết thúc
                        </label>
                        <input
                            type="date"
                            name="EndDate"
                            value={formData.EndDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Giới hạn sử dụng
                        </label>
                        <input
                            type="number"
                            name="UsageLimit"
                            value={formData.UsageLimit}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Trạng thái
                        </label>
                        <input
                            type="checkbox"
                            name="Status"
                            checked={formData.Status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/promotions")}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {isEditing ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PromotionForm;
