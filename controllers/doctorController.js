const Post = require("../models/Post");

// Doctor verifies a post
const verifyPost = async (req, res) => {
    try {

        const postId = req.params.id;

        const { verdict, comment } = req.body;

        // check session user
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        // find post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // validate verdict
        const allowedVerdicts = ["VERIFIED", "NOT_VERIFIED", "SUSPICIOUS"];

        if (!allowedVerdicts.includes(verdict)) {
            return res.status(400).json({
                message: "Invalid verdict"
            });
        }

        // add verification
        post.doctorVerification.push({
            doctorId: userId,
            verdict,
            comment
        });

        // update AI status based on verdict
        if (verdict === "VERIFIED") {
            post.status = "SAFE";
        } else if (verdict === "NOT_VERIFIED") {
            post.status = "FAKE";
        } else {
            post.status = "SUSPICIOUS";
        }

        await post.save();

        return res.status(200).json({
            message: "Post verified successfully",
            post
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    verifyPost
};