const db = require("../models");

// Tạo kích thước bộ nhớ mới
exports.createMemorySize = async (req, res) => {
    try {
        const { MemorySize, CategoryID } = req.body;
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
        const memorySizes = await db.MemorySize.findAll();
        res.json(memorySizes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy kích thước bộ nhớ theo ID
exports.getMemorySize = async (req, res) => {
    try {
        const memorySize = await db.MemorySize.findOne({
            where: { MemorySizeID: req.params.memorySizeID },
        });
        if (memorySize) {
            res.json(memorySize);
        } else {
            res.status(404).json({ error: "Kích thước bộ nhớ không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật kích thước bộ nhớ
exports.updateMemorySize = async (req, res) => {
    try {
        const memorySize = await db.MemorySize.findOne({
            where: { MemorySizeID: req.params.memorySizeID },
        });
        if (memorySize) {
            const { MemorySize, CategoryID } = req.body;
            await memorySize.update({ MemorySize, CategoryID });
            res.json(memorySize);
        } else {
            res.status(404).json({ error: "Kích thước bộ nhớ không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa kích thước bộ nhớ
exports.deleteMemorySize = async (req, res) => {
    try {
        const memorySize = await db.MemorySize.findOne({
            where: { MemorySizeID: req.params.memorySizeID },
        });
        if (memorySize) {
            await memorySize.destroy();
            res.json({ message: "Kích thước bộ nhớ đã được xóa" });
        } else {
            res.status(404).json({ error: "Kích thước bộ nhớ không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
