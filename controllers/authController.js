const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res, role, redirectPath) => {
    try {
        const { username, email, password, age, gender, disease, bio, city, country, state, district } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send("Username, email, and password are required.");
        }

        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long.");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        let normalizedGender = undefined;
        if (typeof gender === "string") {
            normalizedGender = gender.trim().toLowerCase();
            if (!["male", "female", "other"].includes(normalizedGender)) {
                return res.status(400).send("Invalid gender value. Allowed values are male, female, or other.");
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role,
            age: age ? parseInt(age, 10) : null,
            gender: normalizedGender,
            disease: disease ? disease.trim() : "",
            bio: bio ? bio.trim() : "",
            country: country ? country.trim() : "",
            state: state ? state.trim() : "",
            district: district ? district.trim() : "",
            city: city ? city.trim() : ""
        });

        return res.redirect(redirectPath);

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const loginUser = async (req, res, allowedRoles, redirectPath) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send("Please use the correct login page for your account type.");
        }

        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        };

        return res.redirect(redirectPath);

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// REGISTER
const register = (req, res) => registerUser(req, res, "user", "/login");

// LOGIN
const login = (req, res) => loginUser(req, res, ["user", "admin"], "/dashboard");

// DOCTOR REGISTER
const registerDoctor = (req, res) => registerUser(req, res, "doctor", "/doctor/login");

// DOCTOR LOGIN
const loginDoctor = (req, res) => loginUser(req, res, ["doctor"], "/doctor/dashboard");

// LOGOUT
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

// GOOGLE OAUTH SIGN-IN
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).send("ID Token is required.");
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        if (!email) {
            return res.status(400).send("Google account does not provide email access.");
        }

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create user automatically
            const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = await User.create({
                username: name ? name.trim() : email.split("@")[0],
                email: email.trim().toLowerCase(),
                password: hashedPassword,
                role: "user"
            });
        }

        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            role: user.role
        };

        return res.status(200).json({
            message: "Google login successful",
            user: req.session.user
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).send("Google Authentication failed: " + error.message);
    }
};

module.exports = {
    register,
    login,
    registerDoctor,
    loginDoctor,
    logout,
    googleLogin
};
