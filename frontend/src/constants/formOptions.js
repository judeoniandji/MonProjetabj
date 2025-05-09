/**
 * Options pour les formulaires de l'application
 * Ces constantes sont utilisées dans les composants de formulaire pour fournir des options cohérentes
 */

// Domaines d'études
export const STUDY_FIELDS = [
  { id: 'computer_science', name: 'Informatique' },
  { id: 'software_engineering', name: 'Génie logiciel' },
  { id: 'web_development', name: 'Développement web' },
  { id: 'mobile_development', name: 'Développement mobile' },
  { id: 'data_science', name: 'Science des données' },
  { id: 'artificial_intelligence', name: 'Intelligence artificielle' },
  { id: 'machine_learning', name: 'Apprentissage automatique' },
  { id: 'cybersecurity', name: 'Cybersécurité' },
  { id: 'cloud_computing', name: 'Cloud computing' },
  { id: 'ux_design', name: 'Design UX/UI' },
  { id: 'game_development', name: 'Développement de jeux vidéo' },
  { id: 'blockchain', name: 'Blockchain' },
  { id: 'iot', name: 'Internet des objets (IoT)' },
  { id: 'robotics', name: 'Robotique' },
  { id: 'business_intelligence', name: 'Business Intelligence' },
  { id: 'project_management', name: 'Gestion de projet' },
  { id: 'digital_marketing', name: 'Marketing digital' },
  { id: 'graphic_design', name: 'Design graphique' },
  { id: 'network_engineering', name: 'Ingénierie réseau' },
  { id: 'database_administration', name: 'Administration de bases de données' },
  { id: 'devops', name: 'DevOps' },
  { id: 'quality_assurance', name: 'Assurance qualité' },
  { id: 'business_analysis', name: 'Analyse d\'affaires' },
  { id: 'system_administration', name: 'Administration système' },
  { id: 'embedded_systems', name: 'Systèmes embarqués' },
  { id: 'telecommunications', name: 'Télécommunications' },
  { id: 'big_data', name: 'Big Data' },
  { id: 'ar_vr', name: 'Réalité augmentée/virtuelle' },
  { id: 'motion_design', name: 'Motion Design' },
  { id: 'product_management', name: 'Gestion de produit' }
];

// Compétences techniques
export const TECHNICAL_SKILLS = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'cpp', name: 'C++' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'swift', name: 'Swift' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'html_css', name: 'HTML/CSS' },
  { id: 'react', name: 'React' },
  { id: 'angular', name: 'Angular' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'node', name: 'Node.js' },
  { id: 'django', name: 'Django' },
  { id: 'flask', name: 'Flask' },
  { id: 'spring', name: 'Spring' },
  { id: 'dotnet', name: '.NET' },
  { id: 'laravel', name: 'Laravel' },
  { id: 'sql', name: 'SQL' },
  { id: 'mongodb', name: 'MongoDB' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'Google Cloud' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'git', name: 'Git' },
];

// Domaines d'expertise pour les mentors
export const EXPERTISE_FIELDS = [
  { id: 'career_guidance', name: 'Orientation professionnelle' },
  { id: 'technical_mentoring', name: 'Mentorat technique' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'entrepreneurship', name: 'Entrepreneuriat' },
  { id: 'project_management', name: 'Gestion de projet' },
  { id: 'soft_skills', name: 'Compétences relationnelles' },
  { id: 'public_speaking', name: 'Prise de parole en public' },
  { id: 'networking', name: 'Réseautage professionnel' },
  { id: 'resume_building', name: 'Rédaction de CV' },
  { id: 'interview_prep', name: 'Préparation aux entretiens' },
  { id: 'work_life_balance', name: 'Équilibre vie pro/perso' },
  { id: 'career_transition', name: 'Transition de carrière' },
  { id: 'personal_branding', name: 'Personal branding' },
  { id: 'remote_work', name: 'Travail à distance' },
];

// Secteurs d'industrie
export const INDUSTRY_SECTORS = [
  { id: 'technology', name: 'Technologie' },
  { id: 'finance', name: 'Finance' },
  { id: 'healthcare', name: 'Santé' },
  { id: 'education', name: 'Éducation' },
  { id: 'retail', name: 'Commerce de détail' },
  { id: 'manufacturing', name: 'Fabrication' },
  { id: 'media', name: 'Médias et divertissement' },
  { id: 'telecommunications', name: 'Télécommunications' },
  { id: 'transportation', name: 'Transport et logistique' },
  { id: 'energy', name: 'Énergie' },
  { id: 'real_estate', name: 'Immobilier' },
  { id: 'hospitality', name: 'Hôtellerie et tourisme' },
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'construction', name: 'Construction' },
  { id: 'consulting', name: 'Conseil' },
  { id: 'legal', name: 'Services juridiques' },
  { id: 'government', name: 'Gouvernement' },
  { id: 'nonprofit', name: 'Organisation à but non lucratif' },
  { id: 'automotive', name: 'Automobile' },
  { id: 'aerospace', name: 'Aérospatiale' },
  { id: 'pharmaceuticals', name: 'Pharmaceutique' },
  { id: 'biotech', name: 'Biotechnologie' },
  { id: 'food_beverage', name: 'Alimentation et boissons' },
  { id: 'advertising', name: 'Publicité et marketing' },
  { id: 'fashion', name: 'Mode et luxe' },
  { id: 'gaming', name: 'Jeux vidéo' },
  { id: 'sports', name: 'Sports' },
  { id: 'insurance', name: 'Assurance' },
  { id: 'environmental', name: 'Environnement' },
  { id: 'research', name: 'Recherche scientifique' }
];

// Types d'écoles/universités
export const SCHOOL_TYPES = [
  { id: 'university', name: 'Université' },
  { id: 'engineering_school', name: 'École d\'ingénieurs' },
  { id: 'business_school', name: 'École de commerce' },
  { id: 'art_school', name: 'École d\'art' },
  { id: 'technical_institute', name: 'Institut technique' },
  { id: 'vocational_school', name: 'École professionnelle' },
  { id: 'research_institute', name: 'Institut de recherche' },
  { id: 'online_learning', name: 'Plateforme d\'apprentissage en ligne' },
  { id: 'community_college', name: 'Collège communautaire' },
  { id: 'high_school', name: 'Lycée' }
];

// Niveaux d'expérience
export const EXPERIENCE_LEVELS = [
  { id: 'entry', name: 'Débutant (0-2 ans)' },
  { id: 'mid', name: 'Intermédiaire (3-5 ans)' },
  { id: 'senior', name: 'Senior (6-9 ans)' },
  { id: 'expert', name: 'Expert (10+ ans)' }
];

// Types d'emploi
export const JOB_TYPES = [
  { id: 'full_time', name: 'Temps plein' },
  { id: 'part_time', name: 'Temps partiel' },
  { id: 'contract', name: 'Contrat' },
  { id: 'temporary', name: 'Temporaire' },
  { id: 'internship', name: 'Stage' },
  { id: 'apprenticeship', name: 'Apprentissage' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'volunteer', name: 'Bénévolat' }
];

// Langues
export const LANGUAGES = [
  { id: 'french', name: 'Français' },
  { id: 'english', name: 'Anglais' },
  { id: 'spanish', name: 'Espagnol' },
  { id: 'german', name: 'Allemand' },
  { id: 'italian', name: 'Italien' },
  { id: 'portuguese', name: 'Portugais' },
  { id: 'dutch', name: 'Néerlandais' },
  { id: 'russian', name: 'Russe' },
  { id: 'chinese', name: 'Chinois' },
  { id: 'japanese', name: 'Japonais' },
  { id: 'arabic', name: 'Arabe' }
];

// Niveaux de langue
export const LANGUAGE_LEVELS = [
  { id: 'beginner', name: 'Débutant (A1/A2)' },
  { id: 'intermediate', name: 'Intermédiaire (B1/B2)' },
  { id: 'advanced', name: 'Avancé (C1)' },
  { id: 'native', name: 'Natif/Bilingue (C2)' }
];
