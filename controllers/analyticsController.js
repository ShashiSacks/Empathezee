const Post = require("../models/Post");
const User = require("../models/User");

// get platform analytics
const getAnalytics = async (req, res) => {
    try {
        // total posts
        const totalPosts = await Post.countDocuments();

        // status breakdown
        const safePosts = await Post.countDocuments({ status: "SAFE" });
        const fakePosts = await Post.countDocuments({ status: "FAKE" });
        const pendingPosts = await Post.countDocuments({ status: "PENDING" });
        const suspiciousPosts = await Post.countDocuments({ status: "SUSPICIOUS" });

        // total users
        const totalUsers = await User.countDocuments();

        // disease stats
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

        // doctor verification stats
        const posts = await Post.find();

        let verifiedCount = 0;
        let rejectedCount = 0;

        posts.forEach(post => {
            post.doctorVerification.forEach(v => {
                if (v.verdict === "VERIFIED") verifiedCount++;
                if (v.verdict === "NOT_VERIFIED") rejectedCount++;
            });
        });

        return res.status(200).json({
            totalPosts,
            totalUsers,
            safePosts,
            fakePosts,
            pendingPosts,
            suspiciousPosts,
            doctorVerified: verifiedCount,
            doctorRejected: rejectedCount,
            diseaseStats
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAnalytics
};