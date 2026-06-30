const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Medicine = require("../models/Medicine");


const doctors = [
    // orthopedics
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
        bio: "Specialist in robotic joint replacement and complex trauma care at JB Hospital."
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
        username: "Praful Kilaru",
        email: "praful@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 39,
        gender: "male",
        disease: "Orthopedics",
        city: "Kadapa",
        bio: "Highly skilled surgeon treating routine and complex orthopedic cases."
    },

    // cardiology
    {
        username: "Sravan Kumar Nandaluru",
        email: "sravan@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 46,
        gender: "male",
        disease: "Cardiology",
        city: "Kadapa",
        bio: "Head of Interventional Cardiology with extensive clinical research at Vedanta Hospital."
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

    // pediatrics
    {
        username: "Sreekanth Surasura",
        email: "sreekanth@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 41,
        gender: "male",
        disease: "Pediatrics",
        city: "Kadapa",
        bio: "Specialist Pediatrician practicing advanced neonatal care at Life Care Children Hospital."
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
    },

    // dermatology
    {
        username: "Y. K. Reddy",
        email: "ykreddy@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 48,
        gender: "male",
        disease: "Dermatology",
        city: "Kadapa",
        bio: "Leading Dermatologist specializing in clinical dermatology and skin treatments."
    },
    {
        username: "C. Obulesu",
        email: "obulesu@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 49,
        gender: "male",
        disease: "Dermatology",
        city: "Kadapa",
        bio: "Consultant Dermatologist focusing on pediatric dermatology and allergy management."
    },

    // neurology
    {
        username: "Kranthi Kumar Sunnepaneni",
        email: "kranthi@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 47,
        gender: "male",
        disease: "Neurology",
        city: "Kadapa",
        bio: "Senior Consultant Neurosurgeon focusing on brain tumor and spine surgeries."
    },
    {
        username: "Sai Kiran",
        email: "saikiran@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 43,
        gender: "male",
        disease: "Neurology",
        city: "Kadapa",
        bio: "Consultant Neurosurgeon offering stroke care and neurological management."
    },
    {
        username: "Ganesh Vallampalli",
        email: "ganesh@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 40,
        gender: "male",
        disease: "Neurology",
        city: "Kadapa",
        bio: "Experienced Neuro-physician specializing in epilepsy, headache, and neuropathy."
    },

    // gynecology
    {
        username: "Vijaya K.",
        email: "vijaya@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 51,
        gender: "female",
        disease: "Gynecology",
        city: "Kadapa",
        bio: "Senior consultant gynecologist specializing in maternal care and normal delivery."
    },
    {
        username: "Nagalakshmi P.",
        email: "nagalakshmi@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 46,
        gender: "female",
        disease: "Gynecology",
        city: "Kadapa",
        bio: "Specialist in laparoscopic surgeries and fertility treatment."
    },

    // dentistry
    {
        username: "D. V. K. Kumar",
        email: "dvk@kadapadoctors.com",
        password: "password123",
        role: "doctor",
        age: 37,
        gender: "male",
        disease: "Dentistry",
        city: "Kadapa",
        bio: "Chief Dentist specializing in root canal treatments, implants, and laser cosmetic dentistry."
    }
];

const medicines = [
    {
        name: "Dolutegravir (Tivicay)",
        description: "Standard antiretroviral medication used to treat HIV/AIDS. Helps control virus levels.",
        disease: "HIV/AIDS",
        requiresPrescription: true
    },
    {
        name: "Tenofovir Disoproxil",
        description: "Anti-HIV medication often combined with other drugs for antiretroviral therapies.",
        disease: "HIV/AIDS",
        requiresPrescription: true
    },
    {
        name: "Abacavir (Ziagen)",
        description: "Nucleoside reverse transcriptase inhibitor used alongside other antiretrovirals.",
        disease: "HIV/AIDS",
        requiresPrescription: true
    },
    {
        name: "Paracetamol (Crocin)",
        description: "Common pain reliever and fever reducer tablet. Over the counter.",
        disease: "Fever & Pain",
        requiresPrescription: false
    },
    {
        name: "Ibuprofen (Brufen)",
        description: "Nonsteroidal anti-inflammatory drug (NSAID) used to treat fever, pain, and swelling.",
        disease: "Fever & Pain",
        requiresPrescription: false
    },
    {
        name: "Metformin (Glycomet)",
        description: "First-line oral diabetes medication that controls blood glucose levels.",
        disease: "Diabetes",
        requiresPrescription: true
    },
    {
        name: "Glipizide (Glucotrol)",
        description: "Sulfonylurea medication that stimulates insulin release to lower blood sugar.",
        disease: "Diabetes",
        requiresPrescription: true
    },
    {
        name: "Albuterol (Ventolin Inhaler)",
        description: "Fast-acting bronchodilator inhaler used for asthma attacks and wheezing.",
        disease: "Asthma",
        requiresPrescription: true
    },
    {
        name: "Montelukast (Singulair)",
        description: "Leukotriene receptor antagonist used for chronic asthma maintenance and allergies.",
        disease: "Asthma",
        requiresPrescription: true
    },
    {
        name: "Atorvastatin (Lipitor)",
        description: "Statin medication used to lower cholesterol and prevent cardiovascular risk.",
        disease: "Cardiology",
        requiresPrescription: true
    },
    {
        name: "Amlodipine (Amlopin)",
        description: "Calcium channel blocker that relaxes blood vessels to treat hypertension.",
        disease: "Cardiology",
        requiresPrescription: true
    },
    {
        name: "Amoxicillin (Mox)",
        description: "Broad-spectrum penicillin antibiotic used for ear, throat, and urinary infections.",
        disease: "Infections",
        requiresPrescription: true
    },
    {
        name: "Azithromycin (Azee)",
        description: "Macrolide antibiotic tablet used to treat bacterial respiratory infections.",
        disease: "Infections",
        requiresPrescription: true
    },
    {
        name: "Ketoconazole Cream",
        description: "Topical antifungal cream used to treat ringworm, athlete's foot, and skin infections.",
        disease: "Dermatology",
        requiresPrescription: false
    },
    {
        name: "Hydrocortisone Cream",
        description: "Steroid cream used to reduce skin irritation, itching, eczema, and rashes.",
        disease: "Dermatology",
        requiresPrescription: false
    }
];


// seed default doctors and medicines
const seedData = async () => {
    try {
        // seed doctors
        const doctorCount = await User.countDocuments({ role: "doctor" });
        if (doctorCount === 0) {
            console.log("Seeding default doctors...");
            const hashedPassword = await bcrypt.hash("password123", 10);
            for (const doc of doctors) {
                await User.create({
                    ...doc,
                    password: hashedPassword
                });
            }
            console.log(`Seeded ${doctors.length} doctors successfully.`);
        } else {
            console.log("Database already has doctors, skipping doctor seeding.");
        }

        // seed medicines
        const medicineCount = await Medicine.countDocuments();
        if (medicineCount === 0) {
            console.log("Seeding default medicines...");
            for (const med of medicines) {
                await Medicine.create(med);
            }
            console.log(`Seeded ${medicines.length} medicines successfully.`);
        } else {
            console.log("Database already has medicines, skipping medicine seeding.");
        }
    } catch (error) {
        console.error("Error seeding doctors/medicines:", error);
    }
};

module.exports = seedData;
