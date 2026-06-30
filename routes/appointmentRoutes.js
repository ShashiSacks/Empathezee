const express = require("express");
const router = express.Router();

const {
    bookAppointment,
    getMyAppointments,
    updateAppointment,
    deleteAppointment
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/sessionMiddleware");

// get all user appointments
router.get("/", protect, getMyAppointments);

// book a new appointment
router.post("/", protect, bookAppointment);

// update appointment (supports PUT for API and POST for HTML forms)
router.put("/:id", protect, updateAppointment);
router.post("/:id/update", protect, updateAppointment);

// delete / cancel appointment (supports DELETE for API and POST for HTML forms)
router.delete("/:id", protect, deleteAppointment);
router.post("/:id/delete", protect, deleteAppointment);

module.exports = router;