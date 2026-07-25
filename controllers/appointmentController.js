const User = require("../models/User");

// book appointment
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, doctorName, date, time } = req.body;

        if (!date || !time) {
            return res.status(400).json({ message: "Date and time are required to book consultation." });
        }

        let assignedDoctorId = doctorId;

        // If doctorId is missing or not a valid 24-char ObjectId, find or create doctor user
        if (!assignedDoctorId || !assignedDoctorId.toString().match(/^[0-9a-fA-F]{24}$/)) {
            const anyDoc = await User.findOne({ role: "doctor" });
            if (anyDoc) {
                assignedDoctorId = anyDoc._id;
            } else {
                const defaultDoc = await User.create({
                    username: doctorName || "Medical Specialist",
                    email: `doctor_${Date.now()}@empathezee.com`,
                    password: "defaultpassword123",
                    role: "doctor",
                    disease: "General Medicine"
                });
                assignedDoctorId = defaultDoc._id;
            }
        }

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: assignedDoctorId,
            date,
            time,
            status: "CONFIRMED"
        });

        const populatedAppointment = await Appointment.findById(appointment._id).populate("doctor", "username email disease city");

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment: populatedAppointment || appointment
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
        .populate("doctor", "username email disease city")
        .sort({ date: 1, time: 1 });

        const doctors = await User.find({ role: "doctor" }).select("-password");

        res.status(200).json({ appointments, doctors });

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