const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "empathezee_secret",
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60
    }),

    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
});


// protect any authenticated user
const protect = (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        req.user = {
            ...req.session.user,
            id: req.session.user.id,
            _id: req.session.user.id
        };

        return next();
    } catch (error) {
        console.error(error);
        return res.redirect("/login");
    }
};


// protect regular users (redirects doctors)
const protectUser = (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        req.user = {
            ...req.session.user,
            id: req.session.user.id,
            _id: req.session.user.id
        };

        if (req.user.role === "doctor") {
            return res.redirect("/doctor/dashboard");
        }

        if (req.user.role !== "user" && req.user.role !== "admin") {
            return res.status(403).send("Access denied.");
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.redirect("/login");
    }
};


// authorize specific roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
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
        return res.redirect("/doctor/login");
    }

    req.user = {
        ...req.session.user,
        id: req.session.user.id,
        _id: req.session.user.id
    };

    if (req.user.role !== "doctor") {
        return res.redirect("/dashboard");
    }

    return next();
};

module.exports = sessionMiddleware;
module.exports.protect = protect;
module.exports.protectUser = protectUser;
module.exports.authorizeRoles = authorizeRoles;
module.exports.protectDoctor = protectDoctor;
