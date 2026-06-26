const Post = require("../models/Post");

// get all pending posts for doctor
const getPendingPosts = async (req, res) => {
    try {

        const posts = await Post.find({ status: "PENDING" })
            .populate("author", "username email")
            .populate("community", "name disease")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            total: posts.length,
            posts
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// verify / review post (doctor action)
const reviewPost = async (req, res) => {
    try {

        const doctorId = req.session.user?.id;

        if (!doctorId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const { status, comment } = req.body;
        const postId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        let verdict = "SUSPICIOUS";
        if (status === "SAFE") verdict = "VERIFIED";
        else if (status === "FAKE") verdict = "NOT_VERIFIED";
        else if (status === "SUSPICIOUS") verdict = "SUSPICIOUS";

        // add doctor verification record
        post.doctorVerification.push({
            doctorId,
            verdict,
            comment: comment || ""
        });

        // update final status
        post.status = status;

        await post.save();

        // real-time update (important upgrade)
        const io = req.app.get("io");
        if (io) {
            io.emit("post-updated", post);
        }

        if (req.accepts('html')) {
            return res.redirect("/doctor/dashboard");
        }

        return res.status(200).json({
            message: "Post reviewed successfully",
            post
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getPendingPosts,
    reviewPost
};