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

// security + logging
app.use(helmet({
    contentSecurityPolicy: false // disable csp to allow socket.io and scripts to work without headers conflict
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
    res.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
    res.locals.googleClientId = process.env.GOOGLE_CLIENT_ID || "";
    res.locals.baseUrl = process.env.BASE_URL || "http://localhost:3000";
    next();
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// db connection
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
const chatRoutes = require("./routes/chatRoutes");
const searchRoutes = require("./routes/searchRoutes");
const doctorSearchRoutes = require("./routes/doctorSearchRoutes");
const { googleLogin } = require("./controllers/authController");

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

// Direct Google OAuth Callback POST (from redirect mode)
app.post("/auth/google/callback", googleLogin);

// platform analytics dashboard route
app.get("/analytics", protect, async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments();
        const safePosts = await Post.countDocuments({ status: "SAFE" });
        const fakePosts = await Post.countDocuments({ status: "FAKE" });
        const pendingPosts = await Post.countDocuments({ status: "PENDING" });
        const suspiciousPosts = await Post.countDocuments({ status: "SUSPICIOUS" });
        const totalUsers = await User.countDocuments();

        const diseaseStats = await Post.aggregate([
            {
                $group: {
                    _id: "$disease",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const posts = await Post.find();
        let verifiedCount = 0;
        let rejectedCount = 0;

        posts.forEach(post => {
            post.doctorVerification.forEach(v => {
                if (v.verdict === "VERIFIED") verifiedCount++;
                if (v.verdict === "NOT_VERIFIED") rejectedCount++;
            });
        });

        res.render("analytics", {
            totalPosts,
            totalUsers,
            safePosts,
            fakePosts,
            pendingPosts,
            suspiciousPosts,
            doctorVerified: verifiedCount,
            doctorRejected: rejectedCount,
            diseaseStats,
            title: "Platform Security & Health Analytics"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading analytics page");
    }
});

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



// ======================
// ui routes
// ======================

// home (fixed clean flow)
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

        // reorder communities: matching target profile disease first, then by date desc
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

        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate("patient", "username email")
            .sort({ date: 1, time: 1 });

        res.render("doctorDashboard", { posts, appointments });
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

// appointments ui
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
app.get("/medicine", protectUser, async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const user = await User.findById(req.user.id);
        const userDisease = user?.disease || "";

        res.render("medicine", { userDisease, searchQuery });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading medicine UI");
    }
});


// search API and UI routes have been refactored to routes/searchRoutes.js

// error handling middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);


// start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server running on port", PORT);
});
