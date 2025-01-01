const db = require("../models");

exports.createBrand = async (req, res) => {
    try {
        const { Name, Slug, Description } = req.body;
        const brand = await db.Brand.create({ Name, Slug, Description });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBrands = async (req, res) => {
    try {
        console.log("Getting brands...");
        const brands = await db.Brand.findAll({
            order: [["CreatedAt", "DESC"]],
        });
        console.log("Brands found:", brands.length);
        res.json(brands);
    } catch (error) {
        console.error("Error getting brands:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getBrand = async (req, res) => {
    try {
        const brand = await db.Brand.findOne({
            where: { Slug: req.params.slug },
        });
        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ error: "Thương hiệu không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const brand = await db.Brand.findOne({
            where: { Slug: req.params.slug },
        });
        if (brand) {
            const { Name, Slug, Description } = req.body;
            await brand.update({ Name, Slug, Description });
            res.json(brand);
        } else {
            res.status(404).json({ error: "Thương hiệu không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const brand = await db.Brand.findOne({
            where: { Slug: req.params.slug },
        });
        if (brand) {
            await brand.destroy();
            res.json({ message: "Thương hiệu đã được xóa" });
        } else {
            res.status(404).json({ error: "Thương hiệu không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
