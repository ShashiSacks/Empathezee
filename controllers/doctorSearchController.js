// query osm local specialist doctors
const searchDoctors = async (req, res) => {
    try {
        const { symptom, city } = req.query;

        // perform osm search if query details provided
        if (symptom && city) {
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

            // query chain fallbacks
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
        }

        // render default search view
        return res.render("doctors/search");

    } catch (err) {
        console.error("Doctor Search Error:", err);
        return res.status(500).json({ error: "Failed to perform doctor search" });
    }
};

module.exports = {
    searchDoctors
};
