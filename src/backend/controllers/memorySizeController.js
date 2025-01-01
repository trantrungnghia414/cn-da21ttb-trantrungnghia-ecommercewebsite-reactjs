const db = require("../models");

// Tạo kích thước bộ nhớ mới
exports.createMemorySize = async (req, res) => {
    try {
        const { MemorySize, CategoryID } = req.body;

        // Kiểm tra trùng lặp
        const existingMemorySize = await db.MemorySize.findOne({
            where: {
                MemorySize: MemorySize,
                CategoryID: CategoryID,
            },
        });

        if (existingMemorySize) {
            return res.status(409).json({
                error: "Dung lượng này đã tồn tại trong danh mục đã chọn",
            });
        }

        const memorySize = await db.MemorySize.create({
            MemorySize,
            CategoryID,
        });
        res.status(201).json(memorySize);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy tất cả kích thước bộ nhớ
exports.getMemorySizes = async (req, res) => {
    try {
        console.log("Getting memory sizes...");
        const memorySizes = await db.MemorySize.findAll({
            include: [
                {
                    model: db.Category,
                    attributes: ["CategoryID", "Name"],
                    as: "Category",
                },
            ],
            order: [["CreatedAt", "DESC"]],
        });
        console.log("Memory sizes found:", memorySizes.length);
        res.json(memorySizes);
    } catch (error) {
        console.error("Error getting memory sizes:", error);
        res.status(500).json({
            error: "Lỗi khi lấy danh sách dung lượng",
            details: error.message,
        });
    }
};

// Lấy kích thước bộ nhớ theo ID
exports.getMemorySize = async (req, res) => {
    try {
        const memorySize = await db.MemorySize.findByPk(req.params.id, {
            include: [
                {
                    model: db.Category,
                    attributes: ["CategoryID", "Name"],
                    as: "Category",
                },
            ],
        });
        if (memorySize) {
            res.json(memorySize);
        } else {
            res.status(404).json({ error: "Không tìm thấy dung lượng" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật kích thước bộ nhớ
exports.updateMemorySize = async (req, res) => {
    try {
        const { MemorySize, CategoryID } = req.body;

        // Kiểm tra memory size tồn tại
        const memorySize = await db.MemorySize.findByPk(req.params.id);
        if (!memorySize) {
            return res.status(404).json({ error: "Không tìm thấy dung lượng" });
        }

        // Kiểm tra category tồn tại
        const category = await db.Category.findByPk(CategoryID);
        if (!category) {
            return res.status(404).json({ error: "Danh mục không tồn tại" });
        }

        // Kiểm tra trùng lặp, loại trừ bản ghi hiện tại
        const existingMemorySize = await db.MemorySize.findOne({
            where: {
                MemorySize: MemorySize,
                CategoryID: CategoryID,
                MemorySizeID: {
                    [db.Sequelize.Op.ne]: req.params.id,
                },
            },
        });

        if (existingMemorySize) {
            return res.status(409).json({
                error: "Dung lượng này đã tồn tại trong danh mục đã chọn",
            });
        }

        // Cập nhật
        await memorySize.update({ 
            MemorySize, 
            CategoryID 
        });

        // Trả về dữ liệu đã cập nhật kèm theo thông tin Category
        const updatedMemorySize = await db.MemorySize.findByPk(req.params.id, {
            include: [
                {
                    model: db.Category,
                    attributes: ["CategoryID", "Name"],
                    as: "Category",
                },
            ],
        });

        res.json(updatedMemorySize);
    } catch (error) {
        console.error("Update memory size error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Xóa kích thước bộ nhớ
exports.deleteMemorySize = async (req, res) => {
    try {
        const memorySize = await db.MemorySize.findByPk(req.params.id);
        if (memorySize) {
            await memorySize.destroy();
            res.json({ message: "Xóa dung lượng thành công" });
        } else {
            res.status(404).json({ error: "Không tìm thấy dung lượng" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
