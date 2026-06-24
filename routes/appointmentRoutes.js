const express = require("express");
const router = express.Router();

const {
    bookAppointment,
    getMyAppointments,
    updateAppointment,
    deleteAppointment
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/sessionMiddleware");

// Get all user appointments
router.get("/", protect, getMyAppointments);

// Book a new appointment
router.post("/", protect, bookAppointment);

// Update/Cancel appointment (Supports both PUT for API and POST for standard HTML Forms)
router.put("/:id", protect, updateAppointment);
router.post("/:id/update", protect, updateAppointment);

// Delete/Cancel appointment (Supports both DELETE for API and POST for standard HTML Forms)
router.delete("/:id", protect, deleteAppointment);
router.post("/:id/delete", protect, deleteAppointment);

module.exports = router;