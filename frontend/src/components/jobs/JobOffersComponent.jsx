import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Chip, 
  CircularProgress, 
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Divider,
  CardActions,
  CardMedia,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { STUDY_FIELDS, INDUSTRY_SECTORS } from '../../constants/formOptions';

// Style pour les cartes d'offres d'emploi
const JobCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const JobChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

/**
 * Composant pour afficher les offres d'emploi basées sur le domaine d'études de l'utilisateur
 */
const JobOffersComponent = () => {
  // État pour les offres d'emploi
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // État pour les filtres
  const [filters, setFilters] = useState({
    searchQuery: '',
    fieldOfStudy: '',
    location: '',
    jobType: ''
  });
  
  // État pour le contrôle de l'UI
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  // Charger l'utilisateur actuel depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Simuler le chargement des offres d'emploi
  useEffect(() => {
    if (currentUser) {
      fetchJobOffers();
    }
  }, [currentUser]);

  // Fonction pour récupérer les offres d'emploi
  const fetchJobOffers = () => {
    setLoading(true);
    setError('');
    
    // Utiliser directement les données simulées sans appel API
    try {
      // Dans une implémentation réelle, ceci serait un appel API
      // qui enverrait les données de profil de l'utilisateur et recevrait des offres d'emploi pertinentes
      const mockJobs = generateMockJobs();
      
      // Filtrer les offres d'emploi en fonction des critères
      const filteredJobs = mockJobs.filter(job => {
        // Filtre par recherche textuelle
        if (filters.searchQuery && 
            !job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
            !job.company.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !job.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
          return false;
        }
        
        // Filtre par domaine d'études
        if (filters.fieldOfStudy && job.fieldOfStudy?.id !== filters.fieldOfStudy) {
          return false;
        }
        
        // Filtre par localisation
        if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
        
        // Filtre par type d'emploi
        if (filters.jobType && job.jobType !== filters.jobType) {
          return false;
        }
        
        return true;
      });
      
      setJobOffers(filteredJobs);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la récupération des offres d\'emploi');
      setLoading(false);
    }
  };

  // Fonction pour générer des offres d'emploi fictives
  const generateMockJobs = () => {
    // Dans une implémentation réelle, ces données viendraient de l'API
    const userFieldOfStudy = currentUser?.fieldOfStudy?.id;
    
    // Liste de base des offres d'emploi
    const allJobs = [
      {
        id: 1,
        title: 'Développeur Full Stack',
        company: 'TechCorp',
        logo: 'https://via.placeholder.com/150',
        location: 'Paris, France',
        salary: '45 000 € - 60 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-10',
        description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe dynamique et travailler sur des projets innovants.',
        requirements: [
          'Expérience en développement web front-end et back-end',
          'Maîtrise de JavaScript, React, Node.js',
          'Connaissance des bases de données SQL et NoSQL',
          'Expérience avec Git et les méthodologies agiles'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'computer_science'),
        skills: ['javascript', 'react', 'node.js', 'mongodb']
      },
      {
        id: 2,
        title: 'Data Scientist',
        company: 'DataInsight',
        logo: 'https://via.placeholder.com/150',
        location: 'Lyon, France',
        salary: '50 000 € - 65 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-12',
        description: 'Rejoignez notre équipe de data scientists pour analyser des données complexes et développer des modèles prédictifs.',
        requirements: [
          'Maîtrise des techniques d\'analyse de données et de machine learning',
          'Expérience avec Python, R et les bibliothèques de data science',
          'Connaissance des outils de visualisation de données',
          'Formation en statistiques ou mathématiques appliquées'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'data_science'),
        skills: ['python', 'machine_learning', 'data_analysis', 'statistics']
      },
      {
        id: 3,
        title: 'UX/UI Designer',
        company: 'DesignStudio',
        logo: 'https://via.placeholder.com/150',
        location: 'Bordeaux, France',
        salary: '40 000 € - 55 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-15',
        description: 'Nous cherchons un designer UX/UI talentueux pour créer des expériences utilisateur exceptionnelles pour nos clients.',
        requirements: [
          'Portfolio démontrant des compétences en design d\'interface et d\'expérience utilisateur',
          'Maîtrise des outils de design (Figma, Adobe XD, Sketch)',
          'Connaissance des principes de design responsive et d\'accessibilité',
          'Capacité à collaborer avec des développeurs et des parties prenantes'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'ux_design'),
        skills: ['ui_design', 'user_research', 'figma', 'wireframing']
      },
      {
        id: 4,
        title: 'Ingénieur DevOps',
        company: 'CloudTech',
        logo: 'https://via.placeholder.com/150',
        location: 'Toulouse, France',
        salary: '55 000 € - 70 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-08',
        description: 'Rejoignez notre équipe d\'ingénieurs DevOps pour améliorer nos processus de déploiement et d\'infrastructure.',
        requirements: [
          'Expérience avec les technologies cloud (AWS, Azure, GCP)',
          'Maîtrise des outils de conteneurisation (Docker, Kubernetes)',
          'Connaissance des pratiques CI/CD',
          'Expérience en automatisation et scripting'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'software_engineering'),
        skills: ['devops', 'docker', 'kubernetes', 'aws']
      },
      {
        id: 5,
        title: 'Développeur Mobile',
        company: 'AppMakers',
        logo: 'https://via.placeholder.com/150',
        location: 'Nice, France',
        salary: '45 000 € - 60 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-14',
        description: 'Nous recherchons un développeur mobile pour créer des applications iOS et Android innovantes et performantes.',
        requirements: [
          'Expérience en développement d\'applications mobiles natives ou cross-platform',
          'Maîtrise de Swift, Kotlin, ou React Native',
          'Connaissance des principes de design d\'interface mobile',
          'Expérience avec les API RESTful et les bases de données'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'mobile_development'),
        skills: ['react_native', 'swift', 'kotlin', 'mobile_ui']
      },
      {
        id: 6,
        title: 'Développeur Front-End (Stage)',
        company: 'WebStudio',
        logo: 'https://via.placeholder.com/150',
        location: 'Paris, France',
        salary: '1 200 € - 1 500 €',
        jobType: 'internship',
        postedDate: '2023-05-16',
        description: 'Stage de 6 mois pour un développeur front-end passionné souhaitant acquérir de l\'expérience dans une agence web dynamique.',
        requirements: [
          'Connaissance de HTML, CSS et JavaScript',
          'Familiarité avec un framework front-end (React, Vue, Angular)',
          'Intérêt pour le design responsive et l\'accessibilité',
          'Étudiant en informatique ou développement web'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'web_development'),
        skills: ['html_css', 'javascript', 'react', 'responsive_design']
      },
      {
        id: 7,
        title: 'Analyste Cybersécurité',
        company: 'SecureNet',
        logo: 'https://via.placeholder.com/150',
        location: 'Lille, France',
        salary: '50 000 € - 65 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-09',
        description: 'Rejoignez notre équipe de sécurité pour protéger nos systèmes et données contre les menaces informatiques.',
        requirements: [
          'Expérience en analyse de sécurité et gestion des incidents',
          'Connaissance des outils de détection d\'intrusion et de surveillance',
          'Familiarité avec les normes de sécurité (ISO 27001, NIST)',
          'Certifications en sécurité informatique appréciées (CISSP, CEH)'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'cybersecurity'),
        skills: ['network_security', 'penetration_testing', 'security_analysis', 'incident_response']
      },
      {
        id: 8,
        title: 'Chef de Projet Digital',
        company: 'DigitalAgency',
        logo: 'https://via.placeholder.com/150',
        location: 'Marseille, France',
        salary: '45 000 € - 60 000 €',
        jobType: 'full-time',
        postedDate: '2023-05-11',
        description: 'Nous recherchons un chef de projet digital pour gérer nos projets web et coordonner les équipes de développement et de design.',
        requirements: [
          'Expérience en gestion de projets digitaux',
          'Connaissance des méthodologies agiles',
          'Excellentes compétences en communication et organisation',
          'Compréhension des aspects techniques du développement web'
        ],
        fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'project_management'),
        skills: ['project_management', 'agile', 'client_communication', 'team_leadership']
      }
    ];
    
    // Si l'utilisateur a un domaine d'études spécifié, prioriser les offres correspondantes
    if (userFieldOfStudy) {
      return allJobs.sort((a, b) => {
        if (a.fieldOfStudy?.id === userFieldOfStudy && b.fieldOfStudy?.id !== userFieldOfStudy) {
          return -1;
        }
        if (a.fieldOfStudy?.id !== userFieldOfStudy && b.fieldOfStudy?.id === userFieldOfStudy) {
          return 1;
        }
        return 0;
      });
    }
    
    return allJobs;
  };

  // Gérer les changements dans les filtres
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Gérer la recherche
  const handleSearch = () => {
    fetchJobOffers();
  };

  // Gérer l'enregistrement d'une offre d'emploi
  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // Gérer la candidature à une offre d'emploi
  const handleApplyJob = (jobId) => {
    // Dans une implémentation réelle, ceci enverrait une requête à l'API
    alert(`Candidature envoyée pour l'offre #${jobId}`);
  };

  // Rendu des filtres
  const renderFilters = () => {
    return (
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filtrer les offres
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Domaine d'études</InputLabel>
              <Select
                value={filters.fieldOfStudy}
                onChange={(e) => handleFilterChange('fieldOfStudy', e.target.value)}
                label="Domaine d'études"
              >
                <MenuItem value="">Tous les domaines</MenuItem>
                {STUDY_FIELDS.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Localisation"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type d'emploi</InputLabel>
              <Select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                label="Type d'emploi"
              >
                <MenuItem value="">Tous les types</MenuItem>
                <MenuItem value="full-time">Temps plein</MenuItem>
                <MenuItem value="part-time">Temps partiel</MenuItem>
                <MenuItem value="internship">Stage</MenuItem>
                <MenuItem value="freelance">Freelance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              sx={{ height: '56px' }}
              onClick={handleSearch}
            >
              Appliquer les filtres
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Rendu des cartes d'offres d'emploi
  const renderJobCards = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (jobOffers.length === 0) {
      return (
        <Alert severity="info" sx={{ my: 2 }}>
          Aucune offre d'emploi trouvée avec les critères actuels.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        {jobOffers.map((job) => (
          <Grid item xs={12} md={6} key={job.id}>
            <JobCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 60, height: 60, mr: 2, objectFit: 'contain' }}
                      image={job.logo}
                      alt={`${job.company} logo`}
                    />
                    <Box>
                      <Typography variant="h6" component="div">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <BusinessIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        {job.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        {job.location}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    aria-label="sauvegarder l'offre" 
                    onClick={() => handleSaveJob(job.id)}
                    color={savedJobs.includes(job.id) ? 'primary' : 'default'}
                  >
                    {savedJobs.includes(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Salaire:</strong> {job.salary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Type:</strong> {job.jobType === 'full-time' ? 'Temps plein' : 
                                          job.jobType === 'part-time' ? 'Temps partiel' : 
                                          job.jobType === 'internship' ? 'Stage' : 
                                          job.jobType === 'freelance' ? 'Freelance' : job.jobType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Publié le:</strong> {job.postedDate}
                  </Typography>
                  {job.fieldOfStudy && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Domaine:</strong> {typeof job.fieldOfStudy === 'object' ? job.fieldOfStudy?.name : job.fieldOfStudy || 'Non spécifié'}
                    </Typography>
                  )}
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography variant="body2" paragraph>
                  {job.description}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Compétences requises:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                  {job.skills.map((skill) => (
                    <JobChip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              
              <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={() => handleApplyJob(job.id)}
                >
                  Postuler
                </Button>
              </CardActions>
            </JobCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Si aucun utilisateur n'est connecté
  if (!currentUser) {
    return (
      <Alert severity="warning">
        Veuillez vous connecter pour accéder aux offres d'emploi.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <WorkIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Offres d'emploi
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Découvrez des offres d'emploi adaptées à votre profil et à votre domaine d'études.
        {currentUser?.fieldOfStudy && (
          ` Nous avons sélectionné des offres dans le domaine ${currentUser.fieldOfStudy?.name || 'de votre choix'}.`
        )}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par titre, entreprise ou mots-clés"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                >
                  Rechercher
                </Button>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>
      </Box>
      
      {showFilters && renderFilters()}
      
      {renderJobCards()}
    </Box>
  );
};

export default JobOffersComponent;
