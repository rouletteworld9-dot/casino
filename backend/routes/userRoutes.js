const express = require("express");
const { getSingleUser, getUserBetsHistory } = require("../controllers/userController");

const router = express.Router()

router.get("/:id", getSingleUser);
router.get("/bets", getUserBetsHistory)

module.exports = router;
