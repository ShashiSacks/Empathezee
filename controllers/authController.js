const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res, role, redirectPath) => {
    try {
        const { username, email, password, age, gender, disease, bio, city } = req.body;

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

module.exports = {
    register,
    login,
    registerDoctor,
    loginDoctor,
    logout
};
