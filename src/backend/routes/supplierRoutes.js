const express = require("express");
const {
    getAllSuppliers,
    createSupplier,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplierController");
const router = express.Router();

router.get("/", getAllSuppliers);
router.post("/", createSupplier);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;