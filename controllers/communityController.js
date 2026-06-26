const Community = require("../models/Community");
const Post = require("../models/Post");
const User = require("../models/User");

// CREATE COMMUNITY
const createCommunity = async (req, res, next) => {
    try {
        const { name, description, disease, type, meetingTime, meetingDate, meetingPlace, paymentType, price, location } = req.body;

        if (!location || !location.trim()) {
            const err = new Error("Location / City is required.");
            if (req.accepts('html')) {
                return next(err);
            }
            return res.status(400).json({ message: err.message });
        }



        const existing = await Community.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });

        if (existing) {
            const err = new Error("A community with this name already exists.");
            if (req.accepts('html')) {
                return next(err);
            }
            return res.status(400).json({
                message: err.message
            });
        }

        const community = await Community.create({
            name: name.trim(),
            description: description.trim(),
            disease: disease.trim(),
            type: type || "online",
            meetingTime: meetingTime || "",
            meetingDate: meetingDate || "",
            meetingPlace: meetingPlace || "",
            paymentType: paymentType || "free",
            price: price ? parseFloat(price) : 0,
            location: location ? location.trim() : ""
        });

        if (req.accepts('html')) {
            return res.redirect("/communities");
        }

        res.status(201).json(community);

    } catch (error) {
        if (req.accepts('html')) {
            return next(error);
        }
        res.status(500).json({ message: error.message });
    }
};

// GET ALL COMMUNITIES
const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find()
            .sort({ createdAt: -1 });

        res.status(200).json(communities);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COMMUNITY BY ID
const getCommunityById = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                message: "Community not found"
            });
        }

        res.status(200).json(community);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET POSTS OF COMMUNITY
const getCommunityPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            community: req.params.id
        })
        .populate("author", "username email")
        .populate("community", "name disease")
        .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// JOIN COMMUNITY 
const joinCommunity = async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                message: "Community not found"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.communities.includes(req.params.id)) {
            user.communities.push(req.params.id);
            await user.save();
        }

        if (req.accepts('html')) {
            return res.redirect("/communities");
        }

        res.status(200).json({
            message: "Joined community successfully",
            communities: user.communities
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LEAVE COMMUNITY
const leaveCommunity = async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.communities = user.communities.filter(
            (id) => id.toString() !== req.params.id
        );

        await user.save();

        if (req.accepts('html')) {
            return res.redirect("/communities");
        }

        res.status(200).json({
            message: "Left community successfully",
            communities: user.communities
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COMMUNITY MEMBERS
const getCommunityMembers = async (req, res) => {
    try {
        const members = await User.find({
            communities: req.params.id
        }).select("username email city disease");

        res.status(200).json({
            totalMembers: members.length,
            members
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COMMUNITY STATS
const getCommunityStats = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                message: "Community not found"
            });
        }

        const membersCount = await User.countDocuments({
            communities: req.params.id
        });

        const postsCount = await Post.countDocuments({
            community: req.params.id
        });

        res.status(200).json({
            communityName: community.name,
            disease: community.disease,
            members: membersCount,
            posts: postsCount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEARCH COMMUNITIES
const searchCommunities = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const communities = await Community.find({
            name: {
                $regex: keyword,
                $options: "i"
            }
        });

        res.status(200).json(communities);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE COMMUNITY
const deleteCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                message: "Community not found"
            });
        }

        await Community.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Community deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCommunity,
    getCommunities,
    getCommunityById,
    getCommunityPosts,
    joinCommunity,
    leaveCommunity,
    getCommunityMembers,
    getCommunityStats,
    searchCommunities,
    deleteCommunity
};