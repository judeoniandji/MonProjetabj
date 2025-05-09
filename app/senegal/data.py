"""
Données des entreprises, universités et offres d'emploi sénégalaises
pour l'application Campus Connect
"""

# Universités sénégalaises
SENEGAL_UNIVERSITIES = [
    {
        "id": "ucad",
        "name": "Université Cheikh Anta Diop (UCAD)",
        "location": "Dakar",
        "description": "Fondée en 1957, l'UCAD est la plus grande et la plus ancienne université du Sénégal, offrant une large gamme de programmes académiques.",
        "website": "https://www.ucad.sn",
        "logo": "/static/images/universities/ucad.png",
        "programs": ["Sciences", "Médecine", "Droit", "Économie", "Lettres", "Sciences sociales"],
        "student_count": 80000
    },
    {
        "id": "ugb",
        "name": "Université Gaston Berger (UGB)",
        "location": "Saint-Louis",
        "description": "Fondée en 1990, l'UGB est reconnue pour son excellence académique et son campus moderne.",
        "website": "https://www.ugb.sn",
        "logo": "/static/images/universities/ugb.png",
        "programs": ["Sciences juridiques", "Économie", "Lettres", "Sciences appliquées", "Informatique"],
        "student_count": 15000
    },
    {
        "id": "uadb",
        "name": "Université Alioune Diop de Bambey (UADB)",
        "location": "Bambey",
        "description": "Fondée en 2009, l'UADB est une université publique qui se concentre sur le développement rural et l'agriculture.",
        "website": "https://www.uadb.edu.sn",
        "logo": "/static/images/universities/uadb.png",
        "programs": ["Agriculture", "Sciences économiques", "Sciences de l'éducation", "Informatique"],
        "student_count": 8000
    },
    {
        "id": "UT",
        "name": "Université de Thiès (UT)",
        "location": "Thiès",
        "description": "Fondée en 2007, l'UT est spécialisée dans les sciences de l'ingénieur et l'agriculture.",
        "website": "https://www.univ-thies.sn",
        "logo": "/static/images/universities/ut.png",
        "programs": ["Ingénierie", "Agriculture", "Sciences économiques", "Santé"],
        "student_count": 10000
    },
    {
        "id": "uz",
        "name": "Université de Ziguinchor (UZ)",
        "location": "Ziguinchor",
        "description": "Fondée en 2007, l'UZ est une université publique située dans le sud du Sénégal.",
        "website": "https://univ-zig.sn",
        "logo": "/static/images/universities/uz.png",
        "programs": ["Sciences", "Lettres", "Économie", "Informatique"],
        "student_count": 7000
    },
    {
        "id": "isi",
        "name": "Institut Supérieur d'Informatique (ISI)",
        "location": "Dakar",
        "description": "École d'ingénieurs spécialisée dans les technologies de l'information et de la communication.",
        "website": "https://isi.sn",
        "logo": "/static/images/universities/isi.png",
        "programs": ["Informatique", "Réseaux", "Sécurité informatique", "Intelligence artificielle"],
        "student_count": 2000
    },
    {
        "id": "esp",
        "name": "École Supérieure Polytechnique (ESP)",
        "location": "Dakar",
        "description": "École d'ingénieurs rattachée à l'UCAD, formant des ingénieurs dans divers domaines techniques.",
        "website": "https://esp.sn",
        "logo": "/static/images/universities/esp.png",
        "programs": ["Génie civil", "Génie électrique", "Génie mécanique", "Génie informatique"],
        "student_count": 3000
    },
    {
        "id": "iag",
        "name": "Institut Africain de Gestion (IAG)",
        "location": "Dakar",
        "description": "École de commerce offrant des formations en gestion et management.",
        "website": "https://iag.sn",
        "logo": "/static/images/universities/iag.png",
        "programs": ["Finance", "Marketing", "Ressources humaines", "Commerce international"],
        "student_count": 1500
    }
]

# Entreprises sénégalaises
SENEGAL_COMPANIES = [
    {
        "id": "sonatel",
        "name": "Sonatel (Orange Sénégal)",
        "industry": "Télécommunications",
        "location": "Dakar",
        "description": "Leader des télécommunications au Sénégal et en Afrique de l'Ouest, offrant des services de téléphonie mobile, internet et télévision.",
        "website": "https://www.orange.sn",
        "logo": "/static/images/companies/sonatel.png",
        "employee_count": 2000,
        "founded_year": 1985
    },
    {
        "id": "sgbs",
        "name": "Société Générale de Banques au Sénégal (SGBS)",
        "industry": "Finance",
        "location": "Dakar",
        "description": "Filiale du groupe Société Générale, offrant des services bancaires aux particuliers et aux entreprises.",
        "website": "https://www.societegenerale.sn",
        "logo": "/static/images/companies/sgbs.png",
        "employee_count": 800,
        "founded_year": 1962
    },
    {
        "id": "css",
        "name": "Compagnie Sucrière Sénégalaise (CSS)",
        "industry": "Agroalimentaire",
        "location": "Richard-Toll",
        "description": "Plus grande entreprise agroalimentaire du Sénégal, spécialisée dans la production de sucre.",
        "website": "https://www.css.sn",
        "logo": "/static/images/companies/css.png",
        "employee_count": 5000,
        "founded_year": 1970
    },
    {
        "id": "sar",
        "name": "Société Africaine de Raffinage (SAR)",
        "industry": "Énergie",
        "location": "Dakar",
        "description": "Unique raffinerie de pétrole du Sénégal, traitant le pétrole brut pour produire des carburants et lubrifiants.",
        "website": "https://www.sar.sn",
        "logo": "/static/images/companies/sar.png",
        "employee_count": 600,
        "founded_year": 1963
    },
    {
        "id": "wave",
        "name": "Wave Mobile Money",
        "industry": "Fintech",
        "location": "Dakar",
        "description": "Entreprise de technologie financière offrant des services de transfert d'argent mobile à faible coût.",
        "website": "https://www.wave.com",
        "logo": "/static/images/companies/wave.png",
        "employee_count": 300,
        "founded_year": 2018
    },
    {
        "id": "expresso",
        "name": "Expresso Sénégal",
        "industry": "Télécommunications",
        "location": "Dakar",
        "description": "Opérateur de téléphonie mobile et fournisseur d'accès internet au Sénégal.",
        "website": "https://www.expressotelecom.sn",
        "logo": "/static/images/companies/expresso.png",
        "employee_count": 500,
        "founded_year": 2009
    },
    {
        "id": "sedima",
        "name": "Sedima Group",
        "industry": "Agroalimentaire",
        "location": "Dakar",
        "description": "Leader dans la production avicole et la transformation alimentaire au Sénégal.",
        "website": "https://www.sedima.com",
        "logo": "/static/images/companies/sedima.png",
        "employee_count": 1200,
        "founded_year": 1976
    },
    {
        "id": "teranga_gold",
        "name": "Teranga Gold Corporation",
        "industry": "Mines",
        "location": "Kédougou",
        "description": "Entreprise minière exploitant l'or dans la région de Kédougou au sud-est du Sénégal.",
        "website": "https://www.terangagold.com",
        "logo": "/static/images/companies/teranga.png",
        "employee_count": 1000,
        "founded_year": 2010
    },
    {
        "id": "jumia",
        "name": "Jumia Sénégal",
        "industry": "E-commerce",
        "location": "Dakar",
        "description": "Plateforme de commerce électronique leader au Sénégal, offrant une large gamme de produits en ligne.",
        "website": "https://www.jumia.sn",
        "logo": "/static/images/companies/jumia.png",
        "employee_count": 200,
        "founded_year": 2012
    },
    {
        "id": "patisen",
        "name": "Patisen",
        "industry": "Agroalimentaire",
        "location": "Dakar",
        "description": "Entreprise agroalimentaire spécialisée dans la production de bouillons culinaires, mayonnaises et autres produits alimentaires.",
        "website": "https://www.patisen.sn",
        "logo": "/static/images/companies/patisen.png",
        "employee_count": 800,
        "founded_year": 1981
    },
    {
        "id": "oolu",
        "name": "Oolu Solar",
        "industry": "Énergie",
        "location": "Dakar",
        "description": "Entreprise d'énergie solaire fournissant des solutions d'énergie renouvelable aux ménages ruraux.",
        "website": "https://www.oolusolar.com",
        "logo": "/static/images/companies/oolu.png",
        "employee_count": 150,
        "founded_year": 2015
    },
    {
        "id": "nma_sanders",
        "name": "NMA Sanders",
        "industry": "Agroalimentaire",
        "location": "Dakar",
        "description": "Entreprise spécialisée dans la transformation de riz et autres céréales.",
        "website": "https://www.nma-sanders.com",
        "logo": "/static/images/companies/nma.png",
        "employee_count": 400,
        "founded_year": 1973
    }
]

# Offres d'emploi au Sénégal
SENEGAL_JOBS = [
    {
        "id": "sonatel_dev_1",
        "title": "Développeur Full-Stack",
        "company_id": "sonatel",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 500 000 - 2 000 000 FCFA",
        "description": "Rejoignez l'équipe de développement de Sonatel pour travailler sur nos plateformes numériques innovantes. Vous participerez au développement de solutions web et mobiles pour améliorer l'expérience client.",
        "required_skills": ["javascript", "react", "node_js", "java"],
        "field_of_study": "computer_science",
        "experience_years": "2-3",
        "posted_date": "2025-03-15",
        "application_deadline": "2025-04-30"
    },
    {
        "id": "wave_mobile_dev",
        "title": "Développeur Mobile (Android/iOS)",
        "company_id": "wave",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "2 000 000 - 2 500 000 FCFA",
        "description": "Wave recherche un développeur mobile talentueux pour rejoindre notre équipe produit. Vous travaillerez sur notre application de transfert d'argent mobile utilisée par des millions de Sénégalais.",
        "required_skills": ["android", "ios", "kotlin", "swift", "mobile_development"],
        "field_of_study": "computer_science",
        "experience_years": "3-5",
        "posted_date": "2025-03-20",
        "application_deadline": "2025-05-15"
    },
    {
        "id": "sgbs_analyst",
        "title": "Analyste Financier",
        "company_id": "sgbs",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 800 000 - 2 200 000 FCFA",
        "description": "La SGBS recherche un analyste financier pour rejoindre son département d'analyse de risques. Vous serez responsable de l'évaluation des demandes de crédit et de l'analyse des risques financiers.",
        "required_skills": ["finance", "risk_analysis", "excel", "financial_modeling"],
        "field_of_study": "finance",
        "experience_years": "2-4",
        "posted_date": "2025-03-10",
        "application_deadline": "2025-04-20"
    },
    {
        "id": "jumia_marketing",
        "title": "Responsable Marketing Digital",
        "company_id": "jumia",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 700 000 - 2 300 000 FCFA",
        "description": "Jumia Sénégal recherche un responsable marketing digital pour développer et mettre en œuvre des stratégies de marketing en ligne innovantes afin d'accroître notre présence sur le marché sénégalais.",
        "required_skills": ["digital_marketing", "seo", "social_media", "analytics", "content_creation"],
        "field_of_study": "marketing",
        "experience_years": "3-5",
        "posted_date": "2025-03-25",
        "application_deadline": "2025-05-10"
    },
    {
        "id": "expresso_network",
        "title": "Ingénieur Réseau Télécom",
        "company_id": "expresso",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 900 000 - 2 400 000 FCFA",
        "description": "Expresso Sénégal recherche un ingénieur réseau télécom pour rejoindre notre équipe technique. Vous serez responsable de la maintenance et de l'optimisation de notre infrastructure réseau.",
        "required_skills": ["networking", "cisco", "telecom", "4g_lte", "network_security"],
        "field_of_study": "telecommunications",
        "experience_years": "3-6",
        "posted_date": "2025-03-18",
        "application_deadline": "2025-04-25"
    },
    {
        "id": "oolu_solar_engineer",
        "title": "Ingénieur en Énergie Solaire",
        "company_id": "oolu",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 600 000 - 2 100 000 FCFA",
        "description": "Oolu Solar recherche un ingénieur en énergie solaire pour concevoir et superviser l'installation de systèmes solaires domestiques dans les zones rurales du Sénégal.",
        "required_skills": ["solar_energy", "electrical_engineering", "project_management", "autocad"],
        "field_of_study": "electrical_engineering",
        "experience_years": "2-4",
        "posted_date": "2025-03-22",
        "application_deadline": "2025-05-05"
    },
    {
        "id": "css_agronome",
        "title": "Ingénieur Agronome",
        "company_id": "css",
        "location": "Richard-Toll",
        "job_type": "full_time",
        "salary": "1 500 000 - 1 900 000 FCFA",
        "description": "La Compagnie Sucrière Sénégalaise recherche un ingénieur agronome pour superviser la production de canne à sucre et améliorer les rendements agricoles.",
        "required_skills": ["agronomy", "crop_management", "irrigation", "soil_science"],
        "field_of_study": "agriculture",
        "experience_years": "3-5",
        "posted_date": "2025-03-12",
        "application_deadline": "2025-04-22"
    },
    {
        "id": "sonatel_data_scientist",
        "title": "Data Scientist",
        "company_id": "sonatel",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "2 200 000 - 2 800 000 FCFA",
        "description": "Sonatel recherche un data scientist pour analyser les données clients et développer des modèles prédictifs afin d'améliorer nos services et notre prise de décision.",
        "required_skills": ["python", "machine_learning", "data_analysis", "sql", "statistics"],
        "field_of_study": "data_science",
        "experience_years": "3-5",
        "posted_date": "2025-03-28",
        "application_deadline": "2025-05-15"
    },
    {
        "id": "sedima_quality",
        "title": "Responsable Qualité",
        "company_id": "sedima",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 700 000 - 2 200 000 FCFA",
        "description": "Sedima Group recherche un responsable qualité pour assurer la conformité de nos produits alimentaires aux normes nationales et internationales.",
        "required_skills": ["quality_management", "haccp", "iso_standards", "food_safety"],
        "field_of_study": "food_science",
        "experience_years": "4-6",
        "posted_date": "2025-03-15",
        "application_deadline": "2025-04-30"
    },
    {
        "id": "wave_data_analyst",
        "title": "Analyste de Données",
        "company_id": "wave",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 800 000 - 2 300 000 FCFA",
        "description": "Wave recherche un analyste de données pour aider à comprendre les comportements des utilisateurs et optimiser nos services financiers mobiles.",
        "required_skills": ["sql", "python", "data_visualization", "excel", "statistics"],
        "field_of_study": "data_science",
        "experience_years": "2-4",
        "posted_date": "2025-03-25",
        "application_deadline": "2025-05-10"
    },
    {
        "id": "jumia_logistics",
        "title": "Responsable Logistique",
        "company_id": "jumia",
        "location": "Dakar",
        "job_type": "full_time",
        "salary": "1 600 000 - 2 100 000 FCFA",
        "description": "Jumia Sénégal recherche un responsable logistique pour optimiser notre chaîne d'approvisionnement et nos opérations de livraison dans tout le pays.",
        "required_skills": ["logistics", "supply_chain", "inventory_management", "operations"],
        "field_of_study": "logistics",
        "experience_years": "3-5",
        "posted_date": "2025-03-20",
        "application_deadline": "2025-05-05"
    },
    {
        "id": "sgbs_stage_finance",
        "title": "Stage en Finance d'Entreprise",
        "company_id": "sgbs",
        "location": "Dakar",
        "job_type": "internship",
        "salary": "150 000 - 200 000 FCFA",
        "description": "La SGBS propose un stage de 6 mois au sein de son département de finance d'entreprise. Une opportunité idéale pour les étudiants en finance souhaitant acquérir une expérience pratique.",
        "required_skills": ["finance", "excel", "accounting", "financial_analysis"],
        "field_of_study": "finance",
        "experience_years": "0-1",
        "posted_date": "2025-04-01",
        "application_deadline": "2025-04-30"
    },
    {
        "id": "sonatel_stage_dev",
        "title": "Stage en Développement Web",
        "company_id": "sonatel",
        "location": "Dakar",
        "job_type": "internship",
        "salary": "200 000 FCFA",
        "description": "Sonatel propose un stage de 6 mois en développement web au sein de notre équipe numérique. Vous participerez à des projets concrets et bénéficierez d'un mentorat par nos développeurs seniors.",
        "required_skills": ["html_css", "javascript", "php", "mysql"],
        "field_of_study": "computer_science",
        "experience_years": "0-1",
        "posted_date": "2025-04-02",
        "application_deadline": "2025-05-02"
    },
    {
        "id": "patisen_alternance",
        "title": "Alternance en Gestion de Production",
        "company_id": "patisen",
        "location": "Dakar",
        "job_type": "apprenticeship",
        "salary": "250 000 FCFA",
        "description": "Patisen propose une alternance d'un an en gestion de production industrielle. Vous alternerez entre formation théorique et pratique au sein de notre usine de production alimentaire.",
        "required_skills": ["production_management", "quality_control", "lean_manufacturing"],
        "field_of_study": "industrial_engineering",
        "experience_years": "0-1",
        "posted_date": "2025-03-30",
        "application_deadline": "2025-05-15"
    },
    {
        "id": "wave_freelance_ui",
        "title": "Designer UI/UX Freelance",
        "company_id": "wave",
        "location": "Remote",
        "job_type": "freelance",
        "salary": "Selon projet",
        "description": "Wave recherche un designer UI/UX freelance pour travailler sur des projets d'amélioration de notre application mobile. Possibilité de travailler à distance avec des réunions régulières à Dakar.",
        "required_skills": ["ui_design", "ux_design", "figma", "mobile_design", "user_research"],
        "field_of_study": "ux_design",
        "experience_years": "2-5",
        "posted_date": "2025-04-05",
        "application_deadline": "2025-05-20"
    }
]
