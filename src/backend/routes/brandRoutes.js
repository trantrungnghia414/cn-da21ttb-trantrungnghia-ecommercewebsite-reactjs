const express = require("express");
const {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
} = require("../controllers/brandController");
const router = express.Router();

router.post("/", createBrand);
router.get("/", getBrands);
router.get("/:slug", getBrand);
router.put("/:slug", updateBrand);
router.delete("/:slug", deleteBrand);

module.exports = router;
