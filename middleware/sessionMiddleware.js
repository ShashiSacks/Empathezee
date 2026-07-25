const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const getMongoUrl = () => {
    return process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/empathezee";
};

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "empathezee_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        clientPromise: new Promise((resolve) => {
            if (mongoose.connection.readyState === 1) {
                return resolve(mongoose.connection.getClient());
            }
            mongoose.connection.once("open", () => {
                resolve(mongoose.connection.getClient());
            });
        }),
        ttl: 24 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
});


const handleUnauthenticated = (req, res, defaultRedirect = "/login") => {
    if (req.originalUrl?.startsWith("/api") || req.path?.startsWith("/api") || req.xhr) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    return res.redirect(defaultRedirect);
};


// protect any authenticated user
const protect = (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return handleUnauthenticated(req, res, "/login");
        }

        req.user = {
            ...req.session.user,
            id: req.session.user.id,
            _id: req.session.user.id
        };

        return next();
    } catch (error) {
        console.error(error);
        return handleUnauthenticated(req, res, "/login");
    }
};


// protect regular users (redirects doctors)
const protectUser = (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return handleUnauthenticated(req, res, "/login");
        }

        req.user = {
            ...req.session.user,
            id: req.session.user.id,
            _id: req.session.user.id
        };

        if (req.user.role === "doctor") {
            if (req.originalUrl?.startsWith("/api") || req.path?.startsWith("/api")) {
                return res.status(403).json({ success: false, message: "Doctor role restricted" });
            }
            return res.redirect("/doctor/dashboard");
        }

        if (req.user.role !== "user" && req.user.role !== "admin") {
            return res.status(403).send("Access denied.");
        }

        return next();
    } catch (error) {
        console.error(error);
        return handleUnauthenticated(req, res, "/login");
    }
};


// authorize specific roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return handleUnauthenticated(req, res, "/login");
        }

        const userRole = req.session.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied. Insufficient permissions."
            });
        }

        return next();
    };
};


// protect doctor role routes
const protectDoctor = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return handleUnauthenticated(req, res, "/doctor/login");
    }

    req.user = {
        ...req.session.user,
        id: req.session.user.id,
        _id: req.session.user.id
    };

    if (req.user.role !== "doctor") {
        if (req.originalUrl?.startsWith("/api") || req.path?.startsWith("/api")) {
            return res.status(403).json({ success: false, message: "User is not a doctor" });
        }
        return res.redirect("/dashboard");
    }

    return next();
};

module.exports = sessionMiddleware;
module.exports.protect = protect;
module.exports.protectUser = protectUser;
module.exports.authorizeRoles = authorizeRoles;
module.exports.protectDoctor = protectDoctor;
