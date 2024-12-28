const express = require("express");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const router = express.Router();
const upload = require("../middlewares/multer");

// Route to create a product with images
router.post("/", upload.array("images", 30), createProduct);

// Get all products
router.get("/", getProducts);

// Get single product by slug
router.get("/:slug", getProduct);

// Update product
router.put("/:slug", upload.array("images", 30), updateProduct);

// Delete product by slug
router.delete("/:slug", deleteProduct);

module.exports = router;
