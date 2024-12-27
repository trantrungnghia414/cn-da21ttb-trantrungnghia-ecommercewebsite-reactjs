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
router.get("/:memorySizeID", getMemorySize);
router.put("/:memorySizeID", updateMemorySize);
router.delete("/:memorySizeID", deleteMemorySize);

module.exports = router;
