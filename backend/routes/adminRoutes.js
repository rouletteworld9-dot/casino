// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { forceResult } = require("../controllers/adminController");
const adminOnly = require("../middlewares/adminOnly");


router.post("/force-result", adminOnly, forceResult);

module.exports = router;
