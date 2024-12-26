const express = require("express");
const {
    createProduct,
    getProducts,
    addColor,
    addVariant,
} = require("../controllers/productController");
const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.post('/:productID/colors', addColor);
router.post('/:productID/variants', addVariant);

module.exports = router;
