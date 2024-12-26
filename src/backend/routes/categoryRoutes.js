const express = require("express");
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:slug", getCategory);
router.put("/:slug", updateCategory);
router.delete("/:slug", deleteCategory);

module.exports = router;
