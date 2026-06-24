require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const doctors = [
    {
        username: "Samuel Lenald",
        email: "samuel@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 45,
        gender: "male",
        disease: "Orthopedics",
        city: "Kadapa",
        bio: "Specialist in joint replacement and arthroscopic surgeries."
    },
    {
        username: "Jahangeer Basha",
        email: "jahangeer@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 42,
        gender: "male",
        disease: "Orthopedics",
        city: "Kadapa",
        bio: "Specialist in robotic joint replacement and complex trauma care."
    },
    {
        username: "Krishna Chaitanya",
        email: "krishna@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 38,
        gender: "male",
        disease: "Orthopedics",
        city: "Kadapa",
        bio: "Consultant Orthopedic Surgeon with expertise in joint reconstructions."
    },
    {
        username: "Sravan Kumar Nandaluru",
        email: "sravan@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 46,
        gender: "male",
        disease: "Cardiology",
        city: "Kadapa",
        bio: "Head of Interventional Cardiology with extensive clinical research."
    },
    {
        username: "Mohan Rao Jakkamputi",
        email: "mohan@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 50,
        gender: "male",
        disease: "Cardiology",
        city: "Kadapa",
        bio: "Experienced Cardiologist specializing in cardiac critical care."
    },
    {
        username: "Sreekanth Surasura",
        email: "sreekanth@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 41,
        gender: "male",
        disease: "Pediatrics",
        city: "Kadapa",
        bio: "Specialist Pediatrician practicing advanced neonatal and pediatric care."
    },
    {
        username: "Nagasubbareddy Chintala",
        email: "nagasubbareddy@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 44,
        gender: "male",
        disease: "Pediatrics",
        city: "Kadapa",
        bio: "Pediatric critical care expert serving Kadapa and surrounding areas."
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for seeding...");

        for (const doc of doctors) {
            const existing = await User.findOne({ email: doc.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(doc.password, 10);
                await User.create({
                    ...doc,
                    password: hashedPassword
                });
                console.log(`Seeded doctor: Dr. ${doc.username} (${doc.disease})`);
            } else {
                console.log(`Doctor Dr. ${doc.username} already exists.`);
            }
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
