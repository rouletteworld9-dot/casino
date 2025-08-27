const express = require("express");
const { getSingleUser} = require("../controllers/userController");
const { getUserBetsHistory } = require("../controllers/userController")

const router = express.Router()
router.get("/bets" , getUserBetsHistory)
router.get("/:id", getSingleUser);



module.exports = router;
