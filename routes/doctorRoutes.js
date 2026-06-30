const express = require("express");
const router = express.Router();

const { verifyPost } = require("../controllers/doctorController");
const { protectDoctor } = require("../middleware/sessionMiddleware");


// doctor verifies post
router.post("/verify/:id", protectDoctor, verifyPost);

module.exports = router;
