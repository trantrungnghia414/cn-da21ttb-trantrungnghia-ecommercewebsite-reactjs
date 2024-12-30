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

// Cấu hình multer để xử lý cả thumbnail và product images
const uploadFields = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 30 },
]);

// Route to create a product with images
router.post("/", uploadFields, createProduct);

// Get all products
router.get("/", getProducts);

// Get single product by slug
router.get("/:slug", getProduct);

// Update product với thumbnail
const updateUploadFields = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 30 },
]);

// Update product
router.put("/:slug", updateUploadFields, updateProduct);

// Delete product by slug
router.delete("/:slug", deleteProduct);

module.exports = router;
