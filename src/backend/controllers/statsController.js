const db = require("../models");
const { Op } = require("sequelize");

exports.getStats = async (req, res) => {
    try {
        // Đổi từ 1 phút thành 1 giờ
        const now = new Date();
        const lastHour = new Date(now.getTime() - 60 * 60 * 1000); // 1 giờ = 60 * 60 * 1000 ms

        // Tính tổng doanh thu
        const totalRevenue = await db.Order.sum("TotalAmount", {
            where: {
                OrderStatus: "Delivered",
                PaymentStatus: "Completed",
            },
            raw: true,
        });

        // Tính doanh thu 1 giờ gần đây
        const currentRevenue = await db.Order.sum("TotalAmount", {
            where: {
                OrderStatus: "Delivered",
                PaymentStatus: "Completed",
                createdAt: {
                    [Op.between]: [lastHour, now],
                },
            },
            raw: true,
        });

        // Tính doanh thu 1 giờ trước đó
        const previousRevenue = await db.Order.sum("TotalAmount", {
            where: {
                OrderStatus: "Delivered",
                PaymentStatus: "Completed",
                createdAt: {
                    [Op.between]: [
                        new Date(lastHour.getTime() - 60 * 60 * 1000),
                        lastHour,
                    ],
                },
            },
            raw: true,
        });

        // Tương tự cho orders, customers và products
        const totalOrders = await db.Order.count();
        const currentOrders = await db.Order.count({
            where: {
                createdAt: {
                    [Op.between]: [lastHour, now],
                },
            },
        });
        const previousOrders = await db.Order.count({
            where: {
                createdAt: {
                    [Op.between]: [
                        new Date(lastHour.getTime() - 60 * 60 * 1000),
                        lastHour,
                    ],
                },
            },
        });

        // Tương tự cho customers
        const totalCustomers = await db.User.count({
            where: { Role: "customer" },
        });
        const currentCustomers = await db.User.count({
            where: {
                Role: "customer",
                createdAt: {
                    [Op.between]: [lastHour, now],
                },
            },
        });
        const previousCustomers = await db.User.count({
            where: {
                Role: "customer",
                createdAt: {
                    [Op.between]: [
                        new Date(lastHour.getTime() - 60 * 60 * 1000),
                        lastHour,
                    ],
                },
            },
        });

        // Và products
        const totalProducts = await db.Product.count();
        const currentProducts = await db.Product.count({
            where: {
                createdAt: {
                    [Op.between]: [lastHour, now],
                },
            },
        });
        const previousProducts = await db.Product.count({
            where: {
                createdAt: {
                    [Op.between]: [
                        new Date(lastHour.getTime() - 60 * 60 * 1000),
                        lastHour,
                    ],
                },
            },
        });

        // Tính % thay đổi
        const calculateChange = (current, previous) => {
            if (previous === 0) return 0;
            return ((current - previous) / previous) * 100;
        };

        const revenueChange = calculateChange(
            Number(currentRevenue) || 0,
            Number(previousRevenue) || 0
        );
        const ordersChange = calculateChange(currentOrders, previousOrders);
        const customersChange = calculateChange(
            currentCustomers,
            previousCustomers
        );
        const productsChange = calculateChange(
            currentProducts,
            previousProducts
        );

        res.json({
            totalRevenue: Number(totalRevenue) || 0,
            totalOrders: totalOrders || 0,
            totalCustomers: totalCustomers || 0,
            totalProducts: totalProducts || 0,
            revenueChange: Number(revenueChange.toFixed(1)),
            ordersChange: Number(ordersChange.toFixed(1)),
            customersChange: Number(customersChange.toFixed(1)),
            productsChange: Number(productsChange.toFixed(1)),
        });
    } catch (error) {
        console.error("Error in getStats:", error);
        res.status(500).json({
            error: "Lỗi khi tính toán thống kê",
            details: error.message,
        });
    }
};

// Thêm endpoint mới để lấy dữ liệu doanh thu theo tháng
exports.getRevenueStats = async (req, res) => {
    try {
        const now = new Date();
        const revenueData = [];

        // Lấy dữ liệu cho 12 tháng gần nhất
        for (let i = 0; i < 12; i++) {
            const endDate = new Date(
                now.getFullYear(),
                now.getMonth() - i + 1,
                0
            );
            const startDate = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );

            const monthlyRevenue = await db.Order.sum("TotalAmount", {
                where: {
                    OrderStatus: "Delivered",
                    PaymentStatus: "Completed",
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                raw: true,
            });

            revenueData.push({
                month:
                    now.getMonth() - i + 1 <= 0
                        ? now.getMonth() - i + 13
                        : now.getMonth() - i + 1,
                revenue: Number(monthlyRevenue) || 0,
            });
        }

        // Sắp xếp theo thứ tự tháng tăng dần
        revenueData.sort((a, b) => a.month - b.month);

        res.json(revenueData);
    } catch (error) {
        console.error("Error in getRevenueStats:", error);
        res.status(500).json({
            error: "Lỗi khi tính toán doanh thu",
            details: error.message,
        });
    }
};

// Thêm endpoint để lấy đơn hàng gần đây
exports.getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await db.Order.findAll({
            limit: 5, // Lấy 5 đơn hàng gần nhất
            order: [["createdAt", "DESC"]], // Sắp xếp theo thời gian mới nhất
            include: [
                {
                    model: db.User,
                    attributes: ["FullName", "Email"],
                },
            ],
            where: {
                OrderStatus: {
                    [Op.not]: "Cancelled", // Không lấy đơn hàng đã hủy
                },
            },
        });

        // Log để debug
        console.log("Recent orders:", recentOrders);

        res.json(recentOrders);
    } catch (error) {
        console.error("Error in getRecentOrders:", error);
        res.status(500).json({
            error: "Lỗi khi lấy đơn hàng gần đây",
            details: error.message,
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            include: [
                {
                    model: db.User,
                    attributes: ["UserID", "FullName", "Email"],
                },
            ],
            order: [["OrderDate", "DESC"]],
        });
        res.json(orders);
    } catch (error) {
        console.error("Error getting all orders:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
