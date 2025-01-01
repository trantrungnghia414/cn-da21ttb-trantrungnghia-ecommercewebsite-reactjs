const express = require("express");
const {
    createMemorySize,
    getMemorySizes,
    getMemorySize,
    updateMemorySize,
    deleteMemorySize,
} = require("../controllers/memorySizeController");
const router = express.Router();

router.get("/", getMemorySizes);
router.post("/", createMemorySize);
router.get("/:id", getMemorySize);
router.put("/:id", updateMemorySize);
router.delete("/:id", deleteMemorySize);

module.exports = router;
