const Appointment = require("../models/Appointment");
const Message = require("../models/Message");
const User = require("../models/User");


// render private direct telehealth chat page
const renderAppointmentChat = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const appointment = await Appointment.findById(appointmentId)
            .populate("patient", "username email role")
            .populate("doctor", "username email role disease");

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }

        const currentUserId = req.user.id || req.user._id;

        // check permission
        const isPatient = appointment.patient._id.toString() === currentUserId.toString();
        const isDoctor = appointment.doctor._id.toString() === currentUserId.toString();

        if (!isPatient && !isDoctor) {
            return res.status(403).send("Unauthorized to join this consult session.");
        }

        // fetch past messages
        const messages = await Message.find({ appointment: appointmentId })
            .populate("sender", "username role")
            .sort({ createdAt: 1 });

        const otherUser = isPatient ? appointment.doctor : appointment.patient;

        res.render("chats/index", {
            appointment,
            messages,
            otherUser,
            title: `Consultation with Dr. ${appointment.doctor.username}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading chat session");
    }
};


// retrieve community chat message history
const getCommunityChatHistory = async (req, res) => {
    try {
        const communityId = req.params.communityId;
        const messages = await Message.find({ community: communityId })
            .populate("sender", "username role")
            .sort({ createdAt: 1 })
            .limit(100);

        res.status(200).json(messages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading community chat logs" });
    }
};

module.exports = {
    renderAppointmentChat,
    getCommunityChatHistory
};
