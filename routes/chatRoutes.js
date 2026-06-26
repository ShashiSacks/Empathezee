const express = require("express");
const router = express.Router();
const { renderAppointmentChat, getCommunityChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/sessionMiddleware");

// render telehealth direct consult room (web page)
router.get("/appointment/:appointmentId", protect, renderAppointmentChat);

// get community support group chat logs (json api)
router.get("/community/:communityId", protect, getCommunityChatHistory);

module.exports = router;
