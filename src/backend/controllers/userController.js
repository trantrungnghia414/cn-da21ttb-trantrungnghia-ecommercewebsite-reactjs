const db = require("../models");

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
