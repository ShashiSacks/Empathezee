const Post = require("../models/Post");
const User = require("../models/User");

// create post
const createPost = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const { community, title, content, disease } = req.body;

        if (!community || !title || !content || !disease) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // auto-approve post without ai verifier
        const aiStatus = "SAFE";
        const aiReason = "Auto-approved";
        const riskScore = 0;

        const post = await Post.create({
            author: userId,
            community,
            title,
            content,
            disease,
            status: aiStatus,
            aiReason: aiReason,
            riskScore: riskScore
        });

        // socket event (optional real-time support)
        const io = req.app.get("io");
        if (io) {
            io.emit("new-post", post);
        }

        if (req.accepts('html')) {
            return res.redirect(`/community/${community}`);
        }

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// get all posts (ai ranked feed)
const getPosts = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        const user = await User.findById(userId);
        const userDisease = (user?.disease || "").toLowerCase();

        const posts = await Post.find()
            .populate("author", "username email")
            .populate("community", "name disease");

        // remove fake posts early
        const validPosts = posts.filter(p => p.status !== "FAKE");

        const rankedPosts = validPosts
            .map(post => {

                const postDisease = (post.disease || "").toLowerCase();

                let score = 0;

                // ai trust score
                if (post.status === "SAFE") score += 5;
                else if (post.status === "SUSPICIOUS") score += 2;
                else score += 1;

                // disease match boost
                if (userDisease && postDisease.includes(userDisease)) {
                    score += 5;
                }

                // engagement score
                score += (post.likes?.length || 0) * 0.2;

                // doctor verification boost
                const verified = (post.doctorVerification || []).filter(
                    v => v.verdict === "VERIFIED"
                ).length;

                score += verified * 3;

                // risk penalty
                score -= post.riskScore || 0;

                return { post, score };
            })
            .sort((a, b) => b.score - a.score)
            .map(item => item.post);

        return res.status(200).json({
            total: rankedPosts.length,
            posts: rankedPosts
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// like post
const likePost = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        // socket event
        const io = req.app.get("io");
        if (io) {
            io.emit("post-liked", {
                postId: post._id,
                likes: post.likes.length
            });
        }

        if (req.accepts('html')) {
            return res.redirect(`/community/${post.community}`);
        }

        return res.status(200).json({
            message: "Post liked",
            likes: post.likes.length
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// unlike post
const unlikePost = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        // socket event
        const io = req.app.get("io");
        if (io) {
            io.emit("post-unliked", {
                postId: post._id,
                likes: post.likes.length
            });
        }

        if (req.accepts('html')) {
            return res.redirect(`/community/${post.community}`);
        }

        return res.status(200).json({
            message: "Post unliked",
            likes: post.likes.length
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// update post
const updatePost = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const { title, content, disease } = req.body;

        post.title = title || post.title;
        post.content = content || post.content;
        post.disease = disease || post.disease;

        await post.save();

        return res.status(200).json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// delete post
const deletePost = async (req, res) => {
    try {

        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        // socket event
        const io = req.app.get("io");
        if (io) {
            io.emit("post-deleted", {
                postId: req.params.id
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    likePost,
    unlikePost,
    updatePost,
    deletePost
};