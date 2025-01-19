const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeAdmin } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const db = require("../models");

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

router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, userController.updateProfile);
router.put(
    "/change-password",
    authenticateToken,
    userController.changePassword
);

router.delete("/account", authenticateToken, userController.deleteAccount);

router.get(
    "/latest-address",
    authenticateToken,
    userController.getLatestShippingAddress
);

router.get("/:id", authenticateToken, userController.getUserById);

module.exports = router;
