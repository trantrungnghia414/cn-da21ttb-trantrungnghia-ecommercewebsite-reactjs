const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', [verifyToken, isAdmin], productController.createProduct);
router.put('/:id', [verifyToken, isAdmin], productController.updateProduct);
router.delete('/:id', [verifyToken, isAdmin], productController.deleteProduct);

module.exports = router;