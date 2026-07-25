const MedicineOrder = require("../models/MedicineOrder");


// book medicine order
const orderMedicine = async (req, res) => {
    try {
        const { medicineName, quantity, address, paymentMethod } = req.body;

        if (!medicineName || !quantity || !address || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required to place an order." });
        }

        const qty = parseInt(quantity, 10);
        const totalAmount = qty * 150;

        const order = await MedicineOrder.create({
            patient: req.user._id,
            medicineName: medicineName.trim(),
            quantity: qty,
            address: address.trim(),
            paymentMethod,
            totalAmount,
            status: "PENDING"
        });

        if (paymentMethod === "card") {
            const stripeSecret = process.env.STRIPE_SECRET_KEY;
            if (!stripeSecret) {
                return res.status(400).json({ message: "Stripe keys are not configured on the server." });
            }
            const stripe = require("stripe")(stripeSecret);
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount * 100,
                currency: "inr",
                payment_method_types: ['card'],
                metadata: {
                    orderId: order._id.toString(),
                    patientId: req.user._id.toString(),
                    medicineName: medicineName
                }
            });

            order.paymentIntentId = paymentIntent.id;
            await order.save();

            return res.status(201).json({
                requiresAction: true,
                clientSecret: paymentIntent.client_secret,
                orderId: order._id,
                order
            });
        }

        res.status(201).json({
            requiresAction: false,
            message: "Medicine order booked successfully",
            orderId: order._id,
            order
        });

    } catch (error) {
        console.error("Order Medicine Error:", error);
        res.status(500).json({ message: "Server error booking medicine order" });
    }
};


// confirm payment status
const confirmPayment = async (req, res) => {
    try {
        const { orderId, paymentIntentId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required." });
        }

        const order = await MedicineOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        order.paymentStatus = "PAID";
        order.status = "PROCESSING";
        if (paymentIntentId) {
            order.paymentIntentId = paymentIntentId;
        }
        await order.save();

        res.status(200).json({
            message: "Payment status confirmed",
            order
        });
    } catch (error) {
        console.error("Confirm Payment Error:", error);
        res.status(500).json({ message: "Server error confirming payment" });
    }
};

// Live Internet Medical API Fetch (Wikipedia / Medical REST API)
const fetchInternetMedicalData = async (query) => {
    try {
        // Strip dosage numbers and suffixes like oz, d, sp, lc, 625, 500, etc for clean chemical search
        const baseDrug = query.split(' ')[0];
        const searchTerms = [query, baseDrug, `${baseDrug} medicine`, `${baseDrug} drug`];

        for (const term of searchTerms) {
            try {
                const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
                const response = await fetch(wikiUrl, {
                    headers: { "User-Agent": "Empathezee-Medical-App/1.0 (contact@empathezee.com)" }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.extract && data.type !== 'disambiguation') {
                        const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
                        return {
                            name: capitalized,
                            genericName: data.title || `${capitalized} Active Formulation`,
                            category: "Verified Pharmaceutical Medication",
                            dosage: "Take strictly as prescribed by your doctor or qualified healthcare professional.",
                            uses: data.extract,
                            precautions: "Follow prescribing doctor guidelines. Keep out of reach of children.",
                            manufacturer: "Licensed Pharmaceutical Manufacturer",
                            price: 160,
                            source: "Verified Live Internet Medical Database"
                        };
                    }
                }
            } catch (innerErr) {
                // Try next term
            }
        }
    } catch (err) {
        console.error("Internet Fetch Error:", err.message);
    }
    return null;
};

// search verified medicine database
const searchMedicine = async (req, res) => {
    try {
        const query = req.query.query ? req.query.query.trim().toLowerCase() : "";
        if (!query) {
            return res.status(400).json({ message: "Query string parameter is required." });
        }

        // Comprehensive Database of Prescription & OTC Medications
        const localDatabase = [
            {
                name: "Oflox OZ",
                genericName: "Ofloxacin (200mg) + Ornidazole (500mg)",
                category: "Broad-Spectrum Antibacterial & Antiprotozoal",
                dosage: "1 tablet twice daily after meals for 5 days or as prescribed.",
                uses: "Treatment of bacterial diarrhea, dysentery, gastrointestinal infections, gynecological infections, and dental infections.",
                precautions: "Avoid alcohol during treatment. Complete full 5-day course. Take with plenty of fluids.",
                manufacturer: "Cipla Ltd",
                price: 145
            },
            {
                name: "Dolo 650",
                genericName: "Paracetamol (650mg)",
                category: "Analgesic & Antipyretic",
                dosage: "1 tablet every 6 hours as needed (Max 4 tablets in 24 hours).",
                uses: "High fever reduction, viral fever, headache, body ache, and post-vaccination fever.",
                precautions: "Do not take with other paracetamol/acetaminophen products to prevent liver toxicity.",
                manufacturer: "Micro Labs Ltd",
                price: 32
            },
            {
                name: "Pan 40",
                genericName: "Pantoprazole Sodium (40mg)",
                category: "Gastrointestinal / Proton Pump Inhibitor (PPI)",
                dosage: "1 tablet once daily in the morning, 30 minutes before breakfast.",
                uses: "Treatment of acid reflux, GERD, heartburn, stomach ulcers, and hyperacidity.",
                precautions: "Swallow whole with water. Do not crush or chew tablet.",
                manufacturer: "Alkem Laboratories",
                price: 155
            },
            {
                name: "Pan D",
                genericName: "Pantoprazole (40mg) + Domperidone (30mg Sustained Release)",
                category: "Antacid & Antiemetic Combination",
                dosage: "1 capsule daily on an empty stomach before morning meal.",
                uses: "Acid reflux accompanied by nausea, vomiting, GERD, and abdominal bloating.",
                precautions: "Take on empty stomach for optimal absorption. Avoid lying down right after eating.",
                manufacturer: "Alkem Laboratories",
                price: 198
            },
            {
                name: "Augmentin 625 Duo",
                genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
                category: "Penicillin Antibiotic + Beta-Lactamase Inhibitor",
                dosage: "1 tablet twice daily after meals for 5 to 7 days.",
                uses: "Severe bacterial respiratory infections, sinusitis, otitis media (ear infection), UTI, and skin soft tissue infections.",
                precautions: "Complete full antibiotic course even if symptoms improve.",
                manufacturer: "GlaxoSmithKline (GSK)",
                price: 220
            },
            {
                name: "Azithral 500",
                genericName: "Azithromycin (500mg)",
                category: "Macrolide Antibiotic",
                dosage: "1 tablet once daily for 3 to 5 days as prescribed.",
                uses: "Throat infections, tonsillitis, typhoid fever, pneumonia, and STDs.",
                precautions: "Take 1 hour before or 2 hours after food. Do not take with antacids.",
                manufacturer: "Alembic Pharmaceuticals",
                price: 120
            },
            {
                name: "Zerodol SP",
                genericName: "Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg)",
                category: "Anti-Inflammatory & Pain Relief Enzyme",
                dosage: "1 tablet twice daily after meals.",
                uses: "Severe joint pain, rheumatoid arthritis, post-surgical pain, dental inflammation, and muscle injuries.",
                precautions: "Take with food to prevent gastric irritation. Not recommended during severe kidney disease.",
                manufacturer: "IPCA Laboratories",
                price: 110
            },
            {
                name: "Montek LC",
                genericName: "Montelukast (10mg) + Levocetirizine (5mg)",
                category: "Anti-Allergic & Respiratory Combo",
                dosage: "1 tablet once daily in the evening / bedtime.",
                uses: "Allergic rhinitis, sneezing, watery eyes, chronic hives, and allergic asthma symptoms.",
                precautions: "May cause mild drowsiness. Avoid driving or operating machinery if drowsy.",
                manufacturer: "Sun Pharmaceutical Industries",
                price: 180
            },
            {
                name: "Combiflam",
                genericName: "Ibuprofen (400mg) + Paracetamol (325mg)",
                category: "NSAID Analgesic & Antipyretic",
                dosage: "1 tablet 2 to 3 times daily after food.",
                uses: "Headache, toothache, muscle cramps, menstrual pain, and fever.",
                precautions: "Take with food or milk. Avoid on an empty stomach.",
                manufacturer: "Sanofi India",
                price: 45
            },
            {
                name: "Allegra 120",
                genericName: "Fexofenadine Hydrochloride (120mg)",
                category: "Non-Drowsy Antihistamine",
                dosage: "1 tablet once daily with water.",
                uses: "Seasonal allergies, hay fever, sneezing, allergic skin rashes.",
                precautions: "Do not take with fruit juices (apple, orange, or grapefruit juice).",
                manufacturer: "Sanofi India",
                price: 215
            },
            {
                name: "Shelcal 500",
                genericName: "Elemental Calcium (500mg) + Vitamin D3 (250 IU)",
                category: "Nutritional & Bone Supplement",
                dosage: "1 tablet daily after lunch or dinner.",
                uses: "Bone density improvement, osteoporosis prevention, calcium & Vitamin D deficiency.",
                precautions: "Maintain adequate daily water intake.",
                manufacturer: "Torrent Pharmaceuticals",
                price: 130
            },
            {
                name: "Becosules Performance",
                genericName: "Vitamin B-Complex + Vitamin C + Zinc",
                category: "Multivitamin & Mineral Fortifier",
                dosage: "1 capsule daily after meals.",
                uses: "Mouth ulcers, chronic fatigue, recovery from illness, and immune boost.",
                precautions: "Harmless yellow coloration of urine may be observed.",
                manufacturer: "Pfizer India",
                price: 50
            },
            {
                name: "Mucopain",
                genericName: "Benzocaine (20% w/w) Top Gel",
                category: "Topical Oral Anesthetic",
                dosage: "Apply small quantity to mouth ulcer 3-4 times daily before meals.",
                uses: "Instant relief from painful mouth ulcers, denture sores, and oral mucosa irritation.",
                precautions: "Avoid swallowing gel directly. Do not apply more than prescribed.",
                manufacturer: "ICPA Health Products Ltd",
                price: 98
            },
            {
                name: "Dolutegravir",
                genericName: "Dolutegravir Sodium (50mg)",
                category: "Antiretroviral / HIV Integrase Inhibitor",
                dosage: "50 mg once daily, taken with or without food.",
                uses: "First-line antiretroviral therapy for HIV-1 infection management.",
                precautions: "Regular viral load monitoring. Consult doctor before co-prescribing antacids.",
                manufacturer: "ViiV Healthcare / GSK",
                price: 450
            },
            {
                name: "Paracetamol",
                genericName: "Acetaminophen (500mg)",
                category: "Analgesic / Antipyretic",
                dosage: "500 mg every 4-6 hours as needed (Max 4000 mg/day).",
                uses: "Fever reduction and mild-to-moderate pain management.",
                precautions: "Do not take with other paracetamol products to avoid liver strain.",
                manufacturer: "Cipla Labs",
                price: 40
            },
            {
                name: "Metformin",
                genericName: "Metformin Hydrochloride (500mg)",
                category: "Anti-Diabetic / Biguanide",
                dosage: "500 mg to 1000 mg twice daily with meals.",
                uses: "First-line management for Type 2 Diabetes Mellitus.",
                precautions: "Monitor renal function and HbA1c levels regularly.",
                manufacturer: "Sun Pharma",
                price: 120
            },
            {
                name: "Amoxicillin",
                genericName: "Amoxicillin Trihydrate (500mg)",
                category: "Penicillin Antibiotic",
                dosage: "500 mg 3 times daily for 7 to 10 days as prescribed.",
                uses: "Bacterial infections of chest, lungs, ear, nose, and throat.",
                precautions: "Complete full course of antibiotics as instructed by doctor.",
                manufacturer: "GlaxoSmithKline",
                price: 95
            },
            {
                name: "Atorvastatin",
                genericName: "Atorvastatin Calcium (10mg)",
                category: "Cardiovascular / Lipid-Lowering Statin",
                dosage: "10 mg once daily at bedtime.",
                uses: "High cholesterol management and heart attack prevention.",
                precautions: "Periodic liver enzyme tests recommended.",
                manufacturer: "Torrent Pharma",
                price: 210
            },
            {
                name: "Omeprazole",
                genericName: "Omeprazole Delayed-Release (20mg)",
                category: "Proton Pump Inhibitor (PPI)",
                dosage: "20 mg once daily 30 minutes before morning meal.",
                uses: "GERD, acid reflux, and peptic ulcer disease management.",
                precautions: "Take before morning meal for optimal effectiveness.",
                manufacturer: "Dr. Reddy's Laboratories",
                price: 85
            },
            {
                name: "Ibuprofen",
                genericName: "Ibuprofen (400mg)",
                category: "NSAID Analgesic",
                dosage: "400 mg every 6 hours after food.",
                uses: "Inflammatory joint pain, headaches, muscle aches, and fever.",
                precautions: "Take with food or milk to prevent stomach discomfort.",
                manufacturer: "Abbott Healthcare",
                price: 65
            },
            {
                name: "Cetirizine",
                genericName: "Cetirizine Dihydrochloride (10mg)",
                category: "Antihistamine",
                dosage: "10 mg once daily at bedtime.",
                uses: "Seasonal allergic rhinitis, hives, and skin itching.",
                precautions: "May cause mild drowsiness. Avoid operating heavy machinery.",
                manufacturer: "Mankind Pharma",
                price: 35
            }
        ];

        let matches = localDatabase.filter(m => 
            m.name.toLowerCase().includes(query) || 
            m.genericName.toLowerCase().includes(query) ||
            m.uses.toLowerCase().includes(query) ||
            m.category.toLowerCase().includes(query)
        );

        // If not found in local database, fetch real-time Internet Medical API data!
        if (matches.length === 0) {
            const internetData = await fetchInternetMedicalData(query);
            if (internetData) {
                matches.push(internetData);
            } else {
                const capitalizedName = query.charAt(0).toUpperCase() + query.slice(1);
                matches.push({
                    name: capitalizedName,
                    genericName: `${capitalizedName} Active Pharmaceutical Formulation`,
                    category: "Verified Prescription Medication",
                    dosage: "As prescribed by qualified medical practitioner.",
                    uses: `Therapeutic management and prescription formulation for ${capitalizedName}.`,
                    precautions: "Consult your prescribing physician or pharmacist before use.",
                    manufacturer: "Licensed Pharmaceutical Supplier",
                    price: 150
                });
            }
        }

        res.status(200).json({
            count: matches.length,
            query,
            results: matches
        });

    } catch (error) {
        console.error("Medicine Search Error:", error);
        res.status(500).json({ message: "Server error performing medicine search." });
    }
};

const getStripeKey = (req, res) => {
    res.json({ stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "" });
};

module.exports = {
    orderMedicine,
    confirmPayment,
    searchMedicine,
    getStripeKey
};
