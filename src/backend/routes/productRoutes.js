const express = require("express");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const router = express.Router();
const { upload, handleFileUpload } = require("../middlewares/multer");

// Cấu hình multer để xử lý cả thumbnail và product images
const uploadFields = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 50 },
]);

// Route to create a product with images
router.post("/", uploadFields, handleFileUpload, createProduct);

// Get all products
router.get("/", getProducts);

// Get single product by slug
router.get("/:slug", getProduct);

// Update product
router.put("/:slug", uploadFields, handleFileUpload, updateProduct);

// Delete product by slug
router.delete("/:slug", deleteProduct);

module.exports = router;
