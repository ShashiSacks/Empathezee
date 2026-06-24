const Community = require("../models/Community");
const User = require("../models/User");

// Get recommended communities based on user disease
const getRecommendedCommunities = async (req, res) => {
    try {

        // FIX: session-based auth (NOT JWT)
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // normalize disease (important fix)
        const disease = user.disease?.trim();

        if (!disease) {
            return res.status(400).json({
                message: "User disease not set"
            });
        }

        // find matching communities
        const communities = await Community.find({
            disease: disease
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            diseaseMatched: disease,
            total: communities.length,
            communities
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getRecommendedCommunities
};