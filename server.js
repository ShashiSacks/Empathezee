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
const { protectUser, protectDoctor } = require("./middleware/sessionMiddleware");
const helmet = require("helmet");
const morgan = require("morgan");

// security + logging
app.use(helmet({
    contentSecurityPolicy: false // disable CSP to allow socket.io and scripts to work without headers conflict
}));
app.use(morgan("dev"));

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(sessionMiddleware);

// expose session user context to all views globally
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.currentPath = req.path;
    next();
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DB connection
const connectDB = require("./config/db");
connectDB();

// models
const Community = require("./models/Community");
const Post = require("./models/Post");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Medicine = require("./models/Medicine");

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

// API routes
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

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
    });
});


// ======================
// UI ROUTES
// ======================

// HOME (FIXED CLEAN FLOW)
app.get("/", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    if (req.session.user.role === "doctor") {
        return res.redirect("/doctor/dashboard");
    }
    return res.redirect("/dashboard");
});


// communities page
app.get("/communities", protectUser, async (req, res) => {
    try {
        const communities = await Community.find();
        const user = await User.findById(req.user.id);
        const userCommunities = user ? user.communities.map(id => id.toString()) : [];
        const userDisease = user ? user.disease || "" : "";

        // Reorder communities: matching target profile disease first, then by date desc
        communities.sort((a, b) => {
            const aMatch = userDisease && a.disease.toLowerCase().includes(userDisease.toLowerCase());
            const bMatch = userDisease && b.disease.toLowerCase().includes(userDisease.toLowerCase());
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return b.createdAt - a.createdAt;
        });

        res.render("communities", { communities, userCommunities, userDisease });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading communities");
    }
});


// community page
app.get("/community/:id", protectUser, async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).send("Community not found");
        }

        const posts = await Post.find({ community: req.params.id })
            .populate("author", "username")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "username"
                }
            })
            .sort({ createdAt: -1 });

        res.render("community", { community, posts });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading community");
    }
});


// login page
app.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    }
    res.render("login");
});


// register page
app.get("/register", (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    }
    res.render("register");
});

// doctor login page
app.get("/doctor/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    }
    res.render("doctorLogin");
});

// doctor register page
app.get("/doctor/register", (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    }
    res.render("doctorRegister");
});

// doctor moderation dashboard
app.get("/doctor/dashboard", protectDoctor, async (req, res) => {
    try {
        const posts = await Post.find({ status: "PENDING" })
            .populate("author", "username email")
            .sort({ createdAt: -1 });

        res.render("doctorPosts", { posts });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading doctor dashboard");
    }
});


// profile page
app.get("/profile", protectUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("communities");

        res.render("profile", { user });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile");
    }
});


// dashboard
app.get("/dashboard", protectUser, (req, res) => {
    res.render("dashboard");
});

// appointments UI
app.get("/appointments-ui", protectUser, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate("doctor", "username email disease city")
            .sort({ date: 1, time: 1 });
        const doctors = await User.find({ role: "doctor" }).select("username email disease city");
        res.render("appointments", { appointments, doctors });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading appointments UI");
    }
});

// medicine UI
app.get("/medicine-ui", protectUser, async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const user = await User.findById(req.user.id);
        const userDisease = user?.disease || "";

        let filter = {};
        if (searchQuery.trim() !== "") {
            filter = {
                $or: [
                    { name: { $regex: searchQuery.trim(), $options: "i" } },
                    { disease: { $regex: searchQuery.trim(), $options: "i" } },
                    { description: { $regex: searchQuery.trim(), $options: "i" } }
                ]
            };
        }

        let medicines = await Medicine.find(filter).sort({ name: 1 });

        // If no local results, fetch from OpenAI
        if (medicines.length === 0 && searchQuery.trim() !== "") {
            const { getMedicinesFromAI } = require("./services/aiVerifier");
            const aiMeds = await getMedicinesFromAI(searchQuery.trim());

            if (aiMeds && aiMeds.length > 0) {
                for (const med of aiMeds) {
                    const exists = await Medicine.findOne({ name: med.name });
                    if (!exists) {
                        await Medicine.create(med);
                    }
                }
                // Re-query database
                medicines = await Medicine.find(filter).sort({ name: 1 });
            }
        }

        res.render("medicine", { medicines, userDisease, searchQuery });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading medicine UI");
    }
});

// Error handling middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);


// start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server running on port", PORT);
});
