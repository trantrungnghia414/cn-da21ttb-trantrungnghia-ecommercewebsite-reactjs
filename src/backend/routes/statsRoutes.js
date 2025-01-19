const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const { authenticateToken } = require("../middlewares/auth");

router.get("/", authenticateToken, statsController.getStats);
router.get("/revenue", authenticateToken, statsController.getRevenueStats);
router.get(
    "/recent-orders",
    authenticateToken,
    statsController.getRecentOrders
);
router.get("/orders", authenticateToken, statsController.getAllOrders);

module.exports = router;
