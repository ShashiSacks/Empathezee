const express = require("express");
const router = express.Router();
const { renderAppointmentChat, getCommunityChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/sessionMiddleware");

// render telehealth direct consult room
router.get("/appointment/:appointmentId", protect, renderAppointmentChat);

// get community support group chat history
router.get("/chat/community/:communityId", protect, getCommunityChatHistory);

module.exports = router;
