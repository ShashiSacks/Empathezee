const Medicine = require("../models/Medicine");

// Get all medicines (supports optional query disease filter)
const getMedicines = async (req, res) => {
    try {
        const { disease } = req.query;
        let filter = {};
        
        if (disease && disease.trim() !== "") {
            filter = {
                $or: [
                    { name: { $regex: disease.trim(), $options: "i" } },
                    { disease: { $regex: disease.trim(), $options: "i" } },
                    { description: { $regex: disease.trim(), $options: "i" } }
                ]
            };
        }
        
        let medicines = await Medicine.find(filter).sort({ name: 1 });

        res.status(200).json(medicines);

    } catch (error) {
        console.error("Get Medicines Error:", error);
        res.status(500).json({ message: "Server error fetching medicines" });
    }
};

// Get medicines by disease (path param)
const getMedicinesByDisease = async (req, res) => {
    try {
        const { disease } = req.params;

        const medicines = await Medicine.find({
            disease: { $regex: disease, $options: "i" }
        }).sort({ name: 1 });

        res.status(200).json(medicines);

    } catch (error) {
        console.error("Get Medicines By Disease Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add medicine (admin/doctor use)
const addMedicine = async (req, res) => {
    try {
        const { name, description, disease, requiresPrescription } = req.body;

        if (!name || !description || !disease) {
            return res.status(400).json({ message: "Name, description, and target disease are required." });
        }

        const medicine = await Medicine.create({
            name: name.trim(),
            description: description.trim(),
            disease: disease.trim(),
            requiresPrescription: requiresPrescription === "true" || requiresPrescription === true || requiresPrescription === "on"
        });

        if (req.accepts('html')) {
            return res.redirect("/medicine-ui");
        }

        res.status(201).json({
            message: "Medicine added successfully",
            medicine
        });

    } catch (error) {
        console.error("Add Medicine Error:", error);
        res.status(500).json({ message: "Server error adding medicine" });
    }
};

module.exports = {
    getMedicines,
    getMedicinesByDisease,
    addMedicine
};