const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeAdmin } = require("../middlewares/auth");

router.get("/", authenticateToken, authorizeAdmin, userController.getAllUsers);
router.patch(
    "/:id/status",
    authenticateToken,
    authorizeAdmin,
    userController.updateUserStatus
);
router.delete(
    "/:id",
    authenticateToken,
    authorizeAdmin,
    userController.deleteUser
);

module.exports = router;
