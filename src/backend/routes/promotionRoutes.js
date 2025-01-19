const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const { authenticateToken, authorizeAdmin } = require("../middlewares/auth");

// Route áp dụng mã giảm giá - chỉ cần authenticateToken
router.post("/apply", authenticateToken, promotionController.applyPromotion);

// Các routes quản lý khuyến mãi - cần cả authenticateToken và authorizeAdmin
router.use(authenticateToken);
router.use(authorizeAdmin);

router.get("/", promotionController.getPromotions);
router.get("/:id", promotionController.getPromotionById);
router.post("/", promotionController.createPromotion);
router.put("/:id", promotionController.updatePromotion);
router.delete("/:id", promotionController.deletePromotion);

// Route giảm UsageCount khi hủy mã giảm giá
router.post(
    "/:id/decrease-usage",
    authenticateToken,
    promotionController.decreaseUsage
);

module.exports = router;
