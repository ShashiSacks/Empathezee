const User = require("../models/User");
const Community = require("../models/Community");


// get profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const dbUser = await User.findById(userId).select("-password").populate("communities");
        res.status(200).json({
            message: "Protected Profile Route",
            user: dbUser || req.user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// update profile
const updateProfile = async (req, res, next) => {
    try {
        const { username, email, age, gender, disease, bio, city, country, state, district } = req.body;

        let normalizedGender = undefined;
        if (typeof gender === "string") {
            normalizedGender = gender.trim().toLowerCase();
            if (normalizedGender && !["male", "female", "other"].includes(normalizedGender)) {
                return res.status(400).json({ message: "Invalid gender value. Allowed: male, female, other." });
            }
        }

        const updateData = {};
        if (username) updateData.username = username.trim();
        if (email) updateData.email = email.trim().toLowerCase();
        
        // handle age casting
        if (age !== undefined) {
            updateData.age = age === "" ? null : parseInt(age, 10);
        }
        
        // handle optional gender, disease, bio, location fields
        if (gender !== undefined) {
            updateData.gender = normalizedGender || null;
        }
        if (disease !== undefined) {
            updateData.disease = disease.trim();
        }
        if (bio !== undefined) {
            updateData.bio = bio.trim();
        }
        if (country !== undefined) {
            updateData.country = country.trim();
        }
        if (state !== undefined) {
            updateData.state = state.trim();
        }
        if (district !== undefined) {
            updateData.district = district.trim();
        }
        if (city !== undefined) {
            updateData.city = city.trim();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        // synchronize updated values with user session context
        if (req.session && req.session.user) {
            req.session.user.username = updatedUser.username;
            req.session.user.email = updatedUser.email;
        }

        if (req.accepts("html")) {
            return res.redirect("/profile");
        }
        res.status(200).json(updatedUser);

    } catch (error) {
        if (req.accepts("html")) {
            // let the global error handler render the ejs error view
            return next(error);
        }
        res.status(500).json({
            message: error.message
        });
    }
};


// get user communities
const getUserCommunities = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("communities");

        res.status(200).json(user.communities);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// get all doctors
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" }).select("username email disease city");
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getUserCommunities,
    getDoctors
};