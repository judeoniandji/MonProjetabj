import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Box, 
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/api';
import { setUser, setToken } from '../../redux/authSlice';

// Supprimer toutes les données stockées localement
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
localStorage.removeItem('currentUser');
localStorage.removeItem('registeredUser');

// Domaines d'études
const STUDY_FIELDS = [
  // Sciences et Technologie
  { id: 'cs', name: 'Informatique', category: 'Sciences et Technologie' },
  { id: 'se', name: 'Génie Logiciel', category: 'Sciences et Technologie' },
  { id: 'ai', name: 'Intelligence Artificielle', category: 'Sciences et Technologie' },
  { id: 'ds', name: 'Science des Données', category: 'Sciences et Technologie' },
  { id: 'ce', name: 'Génie Informatique', category: 'Sciences et Technologie' },
  { id: 'ee', name: 'Génie Électrique', category: 'Sciences et Technologie' },
  { id: 'me', name: 'Génie Mécanique', category: 'Sciences et Technologie' },
  { id: 'cv', name: 'Génie Civil', category: 'Sciences et Technologie' },
  { id: 'bt', name: 'Biotechnologie', category: 'Sciences et Technologie' },
  { id: 'ph', name: 'Physique', category: 'Sciences et Technologie' },
  { id: 'ch', name: 'Chimie', category: 'Sciences et Technologie' },
  { id: 'ma', name: 'Mathématiques', category: 'Sciences et Technologie' },
  
  // Commerce et Gestion
  { id: 'ba', name: 'Administration des Affaires', category: 'Commerce et Gestion' },
  { id: 'ac', name: 'Comptabilité', category: 'Commerce et Gestion' },
  { id: 'fn', name: 'Finance', category: 'Commerce et Gestion' },
  { id: 'mk', name: 'Marketing', category: 'Commerce et Gestion' },
  { id: 'hr', name: 'Ressources Humaines', category: 'Commerce et Gestion' },
  { id: 'ib', name: 'Commerce International', category: 'Commerce et Gestion' },
  { id: 'en', name: 'Entrepreneuriat', category: 'Commerce et Gestion' },
  { id: 'sm', name: 'Gestion de la Chaîne d\'Approvisionnement', category: 'Commerce et Gestion' },
  
  // Sciences Humaines et Sociales
  { id: 'ps', name: 'Psychologie', category: 'Sciences Humaines et Sociales' },
  { id: 'so', name: 'Sociologie', category: 'Sciences Humaines et Sociales' },
  { id: 'an', name: 'Anthropologie', category: 'Sciences Humaines et Sociales' },
  { id: 'hi', name: 'Histoire', category: 'Sciences Humaines et Sociales' },
  { id: 'po', name: 'Sciences Politiques', category: 'Sciences Humaines et Sociales' },
  { id: 'ec', name: 'Économie', category: 'Sciences Humaines et Sociales' },
  { id: 'ir', name: 'Relations Internationales', category: 'Sciences Humaines et Sociales' },
  { id: 'co', name: 'Communication', category: 'Sciences Humaines et Sociales' },
  { id: 'li', name: 'Linguistique', category: 'Sciences Humaines et Sociales' },
  
  // Arts et Lettres
  { id: 'la', name: 'Langues et Littératures', category: 'Arts et Lettres' },
  { id: 'fa', name: 'Beaux-Arts', category: 'Arts et Lettres' },
  { id: 'mu', name: 'Musique', category: 'Arts et Lettres' },
  { id: 'th', name: 'Théâtre', category: 'Arts et Lettres' },
  { id: 'ci', name: 'Cinéma', category: 'Arts et Lettres' },
  { id: 'de', name: 'Design', category: 'Arts et Lettres' },
  { id: 'ar', name: 'Architecture', category: 'Arts et Lettres' },
  
  // Santé et Médecine
  { id: 'md', name: 'Médecine', category: 'Santé et Médecine' },
  { id: 'nu', name: 'Soins Infirmiers', category: 'Santé et Médecine' },
  { id: 'ph', name: 'Pharmacie', category: 'Santé et Médecine' },
  { id: 'pt', name: 'Physiothérapie', category: 'Santé et Médecine' },
  { id: 'nt', name: 'Nutrition', category: 'Santé et Médecine' },
  { id: 'dh', name: 'Santé Publique', category: 'Santé et Médecine' },
  
  // Éducation
  { id: 'te', name: 'Enseignement', category: 'Éducation' },
  { id: 'ed', name: 'Sciences de l\'Éducation', category: 'Éducation' },
  { id: 'sp', name: 'Éducation Spécialisée', category: 'Éducation' },
  
  // Droit et Administration
  { id: 'lw', name: 'Droit', category: 'Droit et Administration' },
  { id: 'pa', name: 'Administration Publique', category: 'Droit et Administration' },
  { id: 'cr', name: 'Criminologie', category: 'Droit et Administration' },
  
  // Environnement et Développement Durable
  { id: 'es', name: 'Sciences Environnementales', category: 'Environnement et Développement Durable' },
  { id: 'ag', name: 'Agriculture', category: 'Environnement et Développement Durable' },
  { id: 'fr', name: 'Foresterie', category: 'Environnement et Développement Durable' },
  { id: 'sd', name: 'Développement Durable', category: 'Environnement et Développement Durable' },
];

// Domaines d'expertise pour les mentors
const EXPERTISE_FIELDS = [
  // Développement Logiciel
  { id: 'web', name: 'Développement Web', category: 'Développement Logiciel' },
  { id: 'mob', name: 'Développement Mobile', category: 'Développement Logiciel' },
  { id: 'bck', name: 'Backend', category: 'Développement Logiciel' },
  { id: 'frt', name: 'Frontend', category: 'Développement Logiciel' },
  { id: 'dba', name: 'Bases de Données', category: 'Développement Logiciel' },
  { id: 'dvo', name: 'DevOps', category: 'Développement Logiciel' },
  { id: 'cld', name: 'Cloud Computing', category: 'Développement Logiciel' },
  
  // Data Science et IA
  { id: 'ml', name: 'Machine Learning', category: 'Data Science et IA' },
  { id: 'dl', name: 'Deep Learning', category: 'Data Science et IA' },
  { id: 'nlp', name: 'Traitement du Langage Naturel', category: 'Data Science et IA' },
  { id: 'cv', name: 'Vision par Ordinateur', category: 'Data Science et IA' },
  { id: 'da', name: 'Analyse de Données', category: 'Data Science et IA' },
  { id: 'bi', name: 'Business Intelligence', category: 'Data Science et IA' },
  
  // Gestion et Leadership
  { id: 'pm', name: 'Gestion de Projet', category: 'Gestion et Leadership' },
  { id: 'pd', name: 'Gestion de Produit', category: 'Gestion et Leadership' },
  { id: 'ld', name: 'Leadership', category: 'Gestion et Leadership' },
  { id: 'en', name: 'Entrepreneuriat', category: 'Gestion et Leadership' },
  { id: 'st', name: 'Stratégie d\'Entreprise', category: 'Gestion et Leadership' },
  
  // Design et UX
  { id: 'ux', name: 'UX Design', category: 'Design et UX' },
  { id: 'ui', name: 'UI Design', category: 'Design et UX' },
  { id: 'gd', name: 'Design Graphique', category: 'Design et UX' },
  { id: 'pd', name: 'Design de Produit', category: 'Design et UX' },
  
  // Marketing et Communication
  { id: 'dm', name: 'Marketing Digital', category: 'Marketing et Communication' },
  { id: 'sm', name: 'Marketing des Médias Sociaux', category: 'Marketing et Communication' },
  { id: 'cm', name: 'Gestion de Contenu', category: 'Marketing et Communication' },
  { id: 'pr', name: 'Relations Publiques', category: 'Marketing et Communication' },
  { id: 'br', name: 'Branding', category: 'Marketing et Communication' },
  
  // Finance et Comptabilité
  { id: 'fa', name: 'Analyse Financière', category: 'Finance et Comptabilité' },
  { id: 'in', name: 'Investissement', category: 'Finance et Comptabilité' },
  { id: 'ac', name: 'Comptabilité', category: 'Finance et Comptabilité' },
  { id: 'tx', name: 'Fiscalité', category: 'Finance et Comptabilité' },
  
  // Ressources Humaines
  { id: 'rc', name: 'Recrutement', category: 'Ressources Humaines' },
  { id: 'td', name: 'Formation et Développement', category: 'Ressources Humaines' },
  { id: 'cm', name: 'Gestion des Compétences', category: 'Ressources Humaines' },
  { id: 'er', name: 'Relations avec les Employés', category: 'Ressources Humaines' },
  
  // Santé et Bien-être
  { id: 'mh', name: 'Santé Mentale', category: 'Santé et Bien-être' },
  { id: 'wl', name: 'Bien-être au Travail', category: 'Santé et Bien-être' },
  { id: 'wm', name: 'Gestion du Stress', category: 'Santé et Bien-être' },
  
  // Développement Personnel
  { id: 'ps', name: 'Prise de Parole en Public', category: 'Développement Personnel' },
  { id: 'ng', name: 'Négociation', category: 'Développement Personnel' },
  { id: 'tm', name: 'Gestion du Temps', category: 'Développement Personnel' },
  { id: 'cr', name: 'Pensée Critique', category: 'Développement Personnel' },
  { id: 'ps', name: 'Résolution de Problèmes', category: 'Développement Personnel' },
];

// Secteurs d'activité pour les entreprises
const INDUSTRY_SECTORS = [
  { id: 'tech', name: 'Technologies de l\'Information' },
  { id: 'fin', name: 'Finance et Banque' },
  { id: 'hc', name: 'Santé et Pharmaceutique' },
  { id: 'edu', name: 'Éducation' },
  { id: 'mfg', name: 'Fabrication' },
  { id: 'ret', name: 'Commerce de Détail' },
  { id: 'tel', name: 'Télécommunications' },
  { id: 'med', name: 'Médias et Divertissement' },
  { id: 'eng', name: 'Ingénierie' },
  { id: 'cons', name: 'Construction' },
  { id: 'ene', name: 'Énergie' },
  { id: 'agr', name: 'Agriculture' },
  { id: 'food', name: 'Alimentation et Boissons' },
  { id: 'hosp', name: 'Hôtellerie et Tourisme' },
  { id: 'trans', name: 'Transport et Logistique' },
  { id: 'gov', name: 'Gouvernement et Secteur Public' },
  { id: 'ngo', name: 'ONG et Organisations à but non lucratif' },
  { id: 'cons', name: 'Conseil' },
  { id: 'legal', name: 'Services Juridiques' },
  { id: 'real', name: 'Immobilier' },
];

// Compétences techniques
const TECHNICAL_SKILLS = [
  // Langages de programmation
  { id: 'js', name: 'JavaScript', category: 'Langages de Programmation' },
  { id: 'py', name: 'Python', category: 'Langages de Programmation' },
  { id: 'java', name: 'Java', category: 'Langages de Programmation' },
  { id: 'cpp', name: 'C++', category: 'Langages de Programmation' },
  { id: 'cs', name: 'C#', category: 'Langages de Programmation' },
  { id: 'php', name: 'PHP', category: 'Langages de Programmation' },
  { id: 'rb', name: 'Ruby', category: 'Langages de Programmation' },
  { id: 'go', name: 'Go', category: 'Langages de Programmation' },
  { id: 'sw', name: 'Swift', category: 'Langages de Programmation' },
  { id: 'kt', name: 'Kotlin', category: 'Langages de Programmation' },
  { id: 'rs', name: 'Rust', category: 'Langages de Programmation' },
  { id: 'ts', name: 'TypeScript', category: 'Langages de Programmation' },
  
  // Frameworks et bibliothèques
  { id: 'rct', name: 'React', category: 'Frameworks et Bibliothèques' },
  { id: 'vue', name: 'Vue.js', category: 'Frameworks et Bibliothèques' },
  { id: 'ang', name: 'Angular', category: 'Frameworks et Bibliothèques' },
  { id: 'nde', name: 'Node.js', category: 'Frameworks et Bibliothèques' },
  { id: 'dj', name: 'Django', category: 'Frameworks et Bibliothèques' },
  { id: 'fl', name: 'Flask', category: 'Frameworks et Bibliothèques' },
  { id: 'spr', name: 'Spring', category: 'Frameworks et Bibliothèques' },
  { id: 'ror', name: 'Ruby on Rails', category: 'Frameworks et Bibliothèques' },
  { id: 'lrv', name: 'Laravel', category: 'Frameworks et Bibliothèques' },
  { id: 'tf', name: 'TensorFlow', category: 'Frameworks et Bibliothèques' },
  { id: 'pyt', name: 'PyTorch', category: 'Frameworks et Bibliothèques' },
  
  // Bases de données
  { id: 'sql', name: 'SQL', category: 'Bases de Données' },
  { id: 'mys', name: 'MySQL', category: 'Bases de Données' },
  { id: 'pgs', name: 'PostgreSQL', category: 'Bases de Données' },
  { id: 'mdb', name: 'MongoDB', category: 'Bases de Données' },
  { id: 'ora', name: 'Oracle', category: 'Bases de Données' },
  { id: 'rds', name: 'Redis', category: 'Bases de Données' },
  { id: 'cdb', name: 'Cassandra', category: 'Bases de Données' },
  
  // DevOps et Cloud
  { id: 'aws', name: 'AWS', category: 'DevOps et Cloud' },
  { id: 'azr', name: 'Azure', category: 'DevOps et Cloud' },
  { id: 'gcp', name: 'Google Cloud', category: 'DevOps et Cloud' },
  { id: 'dkr', name: 'Docker', category: 'DevOps et Cloud' },
  { id: 'kub', name: 'Kubernetes', category: 'DevOps et Cloud' },
  { id: 'jen', name: 'Jenkins', category: 'DevOps et Cloud' },
  { id: 'git', name: 'Git', category: 'DevOps et Cloud' },
  { id: 'trr', name: 'Terraform', category: 'DevOps et Cloud' },
  
  // Mobile
  { id: 'and', name: 'Android', category: 'Mobile' },
  { id: 'ios', name: 'iOS', category: 'Mobile' },
  { id: 'rn', name: 'React Native', category: 'Mobile' },
  { id: 'flu', name: 'Flutter', category: 'Mobile' },
  
  // Autres
  { id: 'agile', name: 'Agile/Scrum', category: 'Méthodologies' },
  { id: 'uiux', name: 'UI/UX Design', category: 'Design' },
  { id: 'sec', name: 'Cybersécurité', category: 'Sécurité' },
  { id: 'da', name: 'Analyse de Données', category: 'Data Science' },
  { id: 'ml', name: 'Machine Learning', category: 'Intelligence Artificielle' },
];

const SimpleRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    // Champs pour étudiant
    school: null,
    fieldOfStudy: null,
    skills: [],
    interests: [],
    careerGoals: '',
    // Champs pour université
    universityName: '',
    location: '',
    programs: [],
    // Champs pour entreprise
    companyName: '',
    industry: null,
    jobSectors: [],
    // Champs pour mentor
    expertise: null,
    mentorSkills: [],
    mentorExperience: '',
    availabilityHours: ''
  });

  // États pour le contrôle de l'UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [step, setStep] = useState(1); // Pour le formulaire multi-étapes
  const [errors, setErrors] = useState({}); // Pour la validation des champs

  // Vérifier s'il y a déjà un utilisateur enregistré dans le localStorage
  useEffect(() => {
    // Ne pas charger les données précédentes pour repartir de zéro
    localStorage.removeItem('registeredUser');
  }, []);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Réinitialiser l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Gérer le changement d'étape
  const handleNext = () => {
    // Valider l'étape actuelle
    const currentErrors = validateStep(step);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // Valider l'étape actuelle
  const validateStep = (currentStep) => {
    const stepErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        stepErrors.name = 'Le nom est requis';
      }
      
      if (!formData.email.trim()) {
        stepErrors.email = 'L\'email est requis';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          stepErrors.email = 'Format d\'email invalide';
        }
      }
      
      if (!formData.userType) {
        stepErrors.userType = 'Le type d\'utilisateur est requis';
      }
    } else if (currentStep === 2) {
      if (formData.userType === 'student') {
        if (!formData.school) {
          stepErrors.school = 'L\'école/université est requise';
        }
        if (!formData.fieldOfStudy) {
          stepErrors.fieldOfStudy = 'Le domaine d\'études est requis';
        }
      } else if (formData.userType === 'university') {
        if (!formData.universityName.trim()) {
          stepErrors.universityName = 'Le nom de l\'université est requis';
        }
        if (!formData.location.trim()) {
          stepErrors.location = 'La localisation est requise';
        }
      } else if (formData.userType === 'company') {
        if (!formData.companyName.trim()) {
          stepErrors.companyName = 'Le nom de l\'entreprise est requis';
        }
        if (!formData.industry) {
          stepErrors.industry = 'Le secteur d\'activité est requis';
        }
      } else if (formData.userType === 'mentor') {
        if (!formData.expertise) {
          stepErrors.expertise = 'Le domaine d\'expertise est requis';
        }
      }
    }
    
    return stepErrors;
  };

  // Fonction pour rediriger vers le tableau de bord approprié
  const redirectToDashboard = (userType) => {
    let route = '/';
    
    switch(userType) {
      case 'student':
        route = '/student/dashboard';
        break;
      case 'university':
        route = '/school/dashboard';
        break;
      case 'company':
        route = '/company/dashboard';
        break;
      case 'mentor':
        route = '/mentor/dashboard';
        break;
      case 'admin':
        route = '/admin/dashboard';
        break;
      default:
        route = '/student/dashboard';
    }
    
    // Redirection après un court délai pour permettre à l'utilisateur de voir le message de succès
    setTimeout(() => {
      navigate(route);
    }, 2000);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    if (!formData.name || !formData.email || !formData.userType) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format d\'email invalide');
      return;
    }

    // Préparer les données à envoyer
    const userData = {
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
      registrationDate: new Date().toISOString()
    };

    // Ajouter les champs spécifiques selon le type d'utilisateur
    if (formData.userType === 'student') {
      userData.school = formData.school;
      userData.fieldOfStudy = formData.fieldOfStudy;
      userData.skills = formData.skills;
      userData.interests = formData.interests;
      userData.careerGoals = formData.careerGoals;
    } else if (formData.userType === 'university') {
      userData.universityName = formData.universityName;
      userData.location = formData.location;
      userData.programs = formData.programs;
    } else if (formData.userType === 'company') {
      userData.companyName = formData.companyName;
      userData.industry = formData.industry;
      userData.jobSectors = formData.jobSectors;
    } else if (formData.userType === 'mentor') {
      userData.expertise = formData.expertise;
      userData.mentorSkills = formData.mentorSkills;
      userData.mentorExperience = formData.mentorExperience;
      userData.availabilityHours = formData.availabilityHours;
    }

    setLoading(true);

    try {
      // Sauvegarder dans localStorage
      localStorage.setItem('registeredUser', JSON.stringify(userData));
      
      // Créer un utilisateur simulé pour le stockage local
      const user = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: userData.name,
        email: userData.email,
        user_type: userData.userType,
        ...userData
      };
      
      // Générer un token simulé
      const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Stocker l'utilisateur et le token dans localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Mettre à jour le Redux store
      dispatch(setToken(token));
      dispatch(setUser(user));
      
      // Essayer d'envoyer au serveur (mais ne pas attendre la réponse pour continuer)
      try {
        authService.registerSimple(userData)
          .then(response => {
            console.log('Réponse du serveur:', response);
            // Si le serveur renvoie un token, mettre à jour celui déjà stocké
            if (response && response.access_token) {
              localStorage.setItem('token', response.access_token);
              dispatch(setToken(response.access_token));
            }
          })
          .catch(err => {
            console.error('Erreur du serveur lors de l\'inscription:', err);
            // Continuer avec le token simulé déjà stocké
          });
      } catch (serverErr) {
        console.error('Erreur lors de la communication avec le serveur:', serverErr);
        // Continuer avec le token simulé déjà stocké
      }
      
      // Mettre à jour l'état
      setRegisteredUser(userData);
      setSuccess(true);
      
      // Rediriger vers le tableau de bord approprié
      redirectToDashboard(userData.userType);
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
      
      // Même en cas d'erreur, créer un utilisateur simulé
      const user = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: userData.name,
        email: userData.email,
        user_type: userData.userType,
        ...userData
      };
      
      // Générer un token simulé
      const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Stocker l'utilisateur et le token dans localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Mettre à jour le Redux store
      dispatch(setToken(token));
      dispatch(setUser(user));
      
      // Continuer avec l'affichage du succès même si le serveur échoue
      setRegisteredUser(userData);
      setSuccess(true);
      
      // Même en cas d'erreur du serveur, simuler une connexion réussie pour la démo
      redirectToDashboard(userData.userType);
    } finally {
      setLoading(false);
    }
  };

  // Afficher les champs supplémentaires en fonction du type d'utilisateur
  const renderAdditionalFields = () => {
    switch (formData.userType) {
      case 'student':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="school"
                options={STUDY_FIELDS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="École/Université" />
                )}
                value={formData.school}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    school: value
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="fieldOfStudy"
                options={STUDY_FIELDS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Domaine d'études" />
                )}
                value={formData.fieldOfStudy}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    fieldOfStudy: value
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="skills"
                options={TECHNICAL_SKILLS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Compétences techniques" 
                    error={!!errors.skills}
                    helperText={errors.skills}
                  />
                )}
                multiple
                value={formData.skills}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    skills: value
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="interests"
                options={STUDY_FIELDS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Centres d'intérêt" 
                    error={!!errors.interests}
                    helperText={errors.interests}
                  />
                )}
                multiple
                value={formData.interests}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    interests: value
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objectifs de carrière"
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        );
      case 'university':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'université"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Localisation"
                name="location"
                value={formData.location}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="programs"
                options={STUDY_FIELDS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Programmes proposés" 
                    error={!!errors.programs}
                    helperText={errors.programs}
                  />
                )}
                multiple
                value={formData.programs}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    programs: value
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
              />
            </Grid>
          </Grid>
        );
      case 'company':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'entreprise"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="industry"
                options={INDUSTRY_SECTORS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Secteur d'activité" />
                )}
                value={formData.industry}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    industry: value
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="jobSectors"
                options={INDUSTRY_SECTORS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Secteurs d'emploi" 
                    error={!!errors.jobSectors}
                    helperText={errors.jobSectors}
                  />
                )}
                multiple
                value={formData.jobSectors}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    jobSectors: value
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
              />
            </Grid>
          </Grid>
        );
      case 'mentor':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="expertise"
                options={EXPERTISE_FIELDS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Domaine d'expertise" />
                )}
                value={formData.expertise}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    expertise: value
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="mentorSkills"
                options={TECHNICAL_SKILLS}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Compétences techniques" 
                    error={!!errors.mentorSkills}
                    helperText={errors.mentorSkills}
                  />
                )}
                multiple
                value={formData.mentorSkills}
                onChange={(event, value) => {
                  setFormData(prevData => ({
                    ...prevData,
                    mentorSkills: value
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expérience"
                name="mentorExperience"
                value={formData.mentorExperience}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Heures de disponibilité"
                name="availabilityHours"
                value={formData.availabilityHours}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  // Afficher les détails de l'utilisateur enregistré
  const renderUserDetails = () => {
    if (!registeredUser) return null;

    return (
      <Box mt={3}>
        <Typography variant="h6">Détails de l'inscription</Typography>
        <Typography variant="body1"><strong>Nom:</strong> {registeredUser.name}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {registeredUser.email}</Typography>
        <Typography variant="body1"><strong>Type d'utilisateur:</strong> {registeredUser.userType}</Typography>
        
        {registeredUser.userType === 'student' && (
          <>
            <Typography variant="body1"><strong>École/Université:</strong> {registeredUser.school?.name || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Domaine d'études:</strong> {registeredUser.fieldOfStudy?.name || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Compétences techniques:</strong> {registeredUser.skills?.map(skill => skill.name).join(', ') || 'Aucune'}</Typography>
            <Typography variant="body1"><strong>Centres d'intérêt:</strong> {registeredUser.interests?.map(interest => interest.name).join(', ') || 'Aucun'}</Typography>
            <Typography variant="body1"><strong>Objectifs de carrière:</strong> {registeredUser.careerGoals || 'Non spécifié'}</Typography>
          </>
        )}
        
        {registeredUser.userType === 'university' && (
          <>
            <Typography variant="body1"><strong>Nom de l'université:</strong> {registeredUser.universityName}</Typography>
            <Typography variant="body1"><strong>Localisation:</strong> {registeredUser.location}</Typography>
            <Typography variant="body1"><strong>Programmes proposés:</strong> {registeredUser.programs?.map(program => program.name).join(', ') || 'Aucun'}</Typography>
          </>
        )}
        
        {registeredUser.userType === 'company' && (
          <>
            <Typography variant="body1"><strong>Nom de l'entreprise:</strong> {registeredUser.companyName}</Typography>
            <Typography variant="body1"><strong>Secteur d'activité:</strong> {registeredUser.industry?.name || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Secteurs d'emploi:</strong> {registeredUser.jobSectors?.map(sector => sector.name).join(', ') || 'Aucun'}</Typography>
          </>
        )}
        
        {registeredUser.userType === 'mentor' && (
          <>
            <Typography variant="body1"><strong>Domaine d'expertise:</strong> {registeredUser.expertise?.name || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Compétences techniques:</strong> {registeredUser.mentorSkills?.map(skill => skill.name).join(', ') || 'Aucune'}</Typography>
            <Typography variant="body1"><strong>Expérience:</strong> {registeredUser.mentorExperience || 'Non spécifié'}</Typography>
            <Typography variant="body1"><strong>Heures de disponibilité:</strong> {registeredUser.availabilityHours || 'Non spécifié'}</Typography>
          </>
        )}
      </Box>
    );
  };

  // Si un utilisateur est déjà enregistré, afficher ses informations
  if (registeredUser && !loading) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Inscription
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            Inscription réussie! Redirection vers votre tableau de bord...
          </Alert>
          
          {renderUserDetails()}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inscription
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Inscription réussie! Redirection vers votre tableau de bord...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Type d'utilisateur</InputLabel>
                  <Select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    label="Type d'utilisateur"
                  >
                    <MenuItem value="student">Étudiant</MenuItem>
                    <MenuItem value="university">Université</MenuItem>
                    <MenuItem value="company">Entreprise</MenuItem>
                    <MenuItem value="mentor">Mentor</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
          
          {step === 2 && renderAdditionalFields()}
          
          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            {step === 1 && (
              <Button 
                type="button" 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={handleNext}
              >
                Suivant
              </Button>
            )}
            
            {step === 2 && (
              <Box display="flex" gap={2}>
                <Button 
                  type="button" 
                  variant="outlined" 
                  color="secondary" 
                  sx={{ flex: 1 }}
                  onClick={handleBack}
                >
                  Précédent
                </Button>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  sx={{ flex: 1 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "S'inscrire"}
                </Button>
              </Box>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SimpleRegister;
