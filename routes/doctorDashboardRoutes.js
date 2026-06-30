const express = require("express");
const router = express.Router();

const {
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment
} = require("../controllers/doctorDashboardController");

const { protect } = require("../middleware/sessionMiddleware");

// doctor views appointments
router.get("/appointments", protect, getDoctorAppointments);

// accept appointment
router.put("/accept/:id", protect, acceptAppointment);
router.post("/accept/:id", protect, acceptAppointment);

// reject appointment
router.put("/reject/:id", protect, rejectAppointment);
router.post("/reject/:id", protect, rejectAppointment);

module.exports = router;