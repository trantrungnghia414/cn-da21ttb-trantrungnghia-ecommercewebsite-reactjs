const db = require("../models");
const { Op } = require("sequelize");

// Lấy danh sách khuyến mãi
exports.getPromotions = async (req, res) => {
    try {
        const promotions = await db.Promotion.findAll({
            order: [["CreatedAt", "DESC"]],
        });
        res.json(promotions);
    } catch (error) {
        console.error("Error in getPromotions:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách khuyến mãi",
            error: error.message,
        });
    }
};

// Lấy chi tiết khuyến mãi
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await db.Promotion.findByPk(req.params.id);
        if (!promotion) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy khuyến mãi" });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy thông tin khuyến mãi",
            error: error.message,
        });
    }
};

// Tạo khuyến mãi mới
exports.createPromotion = async (req, res) => {
    try {
        // Validate dữ liệu đầu vào
        const {
            Code,
            Name,
            DiscountType,
            DiscountValue,
            MinimumOrder,
            StartDate,
            EndDate,
            UsageLimit,
        } = req.body;

        if (
            !Code ||
            !Name ||
            !DiscountType ||
            !DiscountValue ||
            !MinimumOrder ||
            !StartDate ||
            !EndDate ||
            !UsageLimit
        ) {
            return res.status(400).json({
                message: "Vui lòng điền đầy đủ thông tin bắt buộc",
            });
        }

        const promotion = await db.Promotion.create({
            ...req.body,
            UsageCount: 0,
        });

        res.status(201).json({
            message: "Tạo khuyến mãi thành công",
            promotion,
        });
    } catch (error) {
        console.error("Error in createPromotion:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                message: "Mã khuyến mãi đã tồn tại",
                error: error.message,
            });
        }
        res.status(500).json({
            message: "Lỗi khi tạo khuyến mãi",
            error: error.message,
        });
    }
};

// Cập nhật khuyến mãi
exports.updatePromotion = async (req, res) => {
    try {
        const promotion = await db.Promotion.findByPk(req.params.id);
        if (!promotion) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy khuyến mãi" });
        }
        await promotion.update(req.body);
        res.json({
            message: "Cập nhật khuyến mãi thành công",
            promotion,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật khuyến mãi",
            error: error.message,
        });
    }
};

// Xóa khuyến mãi
exports.deletePromotion = async (req, res) => {
    try {
        const promotion = await db.Promotion.findByPk(req.params.id);
        if (!promotion) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy khuyến mãi" });
        }
        await promotion.destroy();
        res.json({ message: "Xóa khuyến mãi thành công" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa khuyến mãi",
            error: error.message,
        });
    }
};

// Thêm function mới
exports.applyPromotion = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;

        const promotion = await db.Promotion.findOne({
            where: {
                Code: code,
                Status: true,
                StartDate: {
                    [Op.lte]: new Date(),
                },
                EndDate: {
                    [Op.gte]: new Date(),
                },
                UsageCount: {
                    [Op.lt]: db.sequelize.col("UsageLimit"),
                },
            },
        });

        if (!promotion) {
            return res.status(400).json({
                success: false,
                message: "Mã giảm giá không hợp lệ hoặc đã hết hạn",
            });
        }

        if (orderTotal < promotion.MinimumOrder) {
            return res.status(400).json({
                success: false,
                message: `Đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(promotion.MinimumOrder)}`,
            });
        }

        // Tăng UsageCount lên 1
        await promotion.increment("UsageCount");

        // Lấy dữ liệu mới sau khi cập nhật
        const updatedPromotion = await promotion.reload();

        res.json({
            success: true,
            promotion: updatedPromotion,
        });
    } catch (error) {
        console.error("Error in applyPromotion:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi áp dụng mã giảm giá",
        });
    }
};

exports.decreaseUsage = async (req, res) => {
    try {
        const promotion = await db.Promotion.findByPk(req.params.id);

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khuyến mãi",
            });
        }

        if (promotion.UsageCount > 0) {
            await promotion.decrement("UsageCount");
        }

        res.json({
            success: true,
            message: "Đã cập nhật số lượng sử dụng",
        });
    } catch (error) {
        console.error("Error in decreaseUsage:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật số lượng sử dụng",
        });
    }
};
