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
    res.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
    res.locals.googleClientId = process.env.GOOGLE_CLIENT_ID || "";
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
const chatRoutes = require("./routes/chatRoutes");

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
app.use("/", chatRoutes);

// Platform Analytics Dashboard Route
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

    // Join room event
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${user?.username || socket.id} joined room: ${roomId}`);
    });

    // Send real-time chat message
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

        res.render("medicine", { medicines, userDisease, searchQuery });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading medicine UI");
    }
});

// search-disease API using Google Custom Search
app.get("/search-disease", protectUser, async (req, res) => {
    try {
        const query = req.query.query || req.query.q || "";
        if (!query.trim()) {
            return res.json({ results: [] });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CSE_CX || "b1c032ebe988b40d9";

        if (!apiKey) {
            // High-quality static/informative responses for testing without API keys
            const fallbackResults = {
                cold: [
                    {
                        title: "Common Cold - Symptoms and Causes - Mayo Clinic",
                        snippet: "The common cold is a viral infection of your nose and throat. It's usually harmless, though it might not feel that way.",
                        link: "https://www.mayoclinic.org/diseases-conditions/common-cold/symptoms-causes/syc-20371050"
                    },
                    {
                        title: "Understanding the Common Cold -- the Basics - WebMD",
                        snippet: "A cold is a viral infection of the upper respiratory tract. Most colds are caused by viruses called rhinoviruses.",
                        link: "https://www.webmd.com/cold-and-flu/understanding-common-cold-basics"
                    },
                    {
                        title: "Common Cold | NIH: National Institute of Allergy and Infectious Diseases",
                        snippet: "The common cold is one of the most frequent illnesses in the world. Research on common cold prevention and treatment continues.",
                        link: "https://www.niaid.nih.gov/diseases-conditions/common-cold"
                    },
                    {
                        title: "Common cold - Wikipedia",
                        snippet: "The common cold, also known simply as a cold, is a viral infectious disease of the upper respiratory tract that primarily affects the respiratory mucosa.",
                        link: "https://en.wikipedia.org/wiki/Common_cold"
                    }
                ],
                fever: [
                    {
                        title: "Fever - Symptoms and Causes - Mayo Clinic",
                        snippet: "A fever is a temporary increase in your body temperature, often due to an illness. Having a fever is a sign that something out of the origin is going on.",
                        link: "https://www.mayoclinic.org/diseases-conditions/fever/symptoms-causes/syc-20352759"
                    },
                    {
                        title: "Fever in Adults: Symptoms, Causes, and Treatments - WebMD",
                        snippet: "A fever is a high body temperature. It's a symptom, not a disease. A fever is usually a sign that your body is fighting an infection.",
                        link: "https://www.webmd.com/first-aid/fevers-in-adults"
                    },
                    {
                        title: "Fever - Wikipedia",
                        snippet: "Fever, also referred to as pyrexia, is defined as having a temperature above the normal range due to an increase in the body's temperature setpoint.",
                        link: "https://en.wikipedia.org/wiki/Fever"
                    }
                ],
                headache: [
                    {
                        title: "Headache - Symptoms and Causes - Mayo Clinic",
                        snippet: "Headaches are a very common condition that most people will experience many times during their lives. The main symptom of a headache is pain in your head or face.",
                        link: "https://www.mayoclinic.org/symptoms/headache/basics/definition/sym-20050800"
                    },
                    {
                        title: "Headache Basics: Symptoms, Types, and More - WebMD",
                        snippet: "WebMD explains the symptoms, causes, and treatments of different kinds of headaches.",
                        link: "https://www.webmd.com/migraines-headaches/headache-basics"
                    },
                    {
                        title: "Headache - Wikipedia",
                        snippet: "A headache is a symptom of pain anywhere in the region of the head or neck. It occurs in migraines, tension-type headaches, and cluster headaches.",
                        link: "https://en.wikipedia.org/wiki/Headache"
                    }
                ]
            };

            const qLower = query.toLowerCase().trim();
            let results = [];
            if (qLower.includes("cold")) {
                results = fallbackResults.cold;
            } else if (qLower.includes("fever")) {
                results = fallbackResults.fever;
            } else if (qLower.includes("headache") || qLower.includes("migraine")) {
                results = fallbackResults.headache;
            } else {
                results = [
                    {
                        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Information - Mayo Clinic`,
                        snippet: `Learn more about causes, symptoms, diagnosis, treatment, and prevention of ${query} on Mayo Clinic.`,
                        link: `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(query)}`
                    },
                    {
                        title: `Medical Reference for ${query} - WebMD`,
                        snippet: `Find medical definitions, symptom checking, and health resources for ${query} on WebMD.`,
                        link: `https://www.webmd.com/search/2/results?query=${encodeURIComponent(query)}`
                    },
                    {
                        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Research - National Institutes of Health (NIH)`,
                        snippet: `Explore scientific articles, clinical trials, and health information about ${query} on the official NIH website.`,
                        link: `https://search.nih.gov/search?utf8=%E2%9C%93&affiliate=nih&query=${encodeURIComponent(query)}`
                    }
                ];
            }
            return res.json({ results, note: "Loaded from local secure medical index. Add GOOGLE_API_KEY to .env for live API search." });
        }

        const queryWithSites = `${query} (site:mayoclinic.org OR site:webmd.com OR site:nih.gov OR site:en.wikipedia.org)`;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(queryWithSites)}&num=5`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.items) {
            return res.json({ results: [] });
        }

        const results = data.items.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link
        }));

        return res.json({ results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to search disease info" });
    }
});

// medicine-info API using Google Custom Search
app.get("/medicine-info", protectUser, async (req, res) => {
    try {
        const query = req.query.query || req.query.q || "";
        if (!query.trim()) {
            return res.json({ results: [] });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CSE_CX || "b1c032ebe988b40d9";

        if (!apiKey) {
            const results = [
                {
                    title: `Medicine Information for ${query} - Mayo Clinic`,
                    snippet: `Detailed information about drugs, medicines, dosage, and side effects for ${query} on Mayo Clinic.`,
                    link: `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(query + ' drugs')}`
                },
                {
                    title: `Drugs & Medications Reference - WebMD`,
                    snippet: `Find medical information, reviews, and side effects for ${query} on WebMD.`,
                    link: `https://www.webmd.com/drugs/2/search?type=drugs&query=${encodeURIComponent(query)}`
                },
                {
                    title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Wikipedia`,
                    snippet: `Medical usage, mechanism of action, pharmacology, and chemical properties of ${query} on Wikipedia.`,
                    link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
                }
            ];
            return res.json({ results, note: "Loaded from local medical index. Add GOOGLE_API_KEY to .env for live API search." });
        }

        const queryWithSites = `${query} (site:mayoclinic.org OR site:webmd.com OR site:nih.gov OR site:en.wikipedia.org)`;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(queryWithSites)}&num=5`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.items) {
            return res.json({ results: [] });
        }

        const results = data.items.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link
        }));

        return res.json({ results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to search medicine info" });
    }
});

// find-doctors API using Nominatim OpenStreetMap
app.get("/find-doctors", protectUser, async (req, res) => {
    try {
        const { symptom, city } = req.query;
        if (!symptom || !city) {
            return res.status(400).json({ error: "Symptom and City are required parameters." });
        }

        const symptomToSpecialty = {
            cold: "General Physician / ENT",
            fever: "General Physician",
            cough: "Pulmonologist",
            "chest pain": "Cardiologist",
            "skin rash": "Dermatologist",
            "stomach pain": "Gastroenterologist",
            headache: "Neurologist",
            "eye pain": "Ophthalmologist",
            "joint pain": "Orthopedic"
        };

        const key = symptom.toLowerCase().trim();
        const specialization = symptomToSpecialty[key] || "General Physician";

        // Query chain fallbacks
        const queries = [
            `${specialization} doctor in ${city}`,
            `${specialization} in ${city}`,
            `doctor in ${city}`,
            `clinic in ${city}`
        ];

        let osmPlaces = [];
        for (const q of queries) {
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=10`;
                const response = await fetch(url, {
                    headers: {
                        "User-Agent": "Empathezee-Medical-App/1.0 (contact@empathezee.com)"
                    }
                });
                const data = await response.json();
                if (data && data.length > 0) {
                    osmPlaces = data;
                    break;
                }
            } catch (err) {
                console.error("OSM Fetch Error:", err.message);
            }
        }

        const doctors = osmPlaces.map(place => {
            const name = place.name || (place.display_name ? place.display_name.split(",")[0] : "Medical Practitioner");
            const formattedName = name.startsWith("Dr.") ? name : `Dr. ${name}`;
            const mapsLink = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;

            return {
                name: formattedName,
                specialization: specialization,
                address: place.display_name,
                mapsLink: mapsLink
            };
        });

        return res.json({ doctors, specialization });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to find doctors" });
    }
});

// doctor search UI
app.get("/doctor-search-ui", protectUser, (req, res) => {
    res.render("doctorSearch");
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
