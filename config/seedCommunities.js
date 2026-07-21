const mongoose = require("mongoose");
const Community = require("../models/Community");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");


// seed communities and initial posts
const seedCommunities = async () => {
    try {
        const communityCount = await Community.countDocuments();
        if (communityCount > 0) {
            console.log("Database already has communities, skipping community seeding.");
            return;
        }

        console.log("Seeding default communities and posts...");

        // find a doctor or user to act as author
        let defaultAuthor = await User.findOne({ role: "doctor" });
        if (!defaultAuthor) {
            defaultAuthor = await User.findOne();
        }
        
        // if still no user, let's create a temporary system user
        if (!defaultAuthor) {
            defaultAuthor = await User.create({
                username: "SystemModerator",
                email: "moderator@empathezee.com",
                password: "systempassword123",
                role: "admin"
            });
        }

        // create aids support group
        const aidsGroup = await Community.create({
            name: "AIDS Support Group",
            description: "A safe, secure, and compassionate space for patients living with HIV/AIDS to share experiences, support each other, and discuss antiretroviral treatments.",
            disease: "Aids",
            type: "online",
            paymentType: "free",
            location: "Global"
        });

        // create cardiology forum
        const cardioGroup = await Community.create({
            name: "Cardiovascular Health Meetup",
            description: "An offline community to discuss cardiac health, lifestyle, and exercise plans with peer patients and cardiologists in Kadapa.",
            disease: "Cardiology",
            type: "offline",
            meetingDate: "2026-07-15",
            meetingTime: "10:00 AM",
            meetingPlace: "Kadapa Cardiac Center Hall",
            paymentType: "free",
            location: "Kadapa"
        });

        // create orthopedics group
        const orthoGroup = await Community.create({
            name: "Orthopedics & Joint Care Forum",
            description: "Discussion on joint replacements, physiotherapy, bone health, and injury recovery.",
            disease: "Orthopedics",
            type: "online",
            paymentType: "free",
            location: "Global"
        });

        console.log("Seeded communities: AIDS Support Group, Cardiology Health Meetup, Orthopedics & Joint Care Forum");

        // seed posts for aids support group
        const post1 = await Post.create({
            title: "Welcome to the AIDS Support Community!",
            content: "Hello everyone! This is a secure, welcoming space for patients and caregivers to connect. Please feel free to introduce yourself or ask any questions about antiretroviral treatments (ART), nutrition, or general wellness. We are in this together.",
            author: defaultAuthor._id,
            community: aidsGroup._id,
            status: "SAFE",
            disease: "Aids",
            aiReason: "Constructive support content.",
            riskScore: 0.05
        });

        const comment1 = await Comment.create({
            content: "Thank you for setting this up! It is really nice to have a dedicated, private community where we can share resources.",
            author: defaultAuthor._id,
            post: post1._id
        });

        post1.comments.push(comment1._id);
        await post1.save();

        const post2 = await Post.create({
            title: "Managing daily side effects of ART",
            content: "I started my new antiretroviral medication last week. I am experiencing minor fatigue. Has anyone else gone through this, and what are your best tips for managing daily side effects?",
            author: defaultAuthor._id,
            community: aidsGroup._id,
            status: "SAFE",
            disease: "Aids",
            aiReason: "Inquiry about medical management.",
            riskScore: 0.1
        });

        const comment2 = await Comment.create({
            content: "For me, taking it with a light meal and staying well hydrated during the day helped cut down the fatigue within the first two weeks. Hang in there!",
            author: defaultAuthor._id,
            post: post2._id
        });

        post2.comments.push(comment2._id);
        await post2.save();

        console.log("Seeded posts and comments successfully!");

    } catch (error) {
        console.error("Error seeding communities:", error);
    }
};

module.exports = seedCommunities;
