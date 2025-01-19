const db = require("../models");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ["PasswordHash"] },
        });
        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await db.User.findByPk(id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        await user.update({ Status: status });
        res.json({ message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.User.findByPk(id);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        await user.destroy();
        res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id, {
            attributes: [
                "UserID",
                "FullName",
                "Email",
                "PhoneNumber",
                "Address",
            ],
        });
        res.json(user);
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { FullName, PhoneNumber, Address } = req.body;
        const user = await db.User.findByPk(req.user.id);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        await user.update({
            FullName,
            PhoneNumber,
            Address,
        });

        // Trả về thông tin user đã cập nhật
        const updatedUser = await db.User.findByPk(req.user.id, {
            attributes: [
                "UserID",
                "FullName",
                "Email",
                "PhoneNumber",
                "Address",
            ],
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { CurrentPassword, NewPassword } = req.body;
        const user = await db.User.findByPk(req.user.id, {
            attributes: [
                "UserID",
                "FullName",
                "Email",
                "PasswordHash",
                "PhoneNumber",
                "Address",
                "Role",
                "Status",
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        // Kiểm tra mật khẩu hiện tại với PasswordHash
        const isValidPassword = await bcrypt.compare(
            CurrentPassword,
            user.PasswordHash
        );
        if (!isValidPassword) {
            return res
                .status(400)
                .json({ message: "Mật khẩu hiện tại không đúng" });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(NewPassword, 10);

        // Cập nhật PasswordHash
        await user.update({ PasswordHash: hashedPassword });

        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { Password } = req.body;
        console.log("1. Bắt đầu xóa tài khoản với user ID:", req.user.id);

        const user = await db.User.findByPk(req.user.id, {
            attributes: [
                "UserID",
                "FullName",
                "Email",
                "PasswordHash",
                "Role",
                "Status",
            ],
        });
        console.log("2. Tìm thấy user:", user ? "Có" : "Không");

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        // Kiểm tra mật khẩu
        const isValidPassword = await bcrypt.compare(
            Password,
            user.PasswordHash
        );
        console.log("3. Mật khẩu hợp lệ:", isValidPassword ? "Có" : "Không");

        if (!isValidPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }

        // Bắt đầu transaction
        const transaction = await db.sequelize.transaction();
        console.log("4. Bắt đầu transaction");

        try {
            // 1. Xóa các đơn hàng chi tiết (OrderDetails)
            const orderDetailsResult = await db.OrderDetail.destroy({
                where: {
                    OrderID: {
                        [db.Sequelize.Op.in]: db.Sequelize.literal(
                            `SELECT OrderID FROM Orders WHERE UserID = ${user.UserID}`
                        ),
                    },
                },
                transaction,
            });
            console.log(
                "5. Đã xóa OrderDetails:",
                orderDetailsResult,
                "bản ghi"
            );

            // 2. Xóa các đơn hàng
            const ordersResult = await db.Order.destroy({
                where: { UserID: user.UserID },
                transaction,
            });
            console.log("6. Đã xóa Orders:", ordersResult, "bản ghi");

            // 3. Xóa giỏ hàng
            const cartResult = await db.Cart.destroy({
                where: { UserID: user.UserID },
                transaction,
            });
            console.log("7. Đã xóa Cart:", cartResult, "bản ghi");

            // 4. Xóa đánh giá sản phẩm
            const reviewResult = await db.Review.destroy({
                where: { UserID: user.UserID },
                transaction,
            });
            console.log("8. Đã xóa Reviews:", reviewResult, "bản ghi");

            // 5. Xóa địa chỉ giao hàng
            const addressResult = await db.ShippingAddress.destroy({
                where: { UserID: user.UserID },
                transaction,
            });
            console.log("9. Đã xóa ShippingAddress:", addressResult, "bản ghi");

            // 6. Xóa thông báo
            const notificationResult = await db.Notification.destroy({
                where: { UserID: user.UserID },
                transaction,
            });
            console.log(
                "10. Đã xóa Notifications:",
                notificationResult,
                "bản ghi"
            );

            // 7. Xóa tài khoản người dùng
            const userResult = await user.destroy({ transaction });
            console.log(
                "11. Đã xóa User:",
                userResult ? "Thành công" : "Thất bại"
            );

            // Commit transaction
            await transaction.commit();
            console.log("12. Transaction đã được commit thành công");

            res.json({ message: "Tài khoản đã được xóa thành công" });
        } catch (error) {
            // Rollback nếu có lỗi
            await transaction.rollback();
            console.error("13. Lỗi trong transaction:", {
                message: error.message,
                stack: error.stack,
                sql: error.sql, // Nếu là lỗi SQL
                parameters: error.parameters, // Nếu có parameters
            });
            throw error;
        }
    } catch (error) {
        console.error("14. Lỗi tổng thể:", {
            message: error.message,
            stack: error.stack,
            sql: error.sql,
            parameters: error.parameters,
        });
        res.status(500).json({
            message: "Lỗi server khi xóa tài khoản",
            error: error.message,
            details:
                process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
        });
    }
};

exports.getLatestShippingAddress = async (req, res) => {
    try {
        // Tìm đơn hàng gần nhất của user
        const latestOrder = await db.Order.findOne({
            where: { UserID: req.user.id },
            order: [["OrderDate", "DESC"]],
            attributes: [
                "ShippingAddress",
                "ShippingPhone",
                "ProvinceCode",
                "DistrictCode",
                "WardCode",
                "ProvinceName",
                "DistrictName",
                "WardName",
            ],
        });

        // Nếu không có đơn hàng, trả về thông tin trống
        if (!latestOrder) {
            return res.json({
                address: "",
                phone: "",
                provinceCode: "",
                provinceName: "",
                districtCode: "",
                districtName: "",
                wardCode: "",
                wardName: "",
            });
        }

        // Tách địa chỉ cụ thể từ ShippingAddress
        const fullAddress = latestOrder.ShippingAddress;
        const addressParts = fullAddress.split(", ");
        const specificAddress = addressParts[0]; // Phần địa chỉ cụ thể nằm ở đầu chuỗi

        res.json({
            address: specificAddress,
            phone: latestOrder.ShippingPhone,
            provinceCode: latestOrder.ProvinceCode,
            provinceName: latestOrder.ProvinceName,
            districtCode: latestOrder.DistrictCode,
            districtName: latestOrder.DistrictName,
            wardCode: latestOrder.WardCode,
            wardName: latestOrder.WardName,
        });
    } catch (error) {
        console.error("Error getting latest shipping address:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id, {
            attributes: [
                "UserID",
                "FullName",
                "Email",
                "PhoneNumber",
                "Address",
            ], // Chỉ lấy các trường cần thiết
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
