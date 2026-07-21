require("dotenv").config();

const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

// app setup

const app = express();
const server = http.createServer(app);
const io = new Server(server);


// middleware

const sessionMiddleware = require("./middleware/sessionMiddleware");
const { protectUser, protectDoctor, protect } = require("./middleware/sessionMiddleware");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./utils/logger");


// security + logging

const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);
app.use(cookieParser());
app.use(morgan("dev"));


// body parsers

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// session middleware removed for JWT api architecture

app.use(sessionMiddleware);


// passport removed


// expose session user context to all views globally

app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.currentPath = req.path;
    res.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
    res.locals.baseUrl = process.env.BASE_URL || "http://localhost:3000";
    next();
});


// view engine and static files removed for API-first architecture


// db connection

const connectDB = require("./config/db");
connectDB();


// models

const Community = require("./models/Community");
const Post = require("./models/Post");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Medicine = require("./models/Medicine");


// passport configuration removed


// routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorDashboardRoutes = require("./routes/doctorDashboardRoutes");
const communityDiscoveryRoutes = require("./routes/communityDiscoveryRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const doctorPostRoutes = require("./routes/doctorPostRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const communityRoutes = require("./routes/communityRoutes");
const chatRoutes = require("./routes/chatRoutes");
const searchRoutes = require("./routes/searchRoutes");
const doctorSearchRoutes = require("./routes/doctorSearchRoutes");


// api routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor-dashboard", doctorDashboardRoutes);
app.use("/api/community", communityDiscoveryRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/doctor-posts", doctorPostRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/communities", communityRoutes);
app.use("/", chatRoutes);
app.use("/", searchRoutes);
app.use("/", doctorSearchRoutes);


// google auth routes removed




// attach socket.io

app.set("io", io);


// socket session support

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


// socket connection

io.on("connection", (socket) => {
    const user = socket.request.session?.user;

    console.log("user connected:", user?.username || socket.id);

    // join room event
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${user?.username || socket.id} joined room: ${roomId}`);
    });

    // send real-time chat message
    socket.on("send-message", async (data) => {
        try {
            const { roomId, content, recipientId, appointmentId, communityId } = data;
            if (!content || !roomId || !user) return;

            const Message = require("./models/Message");
            const newMsg = await Message.create({
                sender: user.id,
                recipient: recipientId || null,
                appointment: appointmentId || null,
                community: communityId || null,
                content: content.trim()
            });

            const populatedMsg = await Message.findById(newMsg._id)
                .populate("sender", "username role");

            // broadcast message to other clients in room
            io.to(roomId).emit("new-message", populatedMsg);

        } catch (error) {
            console.error("Socket message error:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
    });
});


// serve react frontend
app.use(express.static(path.join(__dirname, "client/dist")));

app.use((req, res, next) => {
    // If route starts with /api/, pass to next middleware (which is 404 handler)
    if (req.path.startsWith("/api/")) {
        return next();
    }
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
});


// error handling middlewares

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);


// start server

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
