const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middlewares/auth");

// Tất cả các routes đều yêu cầu đăng nhập
router.use(authenticateToken);

// Lấy giỏ hàng của user
router.get("/", cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", cartController.addToCart);

// Cập nhật số lượng hoặc trạng thái sản phẩm trong giỏ hàng
router.put("/:cartId", cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:cartId", cartController.removeFromCart);

module.exports = router;
