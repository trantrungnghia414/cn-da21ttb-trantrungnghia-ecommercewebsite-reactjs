const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middlewares/auth");
const { authorizeAdmin } = require("../middlewares/auth");

router.use(authenticateToken);

router.post("/", orderController.createOrder);
router.get("/", authenticateToken, orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.get("/getOrdersByUser", orderController.getOrdersByUser);

router.get("/return_payment", orderController.returnPayment);

router.patch(
    "/:id/status",
    authenticateToken,
    authorizeAdmin,
    orderController.updateOrderStatus
);

module.exports = router;
