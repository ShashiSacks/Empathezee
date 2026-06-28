// location data for empathezee — cascading location picker
// contains all world countries + detailed india states/districts/cities

(function () {
    'use strict';

    // all countries (iso sorted)
    const COUNTRIES = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
        "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
        "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
        "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
        "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
        "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
        "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
        "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
        "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
        "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
        "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
        "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
        "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
        "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
        "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
        "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
        "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
        "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
        "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
        "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
        "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
        "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
        "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
        "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
        "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
        "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
        "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
        "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
        "Yemen", "Zambia", "Zimbabwe"
    ];

    // indian states & union territories → districts → cities/towns
    const INDIA_DATA = {
        "Andhra Pradesh": {
            "Anantapur": ["Anantapur", "Dharmavaram", "Hindupur", "Kadiri", "Guntakal", "Tadipatri", "Penukonda", "Rayadurg"],
            "Chittoor": ["Chittoor", "Tirupati", "Madanapalle", "Puttur", "Srikalahasti", "Nagari", "Punganur", "Palamaner", "Pileru"],
            "East Godavari": ["Kakinada", "Rajahmundry", "Amalapuram", "Samalkot", "Peddapuram", "Tuni", "Mandapeta", "Ramachandrapuram"],
            "Guntur": ["Guntur", "Tenali", "Narasaraopet", "Mangalagiri", "Bapatla", "Macherla", "Vinukonda", "Piduguralla", "Sattenapalli"],
            "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada", "Nuzvid", "Jaggayyapeta", "Nandigama", "Pedana", "Vuyyuru"],
            "Kurnool": ["Kurnool", "Nandyal", "Adoni", "Yemmiganur", "Dhone", "Allagadda", "Atmakur"],
            "Nellore": ["Nellore", "Gudur", "Kavali", "Atmakur", "Venkatagiri", "Sullurpeta"],
            "Prakasam": ["Ongole", "Markapur", "Chirala", "Kandukur", "Darsi", "Addanki"],
            "Srikakulam": ["Srikakulam", "Palasa", "Tekkali", "Narasannapeta", "Amadalavalasa", "Ichapuram"],
            "Visakhapatnam": ["Visakhapatnam", "Bhimavaram", "Anakapalle", "Narsipatnam", "Paderu", "Gajuwaka"],
            "Vizianagaram": ["Vizianagaram", "Bobbili", "Rajam", "Nellimarla", "Parvathipuram", "Salur"],
            "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem", "Tanuku", "Narsapuram", "Narasapuram", "Palacole", "Kovvur"],
            "YSR Kadapa": ["Kadapa", "Proddatur", "Rayachoti", "Rajampet", "Mydukur", "Jammalamadugu", "Pulivendla", "Badvel"]
        },
        "Arunachal Pradesh": {
            "Tawang": ["Tawang"],
            "West Kameng": ["Bomdila"],
            "East Kameng": ["Seppa"],
            "Papum Pare": ["Itanagar", "Naharlagun"],
            "Lower Subansiri": ["Ziro"],
            "Upper Subansiri": ["Daporijo"],
            "West Siang": ["Aalo"],
            "East Siang": ["Pasighat"],
            "Changlang": ["Changlang"],
            "Tirap": ["Khonsa"],
            "Lohit": ["Tezu"]
        },
        "Assam": {
            "Baksa": ["Mushalpur"],
            "Barpeta": ["Barpeta", "Barpeta Road"],
            "Cachar": ["Silchar"],
            "Darrang": ["Mangaldoi"],
            "Dhubri": ["Dhubri"],
            "Dibrugarh": ["Dibrugarh", "Naharkatia"],
            "Goalpara": ["Goalpara"],
            "Golaghat": ["Golaghat"],
            "Jorhat": ["Jorhat"],
            "Kamrup": ["Guwahati", "Amingaon"],
            "Kamrup Metropolitan": ["Guwahati", "Dispur"],
            "Karbi Anglong": ["Diphu"],
            "Karimganj": ["Karimganj"],
            "Lakhimpur": ["North Lakhimpur"],
            "Nagaon": ["Nagaon"],
            "Nalbari": ["Nalbari"],
            "Sivasagar": ["Sivasagar"],
            "Sonitpur": ["Tezpur"],
            "Tinsukia": ["Tinsukia"]
        },
        "Bihar": {
            "Araria": ["Araria"],
            "Aurangabad": ["Aurangabad"],
            "Begusarai": ["Begusarai"],
            "Bhagalpur": ["Bhagalpur"],
            "Bhojpur": ["Arrah"],
            "Darbhanga": ["Darbhanga"],
            "East Champaran": ["Motihari"],
            "Gaya": ["Gaya", "Bodh Gaya"],
            "Gopalganj": ["Gopalganj"],
            "Katihar": ["Katihar"],
            "Madhubani": ["Madhubani"],
            "Munger": ["Munger"],
            "Muzaffarpur": ["Muzaffarpur"],
            "Nalanda": ["Bihar Sharif", "Rajgir"],
            "Patna": ["Patna", "Danapur", "Patna City"],
            "Purnia": ["Purnia"],
            "Saharsa": ["Saharsa"],
            "Samastipur": ["Samastipur"],
            "Saran": ["Chapra"],
            "Sitamarhi": ["Sitamarhi"],
            "Vaishali": ["Hajipur"],
            "West Champaran": ["Bettiah"]
        },
        "Chhattisgarh": {
            "Bastar": ["Jagdalpur"],
            "Bilaspur": ["Bilaspur"],
            "Dhamtari": ["Dhamtari"],
            "Durg": ["Durg", "Bhilai"],
            "Janjgir-Champa": ["Janjgir"],
            "Korba": ["Korba"],
            "Raigarh": ["Raigarh"],
            "Raipur": ["Raipur", "Naya Raipur"],
            "Rajnandgaon": ["Rajnandgaon"],
            "Surguja": ["Ambikapur"]
        },
        "Goa": {
            "North Goa": ["Panaji", "Mapusa", "Vasco da Gama", "Calangute", "Bicholim", "Ponda"],
            "South Goa": ["Margao", "Vasco da Gama", "Quepem", "Cuncolim", "Canacona"]
        },
        "Gujarat": {
            "Ahmedabad": ["Ahmedabad", "Dholka", "Sanand", "Viramgam", "Dhandhuka"],
            "Amreli": ["Amreli"],
            "Anand": ["Anand", "Petlad", "Borsad"],
            "Banaskantha": ["Palanpur", "Deesa"],
            "Bharuch": ["Bharuch", "Ankleshwar"],
            "Bhavnagar": ["Bhavnagar", "Palitana", "Sihor"],
            "Gandhinagar": ["Gandhinagar"],
            "Jamnagar": ["Jamnagar"],
            "Junagadh": ["Junagadh", "Veraval"],
            "Kutch": ["Bhuj", "Gandhidham", "Anjar", "Mandvi"],
            "Mehsana": ["Mehsana", "Visnagar"],
            "Patan": ["Patan"],
            "Rajkot": ["Rajkot", "Morbi", "Gondal", "Jetpur"],
            "Surat": ["Surat", "Bardoli", "Navsari"],
            "Vadodara": ["Vadodara", "Padra", "Dabhoi"],
            "Valsad": ["Valsad", "Vapi"]
        },
        "Haryana": {
            "Ambala": ["Ambala", "Ambala Cantt"],
            "Bhiwani": ["Bhiwani"],
            "Faridabad": ["Faridabad"],
            "Fatehabad": ["Fatehabad"],
            "Gurugram": ["Gurugram", "Manesar"],
            "Hisar": ["Hisar"],
            "Jhajjar": ["Jhajjar"],
            "Jind": ["Jind"],
            "Kaithal": ["Kaithal"],
            "Karnal": ["Karnal"],
            "Kurukshetra": ["Kurukshetra", "Thanesar"],
            "Mahendragarh": ["Narnaul", "Mahendragarh"],
            "Panchkula": ["Panchkula"],
            "Panipat": ["Panipat"],
            "Rewari": ["Rewari"],
            "Rohtak": ["Rohtak"],
            "Sirsa": ["Sirsa"],
            "Sonipat": ["Sonipat"],
            "Yamunanagar": ["Yamunanagar", "Jagadhri"]
        },
        "Himachal Pradesh": {
            "Bilaspur": ["Bilaspur"],
            "Chamba": ["Chamba", "Dalhousie"],
            "Hamirpur": ["Hamirpur"],
            "Kangra": ["Dharamshala", "Kangra", "Palampur"],
            "Kullu": ["Kullu", "Manali"],
            "Mandi": ["Mandi"],
            "Shimla": ["Shimla"],
            "Sirmaur": ["Nahan"],
            "Solan": ["Solan"],
            "Una": ["Una"]
        },
        "Jharkhand": {
            "Bokaro": ["Bokaro Steel City"],
            "Deoghar": ["Deoghar"],
            "Dhanbad": ["Dhanbad"],
            "Dumka": ["Dumka"],
            "East Singhbhum": ["Jamshedpur"],
            "Giridih": ["Giridih"],
            "Hazaribagh": ["Hazaribagh"],
            "Ranchi": ["Ranchi"],
            "West Singhbhum": ["Chaibasa"]
        },
        "Karnataka": {
            "Bagalkot": ["Bagalkot"],
            "Ballari (Bellary)": ["Bellary", "Hospet"],
            "Belagavi (Belgaum)": ["Belgaum", "Gokak", "Athani"],
            "Bengaluru Rural": ["Devanahalli", "Nelamangala", "Doddaballapur"],
            "Bengaluru Urban": ["Bengaluru", "Yelahanka", "Whitefield", "Electronic City"],
            "Bidar": ["Bidar"],
            "Chamarajanagar": ["Chamarajanagar"],
            "Chikkaballapur": ["Chikkaballapur"],
            "Chikkamagaluru": ["Chikkamagaluru"],
            "Chitradurga": ["Chitradurga"],
            "Dakshina Kannada": ["Mangaluru", "Puttur", "Bantwal"],
            "Davanagere": ["Davanagere"],
            "Dharwad": ["Dharwad", "Hubli"],
            "Gadag": ["Gadag"],
            "Hassan": ["Hassan"],
            "Haveri": ["Haveri"],
            "Kalaburagi (Gulbarga)": ["Kalaburagi", "Gulbarga"],
            "Kodagu": ["Madikeri"],
            "Kolar": ["Kolar"],
            "Koppal": ["Koppal"],
            "Mandya": ["Mandya"],
            "Mysuru (Mysore)": ["Mysuru", "Nanjangud"],
            "Raichur": ["Raichur"],
            "Ramanagara": ["Ramanagara"],
            "Shivamogga (Shimoga)": ["Shivamogga"],
            "Tumakuru": ["Tumakuru"],
            "Udupi": ["Udupi"],
            "Uttara Kannada": ["Karwar", "Sirsi"],
            "Vijayapura (Bijapur)": ["Vijayapura"],
            "Yadgir": ["Yadgir"]
        },
        "Kerala": {
            "Alappuzha": ["Alappuzha", "Cherthala"],
            "Ernakulam": ["Kochi", "Aluva", "Perumbavoor", "Angamaly"],
            "Idukki": ["Painavu", "Munnar", "Thodupuzha"],
            "Kannur": ["Kannur", "Thalassery"],
            "Kasaragod": ["Kasaragod"],
            "Kollam": ["Kollam"],
            "Kottayam": ["Kottayam", "Pala"],
            "Kozhikode": ["Kozhikode", "Vadakara"],
            "Malappuram": ["Malappuram", "Manjeri", "Tirur"],
            "Palakkad": ["Palakkad", "Ottapalam"],
            "Pathanamthitta": ["Pathanamthitta"],
            "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara", "Attingal"],
            "Thrissur": ["Thrissur", "Irinjalakuda", "Chalakudy"],
            "Wayanad": ["Kalpetta"]
        },
        "Madhya Pradesh": {
            "Bhopal": ["Bhopal"],
            "Dewas": ["Dewas"],
            "Gwalior": ["Gwalior"],
            "Indore": ["Indore"],
            "Jabalpur": ["Jabalpur"],
            "Ratlam": ["Ratlam"],
            "Rewa": ["Rewa"],
            "Sagar": ["Sagar"],
            "Satna": ["Satna"],
            "Ujjain": ["Ujjain"],
            "Vidisha": ["Vidisha"]
        },
        "Maharashtra": {
            "Ahmednagar": ["Ahmednagar"],
            "Akola": ["Akola"],
            "Amravati": ["Amravati"],
            "Aurangabad": ["Aurangabad"],
            "Beed": ["Beed"],
            "Chandrapur": ["Chandrapur"],
            "Jalgaon": ["Jalgaon"],
            "Kolhapur": ["Kolhapur", "Ichalkaranji"],
            "Latur": ["Latur"],
            "Mumbai City": ["Mumbai"],
            "Mumbai Suburban": ["Andheri", "Borivali", "Kandivali", "Malad", "Goregaon", "Bandra"],
            "Nagpur": ["Nagpur"],
            "Nashik": ["Nashik", "Malegaon"],
            "Osmanabad": ["Osmanabad"],
            "Palghar": ["Palghar", "Vasai", "Virar"],
            "Pune": ["Pune", "Pimpri-Chinchwad", "Lonavala"],
            "Raigad": ["Alibag", "Panvel", "Uran"],
            "Ratnagiri": ["Ratnagiri"],
            "Sangli": ["Sangli", "Miraj"],
            "Satara": ["Satara"],
            "Solapur": ["Solapur"],
            "Thane": ["Thane", "Kalyan", "Dombivli", "Bhiwandi", "Ulhasnagar", "Navi Mumbai"]
        },
        "Manipur": {
            "Bishnupur": ["Bishnupur"],
            "Imphal East": ["Imphal"],
            "Imphal West": ["Imphal"],
            "Thoubal": ["Thoubal"]
        },
        "Meghalaya": {
            "East Khasi Hills": ["Shillong"],
            "West Garo Hills": ["Tura"],
            "Ri-Bhoi": ["Nongpoh"]
        },
        "Mizoram": {
            "Aizawl": ["Aizawl"],
            "Lunglei": ["Lunglei"]
        },
        "Nagaland": {
            "Dimapur": ["Dimapur"],
            "Kohima": ["Kohima"]
        },
        "Odisha": {
            "Angul": ["Angul"],
            "Balasore": ["Balasore"],
            "Berhampur": ["Berhampur"],
            "Bhubaneswar": ["Bhubaneswar"],
            "Cuttack": ["Cuttack"],
            "Ganjam": ["Berhampur", "Chatrapur"],
            "Jajpur": ["Jajpur"],
            "Jharsuguda": ["Jharsuguda"],
            "Kalahandi": ["Bhawanipatna"],
            "Khordha": ["Bhubaneswar"],
            "Koraput": ["Koraput", "Jeypore"],
            "Mayurbhanj": ["Baripada"],
            "Puri": ["Puri"],
            "Sambalpur": ["Sambalpur"],
            "Sundargarh": ["Rourkela"]
        },
        "Punjab": {
            "Amritsar": ["Amritsar"],
            "Barnala": ["Barnala"],
            "Bathinda": ["Bathinda"],
            "Faridkot": ["Faridkot"],
            "Firozpur": ["Firozpur"],
            "Gurdaspur": ["Gurdaspur", "Batala"],
            "Hoshiarpur": ["Hoshiarpur"],
            "Jalandhar": ["Jalandhar"],
            "Kapurthala": ["Kapurthala"],
            "Ludhiana": ["Ludhiana"],
            "Mansa": ["Mansa"],
            "Moga": ["Moga"],
            "Mohali": ["Mohali"],
            "Patiala": ["Patiala"],
            "Rupnagar": ["Rupnagar"],
            "Sangrur": ["Sangrur"]
        },
        "Rajasthan": {
            "Ajmer": ["Ajmer", "Pushkar", "Kishangarh"],
            "Alwar": ["Alwar", "Bhiwadi"],
            "Barmer": ["Barmer"],
            "Bharatpur": ["Bharatpur"],
            "Bikaner": ["Bikaner"],
            "Chittorgarh": ["Chittorgarh"],
            "Churu": ["Churu"],
            "Jaipur": ["Jaipur"],
            "Jaisalmer": ["Jaisalmer"],
            "Jhunjhunu": ["Jhunjhunu"],
            "Jodhpur": ["Jodhpur"],
            "Kota": ["Kota"],
            "Nagaur": ["Nagaur"],
            "Pali": ["Pali"],
            "Sikar": ["Sikar"],
            "Tonk": ["Tonk"],
            "Udaipur": ["Udaipur"]
        },
        "Sikkim": {
            "East Sikkim": ["Gangtok"],
            "West Sikkim": ["Gyalshing"],
            "North Sikkim": ["Mangan"],
            "South Sikkim": ["Namchi"]
        },
        "Tamil Nadu": {
            "Chennai": ["Chennai", "Tambaram", "Avadi", "Ambattur"],
            "Coimbatore": ["Coimbatore", "Mettupalayam", "Pollachi"],
            "Cuddalore": ["Cuddalore"],
            "Dharmapuri": ["Dharmapuri"],
            "Dindigul": ["Dindigul"],
            "Erode": ["Erode"],
            "Kancheepuram": ["Kancheepuram"],
            "Kanyakumari": ["Nagercoil", "Kanyakumari"],
            "Madurai": ["Madurai"],
            "Nagapattinam": ["Nagapattinam"],
            "Namakkal": ["Namakkal"],
            "Salem": ["Salem"],
            "Thanjavur": ["Thanjavur", "Kumbakonam"],
            "The Nilgiris": ["Ooty (Udhagamandalam)"],
            "Tiruchirappalli": ["Tiruchirappalli", "Srirangam"],
            "Tirunelveli": ["Tirunelveli"],
            "Tiruppur": ["Tiruppur"],
            "Vellore": ["Vellore"],
            "Villupuram": ["Villupuram"],
            "Virudhunagar": ["Virudhunagar"]
        },
        "Telangana": {
            "Adilabad": ["Adilabad"],
            "Bhadradri Kothagudem": ["Kothagudem"],
            "Hyderabad": ["Hyderabad"],
            "Jagtial": ["Jagtial"],
            "Jangaon": ["Jangaon"],
            "Jayashankar Bhupalpally": ["Bhupalpally"],
            "Karimnagar": ["Karimnagar"],
            "Khammam": ["Khammam"],
            "Mahabubnagar": ["Mahabubnagar"],
            "Mancherial": ["Mancherial"],
            "Medak": ["Medak"],
            "Medchal-Malkajgiri": ["Medchal", "Secunderabad"],
            "Nalgonda": ["Nalgonda"],
            "Nirmal": ["Nirmal"],
            "Nizamabad": ["Nizamabad"],
            "Peddapalli": ["Peddapalli"],
            "Rajanna Sircilla": ["Sircilla"],
            "Rangareddy": ["Shamshabad", "Shadnagar", "Ibrahimpatnam"],
            "Sangareddy": ["Sangareddy"],
            "Siddipet": ["Siddipet"],
            "Suryapet": ["Suryapet"],
            "Vikarabad": ["Vikarabad"],
            "Wanaparthy": ["Wanaparthy"],
            "Warangal Rural": ["Warangal"],
            "Warangal Urban": ["Warangal", "Hanamkonda"],
            "Yadadri Bhuvanagiri": ["Bhongir"]
        },
        "Tripura": {
            "West Tripura": ["Agartala"],
            "South Tripura": ["Udaipur"],
            "North Tripura": ["Dharmanagar"]
        },
        "Uttar Pradesh": {
            "Agra": ["Agra", "Firozabad", "Fatehpur Sikri"],
            "Aligarh": ["Aligarh"],
            "Allahabad (Prayagraj)": ["Prayagraj", "Naini"],
            "Ambedkar Nagar": ["Akbarpur"],
            "Azamgarh": ["Azamgarh"],
            "Bareilly": ["Bareilly"],
            "Bijnor": ["Bijnor"],
            "Bulandshahr": ["Bulandshahr"],
            "Gautam Buddh Nagar": ["Noida", "Greater Noida"],
            "Ghaziabad": ["Ghaziabad"],
            "Gorakhpur": ["Gorakhpur"],
            "Jhansi": ["Jhansi"],
            "Kanpur Nagar": ["Kanpur"],
            "Lucknow": ["Lucknow"],
            "Mathura": ["Mathura", "Vrindavan"],
            "Meerut": ["Meerut"],
            "Moradabad": ["Moradabad"],
            "Muzaffarnagar": ["Muzaffarnagar"],
            "Raebareli": ["Raebareli"],
            "Saharanpur": ["Saharanpur"],
            "Sultanpur": ["Sultanpur"],
            "Unnao": ["Unnao"],
            "Varanasi": ["Varanasi"]
        },
        "Uttarakhand": {
            "Almora": ["Almora"],
            "Chamoli": ["Chamoli", "Joshimath"],
            "Dehradun": ["Dehradun", "Mussoorie", "Rishikesh"],
            "Haridwar": ["Haridwar", "Roorkee"],
            "Nainital": ["Nainital", "Haldwani"],
            "Pithoragarh": ["Pithoragarh"],
            "Rudraprayag": ["Rudraprayag"],
            "Udham Singh Nagar": ["Kashipur", "Rudrapur"]
        },
        "West Bengal": {
            "Bankura": ["Bankura"],
            "Birbhum": ["Suri"],
            "Burdwan (Purba Bardhaman)": ["Bardhaman", "Durgapur", "Asansol"],
            "Darjeeling": ["Darjeeling", "Siliguri"],
            "Hooghly": ["Hooghly", "Chinsurah", "Serampore"],
            "Howrah": ["Howrah"],
            "Jalpaiguri": ["Jalpaiguri"],
            "Kolkata": ["Kolkata"],
            "Malda": ["Malda", "English Bazar"],
            "Murshidabad": ["Murshidabad", "Berhampore"],
            "Nadia": ["Krishnanagar", "Nabadwip", "Ranaghat"],
            "North 24 Parganas": ["Barasat", "Barrackpore", "Dum Dum"],
            "South 24 Parganas": ["Diamond Harbour", "Baruipur"],
            "Purulia": ["Purulia"]
        },
        // union territories
        "Andaman and Nicobar Islands": {
            "South Andaman": ["Port Blair"]
        },
        "Chandigarh": {
            "Chandigarh": ["Chandigarh"]
        },
        "Dadra and Nagar Haveli and Daman and Diu": {
            "Dadra and Nagar Haveli": ["Silvassa"],
            "Daman": ["Daman"],
            "Diu": ["Diu"]
        },
        "Delhi": {
            "Central Delhi": ["Connaught Place", "Karol Bagh", "Chandni Chowk"],
            "East Delhi": ["Preet Vihar", "Laxmi Nagar"],
            "New Delhi": ["New Delhi", "India Gate", "Parliament Street"],
            "North Delhi": ["Civil Lines", "Model Town"],
            "North East Delhi": ["Seelampur"],
            "North West Delhi": ["Rohini", "Pitampura"],
            "South Delhi": ["Hauz Khas", "Saket", "Greater Kailash"],
            "South East Delhi": ["Okhla", "Kalkaji"],
            "South West Delhi": ["Dwarka", "Vasant Kunj"],
            "West Delhi": ["Janakpuri", "Rajouri Garden"]
        },
        "Jammu and Kashmir": {
            "Anantnag": ["Anantnag"],
            "Baramulla": ["Baramulla"],
            "Jammu": ["Jammu"],
            "Kathua": ["Kathua"],
            "Pulwama": ["Pulwama"],
            "Rajouri": ["Rajouri"],
            "Srinagar": ["Srinagar"],
            "Udhampur": ["Udhampur"]
        },
        "Ladakh": {
            "Leh": ["Leh"],
            "Kargil": ["Kargil"]
        },
        "Lakshadweep": {
            "Lakshadweep": ["Kavaratti"]
        },
        "Puducherry": {
            "Puducherry": ["Puducherry"],
            "Karaikal": ["Karaikal"],
            "Mahe": ["Mahe"],
            "Yanam": ["Yanam"]
        }
    };

    // public api
    window.LOCATION_DATA = {
        getCountries: function () {
            return COUNTRIES.slice();
        },

        getStates: function (country) {
            if (country === 'India') {
                return Object.keys(INDIA_DATA).sort();
            }
            return [];
        },

        getDistricts: function (state) {
            if (INDIA_DATA[state]) {
                return Object.keys(INDIA_DATA[state]).sort();
            }
            return [];
        },

        getCities: function (district) {
            for (var state in INDIA_DATA) {
                if (INDIA_DATA[state][district]) {
                    return INDIA_DATA[state][district].slice();
                }
            }
            return [];
        },

        hasDetailedData: function (country) {
            return country === 'India';
        }
    };
})();
