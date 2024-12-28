const express = require("express");
const {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
} = require("../controllers/productController");
const router = express.Router();
const upload = require('../middlewares/multer'); // Import multer


// Route to create a product with images
router.post('/', upload.array('images', 10), createProduct);
// router.post("/", createProduct);
router.get("/", getProducts)
router.delete("/:slug", getProduct);
router.delete("/:slug", deleteProduct);



module.exports = router;
