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
    contentSecurityPolicy: false
}));
app.use(morgan("dev"));


// body parsers

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// session middleware

app.use(sessionMiddleware);


// passport initialization

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


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
app.use(express.static(path.join(__dirname, "client/dist")));


// db connection

const connectDB = require("./config/db");
connectDB();


// models

const Community = require("./models/Community");
const Post = require("./models/Post");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Medicine = require("./models/Medicine");


// passport configuration

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback"
            },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Existing Google User
                let existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                // 2. Existing User with matching Email
                let email = profile.emails?.[0]?.value;
                if (email) {
                    let emailUser = await User.findOne({ email: email.toLowerCase() });
                    if (emailUser) {
                        emailUser.googleId = profile.id;
                        await emailUser.save();
                        return done(null, emailUser);
                    }
                }

                // 3. New User creation
                const username = profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 10000);
                const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const bcrypt = require("bcryptjs");
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                const newUser = await User.create({
                    username: username,
                    email: email ? email.toLowerCase() : `${username}@empathezee-oauth.com`,
                    password: hashedPassword,
                    googleId: profile.id,
                    role: "user"
                });

                return done(null, newUser);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
}


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


// google auth routes

app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // sync Passport authenticated user with existing session-based middleware
        req.session.user = {
            id: req.user._id.toString(),
            username: req.user.username,
            role: req.user.role
        };

        // redirect to dashboard using a relative path so it works on all environments
        res.redirect("/dashboard");
    }
);


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


// SPA fallback for React frontend routes
app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/auth")) return next();
    const indexPath = path.join(__dirname, "client/dist/index.html");
    const fs = require("fs");
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    next();
});

// error handling middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);


// start server

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server running on port", PORT);
});
