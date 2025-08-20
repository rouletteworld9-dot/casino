// routes/adminUserRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  deleteUser
} = require("../controllers/adminUserController");
const adminOnly = require("../middlewares/adminOnly");

// All routes require authentication & admin role
router.use(adminOnly);

router.get("/", getAllUsers);
router.put("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;
