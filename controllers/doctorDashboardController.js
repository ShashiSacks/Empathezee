const Appointment = require("../models/Appointment");

// Get all appointments for logged-in doctor
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctor: req.user.id
        })
        .populate("patient", "username email")
        .sort({ createdAt: -1 });

        res.status(200).json(appointments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Accept appointment
const acceptAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Not found" });
        }

        appointment.status = "CONFIRMED";
        await appointment.save();

        if (req.accepts('html')) {
            return res.redirect("/doctor/dashboard");
        }

        res.status(200).json({
            message: "Appointment accepted",
            appointment
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Reject appointment
const rejectAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Not found" });
        }

        appointment.status = "CANCELLED";
        await appointment.save();

        if (req.accepts('html')) {
            return res.redirect("/doctor/dashboard");
        }

        res.status(200).json({
            message: "Appointment rejected",
            appointment
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment
};

