const db = require("../models");

exports.getSuppliers = async (req, res) => {
    try {
        console.log("Getting suppliers...");
        const suppliers = await db.Supplier.findAll({
            order: [["CreatedAt", "DESC"]],
        });
        console.log("Suppliers found:", suppliers.length);
        res.json(suppliers);
    } catch (error) {
        console.error("Error getting suppliers:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplier = async (req, res) => {
    try {
        const supplier = await db.Supplier.findByPk(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ error: "Nhà cung cấp không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const { Name, ContactInfo } = req.body;
        const supplier = await db.Supplier.create({
            Name,
            ContactInfo,
        });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await db.Supplier.findByPk(req.params.id);
        if (supplier) {
            const { Name, ContactInfo } = req.body;
            await supplier.update({ Name, ContactInfo });
            res.json(supplier);
        } else {
            res.status(404).json({ error: "Nhà cung cấp không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await db.Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.destroy();
            res.json({ message: "Nhà cung cấp đã được xóa" });
        } else {
            res.status(404).json({ error: "Nhà cung cấp không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
