const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/return_payment", orderController.returnPayment);

module.exports = router;
