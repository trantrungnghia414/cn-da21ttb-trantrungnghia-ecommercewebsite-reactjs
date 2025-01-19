const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");

router.get("/provinces", shippingController.getProvinces);
router.get("/districts/:provinceCode", shippingController.getDistricts);
router.get("/wards/:districtCode", shippingController.getWards);
router.post("/calculate-fee", shippingController.calculateFee);

module.exports = router;
