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

// update/cancel appointment (supports both put for api and post for standard html forms)
router.put("/:id", protect, updateAppointment);
router.post("/:id/update", protect, updateAppointment);

// delete/cancel appointment (supports both delete for api and post for standard html forms)
router.delete("/:id", protect, deleteAppointment);
router.post("/:id/delete", protect, deleteAppointment);

module.exports = router;