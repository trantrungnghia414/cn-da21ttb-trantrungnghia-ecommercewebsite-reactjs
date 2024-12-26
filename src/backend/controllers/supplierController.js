const db = require("../models");

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await db.Supplier.findAll();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const { Name, ContactInfo } = req.body;
        const supplier = await db.Supplier.create({ Name, ContactInfo });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await db.Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const { Name, ContactInfo } = req.body;
        const supplier = await db.Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        supplier.Name = Name;
        supplier.ContactInfo = ContactInfo;
        await supplier.save();
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await db.Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        await supplier.destroy();
        res.status(204).json({ message: "Supplier deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};