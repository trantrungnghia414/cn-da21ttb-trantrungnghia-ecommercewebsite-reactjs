const db = require("../models");

exports.createCategory = async (req, res) => {
    try {
        const { Name, Slug, Description } = req.body;
        const category = await db.Category.create({
            Name,
            Slug,
            Description,
        });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            error: "Lỗi khi tạo danh mục",
            details: error.message,
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        console.log("Getting categories...");
        const categories = await db.Category.findAll({
            order: [["CreatedAt", "DESC"]],
        });
        console.log("Categories found:", categories.length);
        res.json(categories);
    } catch (error) {
        console.error("Error getting categories:", error);
        res.status(500).json({
            error: "Lỗi khi lấy danh sách danh mục",
            details: error.message,
        });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await db.Category.findOne({
            where: { Slug: req.params.slug },
        });
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ error: "Không tìm thấy danh mục" });
        }
    } catch (error) {
        console.error("Error getting category:", error);
        res.status(500).json({
            error: "Lỗi khi lấy thông tin danh mục",
            details: error.message,
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const oldSlug = req.params.slug;
        const { Name, Description } = req.body;

        // Tạo slug mới từ tên mới
        const newSlug = Name.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const category = await db.Category.findOne({
            where: { Slug: oldSlug },
        });

        if (category) {
            await category.update({
                Name,
                Slug: newSlug,
                Description,
            });
            res.json(category);
        } else {
            res.status(404).json({ error: "Không tìm thấy danh mục" });
        }
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            error: "Lỗi khi cập nhật danh mục",
            details: error.message,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await db.Category.findOne({
            where: { Slug: req.params.slug },
        });

        if (!category) {
            return res.status(404).json({ error: "Không tìm thấy danh mục" });
        }

        // Kiểm tra xem danh mục có sản phẩm không
        const productsCount = await db.Product.count({
            where: { CategoryID: category.CategoryID },
        });

        if (productsCount > 0) {
            return res.status(400).json({
                error: "Không thể xóa danh mục này vì đang có sản phẩm liên kết",
            });
        }

        await category.destroy();
        res.json({ message: "Xóa danh mục thành công" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            error: "Lỗi khi xóa danh mục",
            details: error.message,
        });
    }
};
