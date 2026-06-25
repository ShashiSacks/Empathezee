const express = require("express");
const router = express.Router();
const { renderAppointmentChat, getCommunityChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/sessionMiddleware");

// Render telehealth direct consult room (Web Page)
router.get("/appointment/:appointmentId", protect, renderAppointmentChat);

// Get community support group chat logs (JSON API)
router.get("/community/:communityId", protect, getCommunityChatHistory);

module.exports = router;
