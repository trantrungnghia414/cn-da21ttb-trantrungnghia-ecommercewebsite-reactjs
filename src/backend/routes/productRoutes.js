const express = require("express");
const {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts)
router.delete("/:slug", getProduct);
router.delete("/:slug", deleteProduct);

module.exports = router;
