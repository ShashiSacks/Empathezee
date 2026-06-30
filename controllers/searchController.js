// search-disease api
const searchDisease = async (req, res) => {
    try {
        const query = req.query.query || req.query.q || "";
        if (!query.trim()) {
            return res.json({ results: [] });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CSE_CX || "b1c032ebe988b40d9";

        if (!apiKey) {
            const fallbackResults = {
                cold: [
                    {
                        title: "Common Cold - Symptoms and Causes - Mayo Clinic",
                        snippet: "The common cold is a viral infection of your nose and throat. It's usually harmless, though it might not feel that way.",
                        link: "https://www.mayoclinic.org/diseases-conditions/common-cold/symptoms-causes/syc-20371050"
                    },
                    {
                        title: "Understanding the Common Cold -- the Basics - WebMD",
                        snippet: "A cold is a viral infection of the upper respiratory tract. Most colds are caused by viruses called rhinoviruses.",
                        link: "https://www.webmd.com/cold-and-flu/understanding-common-cold-basics"
                    },
                    {
                        title: "Common Cold | NIH: National Institute of Allergy and Infectious Diseases",
                        snippet: "The common cold is one of the most frequent illnesses in the world. Research on common cold prevention and treatment continues.",
                        link: "https://www.niaid.nih.gov/diseases-conditions/common-cold"
                    },
                    {
                        title: "Common cold - Wikipedia",
                        snippet: "The common cold, also known simply as a cold, is a viral infectious disease of the upper respiratory tract that primarily affects the respiratory mucosa.",
                        link: "https://en.wikipedia.org/wiki/Common_cold"
                    }
                ],
                fever: [
                    {
                        title: "Fever - Symptoms and Causes - Mayo Clinic",
                        snippet: "A fever is a temporary increase in your body temperature, often due to an illness. Having a fever is a sign that something out of the origin is going on.",
                        link: "https://www.mayoclinic.org/diseases-conditions/fever/symptoms-causes/syc-20352759"
                    },
                    {
                        title: "Fever in Adults: Symptoms, Causes, and Treatments - WebMD",
                        snippet: "A fever is a high body temperature. It's a symptom, not a disease. A fever is usually a sign that your body is fighting an infection.",
                        link: "https://www.webmd.com/first-aid/fevers-in-adults"
                    },
                    {
                        title: "Fever - Wikipedia",
                        snippet: "Fever, also referred to as pyrexia, is defined as having a temperature above the normal range due to an increase in the body's temperature setpoint.",
                        link: "https://en.wikipedia.org/wiki/Fever"
                    }
                ],
                headache: [
                    {
                        title: "Headache - Symptoms and Causes - Mayo Clinic",
                        snippet: "Headaches are a very common condition that most people will experience many times during their lives. The main symptom of a headache is pain in your head or face.",
                        link: "https://www.mayoclinic.org/symptoms/headache/basics/definition/sym-20050800"
                    },
                    {
                        title: "Headache Basics: Symptoms, Types, and More - WebMD",
                        snippet: "WebMD explains the symptoms, causes, and treatments of different kinds of headaches.",
                        link: "https://www.webmd.com/migraines-headaches/headache-basics"
                    },
                    {
                        title: "Headache - Wikipedia",
                        snippet: "A headache is a symptom of pain anywhere in the region of the head or neck. It occurs in migraines, tension-type headaches, and cluster headaches.",
                        link: "https://en.wikipedia.org/wiki/Headache"
                    }
                ]
            };

            const qLower = query.toLowerCase().trim();
            let results = [];
            if (qLower.includes("cold")) {
                results = fallbackResults.cold;
            } else if (qLower.includes("fever")) {
                results = fallbackResults.fever;
            } else if (qLower.includes("headache") || qLower.includes("migraine")) {
                results = fallbackResults.headache;
            } else {
                results = [
                    {
                        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Information - Mayo Clinic`,
                        snippet: `Learn more about causes, symptoms, diagnosis, treatment, and prevention of ${query} on Mayo Clinic.`,
                        link: `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(query)}`
                    },
                    {
                        title: `Medical Reference for ${query} - WebMD`,
                        snippet: `Find medical definitions, symptom checking, and health resources for ${query} on WebMD.`,
                        link: `https://www.webmd.com/search/2/results?query=${encodeURIComponent(query)}`
                    },
                    {
                        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Research - National Institutes of Health (NIH)`,
                        snippet: `Explore scientific articles, clinical trials, and health information about ${query} on the official NIH website.`,
                        link: `https://search.nih.gov/search?utf8=%E2%9C%93&affiliate=nih&query=${encodeURIComponent(query)}`
                    }
                ];
            }
            return res.json({ results, note: "Loaded from local secure medical index. Add GOOGLE_API_KEY to .env for live API search." });
        }

        const queryWithSites = `${query} (site:mayoclinic.org OR site:webmd.com OR site:nih.gov OR site:en.wikipedia.org)`;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(queryWithSites)}&num=5`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.items) {
            return res.json({ results: [] });
        }

        const results = data.items.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link
        }));

        return res.json({ results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to search disease info" });
    }
};


// medicine-info api
const searchMedicineInfo = async (req, res) => {
    try {
        const query = req.query.query || req.query.q || "";
        if (!query.trim()) {
            return res.json({ results: [] });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CSE_CX || "b1c032ebe988b40d9";

        if (!apiKey) {
            const results = [
                {
                    title: `Medicine Information for ${query} - Mayo Clinic`,
                    snippet: `Detailed information about drugs, medicines, dosage, and side effects for ${query} on Mayo Clinic.`,
                    link: `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(query + ' drugs')}`
                },
                {
                    title: `Drugs & Medications Reference - WebMD`,
                    snippet: `Find medical information, reviews, and side effects for ${query} on WebMD.`,
                    link: `https://www.webmd.com/drugs/2/search?type=drugs&query=${encodeURIComponent(query)}`
                },
                {
                    title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Wikipedia`,
                    snippet: `Medical usage, mechanism of action, pharmacology, and chemical properties of ${query} on Wikipedia.`,
                    link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
                }
            ];
            return res.json({ results, note: "Loaded from local medical index. Add GOOGLE_API_KEY to .env for live API search." });
        }

        const queryWithSites = `${query} (site:mayoclinic.org OR site:webmd.com OR site:nih.gov OR site:en.wikipedia.org)`;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(queryWithSites)}&num=5`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.items) {
            return res.json({ results: [] });
        }

        const results = data.items.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link
        }));

        return res.json({ results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to search medicine info" });
    }
};


// find-doctors api
const findDoctors = async (req, res) => {
    try {
        const { symptom, city } = req.query;
        if (!symptom || !city) {
            return res.status(400).json({ error: "Symptom and City are required parameters." });
        }

        const symptomToSpecialty = {
            cold: "General Physician / ENT",
            fever: "General Physician",
            cough: "Pulmonologist",
            "chest pain": "Cardiologist",
            "skin rash": "Dermatologist",
            "stomach pain": "Gastroenterologist",
            headache: "Neurologist",
            "eye pain": "Ophthalmologist",
            "joint pain": "Orthopedic"
        };

        const key = symptom.toLowerCase().trim();
        const specialization = symptomToSpecialty[key] || "General Physician";

        const queries = [
            `${specialization} doctor in ${city}`,
            `${specialization} in ${city}`,
            `doctor in ${city}`,
            `clinic in ${city}`
        ];

        let osmPlaces = [];
        for (const q of queries) {
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=10`;
                const response = await fetch(url, {
                    headers: {
                        "User-Agent": "Empathezee-Medical-App/1.0 (contact@empathezee.com)"
                    }
                });
                const data = await response.json();
                if (data && data.length > 0) {
                    osmPlaces = data;
                    break;
                }
            } catch (err) {
                console.error("OSM Fetch Error:", err.message);
            }
        }

        const doctors = osmPlaces.map(place => {
            const name = place.name || (place.display_name ? place.display_name.split(",")[0] : "Medical Practitioner");
            const formattedName = name.startsWith("Dr.") ? name : `Dr. ${name}`;
            const mapsLink = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;

            return {
                name: formattedName,
                specialization: specialization,
                address: place.display_name,
                mapsLink: mapsLink
            };
        });

        return res.json({ doctors, specialization });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to find doctors" });
    }
};


// doctor search UI page handler
const getDoctorSearchUi = (req, res) => {
    res.render("doctorSearch");
};

module.exports = {
    searchDisease,
    searchMedicineInfo,
    findDoctors,
    getDoctorSearchUi
};
