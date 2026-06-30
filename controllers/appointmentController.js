const Appointment = require("../models/Appointment");

// book appointment
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: "Doctor, date, and time are required." });
        }

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date,
            time,
            status: "PENDING"
        });

        if (req.accepts("html")) {
            return res.redirect("/appointments-ui");
        }

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Server error booking appointment" });
    }
};

// get my appointments
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patient: req.user._id
        })
        .populate("doctor", "username email")
        .sort({ date: 1, time: 1 });

        res.status(200).json(appointments);

    } catch (error) {
        console.error("Fetch Appointments Error:", error);
        res.status(500).json({ message: "Server error fetching appointments" });
    }
};

// update appointment status / date
const updateAppointment = async (req, res) => {
    try {
        const { status, date, time } = req.body;
        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // only patient or doctor involved can update
        if (appointment.patient.toString() !== req.user._id && appointment.doctor.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to update this appointment" });
        }

        if (status) appointment.status = status;
        if (date) appointment.date = date;
        if (time) appointment.time = time;

        await appointment.save();

        if (req.accepts("html")) {
            return res.redirect("/appointments-ui");
        }

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment
        });

    } catch (error) {
        console.error("Update Appointment Error:", error);
        res.status(500).json({ message: "Server error updating appointment" });
    }
};

// delete / cancel appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // only patient or doctor involved can delete
        if (appointment.patient.toString() !== req.user._id && appointment.doctor.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to delete this appointment" });
        }

        await Appointment.findByIdAndDelete(appointmentId);

        if (req.accepts("html")) {
            return res.redirect("/appointments-ui");
        }

        res.status(200).json({
            message: "Appointment cancelled successfully"
        });

    } catch (error) {
        console.error("Delete Appointment Error:", error);
        res.status(500).json({ message: "Server error cancelling appointment" });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointment,
    deleteAppointment
};