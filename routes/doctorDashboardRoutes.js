const express = require("express")
const router = express.Router()

const {
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment
} = require("../controllers/doctorDashboardController")

const { protect } = require("../middleware/sessionMiddleware")

// Doctor views appointments
router.get("/appointments", protect, getDoctorAppointments)

// Accept appointment
router.put("/accept/:id", protect, acceptAppointment)
router.post("/accept/:id", protect, acceptAppointment)

// Reject appointment
router.put("/reject/:id", protect, rejectAppointment)
router.post("/reject/:id", protect, rejectAppointment)

module.exports = router