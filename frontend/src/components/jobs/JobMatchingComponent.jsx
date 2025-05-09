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
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  Paper,
  Divider,
  TextField,
  Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import { STUDY_FIELDS, TECHNICAL_SKILLS } from '../../constants/formOptions';
import { useSelector } from 'react-redux';
import { 
  getSenegalJobs, 
  getSenegalIndustries, 
  searchSenegalJobs 
} from '../../api/senegal';

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
  position: 'relative',
  overflow: 'visible'
}));

// Style pour le score de correspondance
const MatchScore = styled(Box)(({ theme, score }) => ({
  position: 'absolute',
  top: -15,
  right: 20,
  backgroundColor: 
    score >= 80 ? theme.palette.success.main : 
    score >= 60 ? theme.palette.primary.main : 
    theme.palette.grey[500],
  color: '#fff',
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  boxShadow: theme.shadows[3],
  zIndex: 1
}));

// Style pour les puces de compétences
const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontWeight: 500,
  },
}));

/**
 * Composant de mise en relation avec les offres d'emploi
 * Permet aux utilisateurs de trouver des offres d'emploi correspondant à leur profil
 */
const JobMatchingComponent = () => {
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minMatchScore: 50,
    field_of_study: '',
    job_type: '',
    location: '',
    company_id: ''
  });
  
  // Types d'emploi disponibles
  const jobTypes = [
    { id: 'full_time', name: 'Temps plein' },
    { id: 'part_time', name: 'Temps partiel' },
    { id: 'internship', name: 'Stage' },
    { id: 'apprenticeship', name: 'Alternance' },
    { id: 'freelance', name: 'Freelance' }
  ];

  // Charger les offres d'emploi et les données de référence au chargement du composant
  useEffect(() => {
    fetchJobs();
    fetchIndustries();
  }, []);
  
  // Effet pour filtrer les emplois lorsque les filtres changent
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      fetchJobs();
    }
  }, [filters]);
  
  // Fonction pour récupérer les offres d'emploi
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filtres à appliquer à l'API
      const apiFilters = {};
      
      // Ajouter uniquement les filtres non vides
      if (filters.field_of_study) apiFilters.field_of_study = filters.field_of_study;
      if (filters.job_type) apiFilters.job_type = filters.job_type;
      if (filters.location) apiFilters.location = filters.location;
      if (filters.company_id) apiFilters.company_id = filters.company_id;
      
      const response = await getSenegalJobs(apiFilters);
      
      if (response.status === 'success') {
        // Calculer les scores de correspondance pour chaque offre
        const jobsWithScores = response.data.map(job => ({
          ...job,
          matchScore: calculateMatchScore(job)
        }));
        
        // Filtrer par score minimum
        const filteredJobs = jobsWithScores.filter(job => 
          job.matchScore >= filters.minMatchScore
        );
        
        setJobs(filteredJobs);
        
        // Extraire les emplacements uniques pour les filtres
        const uniqueLocations = [...new Set(response.data.map(job => job.location))];
        setLocations(uniqueLocations);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des offres d\'emploi:', err);
      setError('Impossible de charger les offres d\'emploi. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour récupérer les industries
  const fetchIndustries = async () => {
    try {
      const response = await getSenegalIndustries();
      if (response.status === 'success') {
        setIndustries(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des industries:', err);
    }
  };
  
  // Fonction pour rechercher des offres par mot-clé
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchJobs();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchSenegalJobs(searchQuery);
      
      if (response.status === 'success') {
        // Calculer les scores de correspondance pour chaque offre
        const jobsWithScores = response.data.map(job => ({
          ...job,
          matchScore: calculateMatchScore(job)
        }));
        
        // Filtrer par score minimum
        const filteredJobs = jobsWithScores.filter(job => 
          job.matchScore >= filters.minMatchScore
        );
        
        setJobs(filteredJobs);
      }
    } catch (err) {
      console.error('Erreur lors de la recherche d\'offres d\'emploi:', err);
      setError('Impossible de rechercher des offres d\'emploi. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculer le score de correspondance entre l'utilisateur et l'offre d'emploi
  const calculateMatchScore = (job) => {
    if (!user) return 50; // Score par défaut si pas d'utilisateur connecté
    
    let score = 50; // Score de base
    
    // Correspondance du domaine d'études
    if (user.field_of_study && job.field_of_study === user.field_of_study) {
      score += 20;
    }
    
    // Correspondance des compétences
    if (user.skills && job.required_skills) {
      const userSkills = Array.isArray(user.skills) ? user.skills : [];
      const matchingSkills = userSkills.filter(skill => 
        job.required_skills.includes(skill)
      );
      
      if (matchingSkills.length > 0) {
        // Jusqu'à 30 points supplémentaires en fonction du nombre de compétences correspondantes
        const skillScore = Math.min(30, (matchingSkills.length / job.required_skills.length) * 30);
        score += skillScore;
      }
    }
    
    // Bonus pour la correspondance de localisation
    if (user.location && job.location && user.location.includes(job.location)) {
      score += 10;
    }
    
    // Limiter le score à 100
    return Math.min(100, Math.round(score));
  };
  
  // Gérer les changements de filtres
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer la recherche
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      minMatchScore: 50,
      field_of_study: '',
      job_type: '',
      location: '',
      company_id: ''
    });
    setSearchQuery('');
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Offres d'emploi au Sénégal
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Trouvez des opportunités d'emploi qui correspondent à votre profil et à vos compétences.
        Notre système de mise en relation intelligent vous suggère les offres les plus pertinentes.
      </Typography>
      
      {/* Barre de recherche */}
      <Paper component="form" onSubmit={handleSearchSubmit} sx={{ p: 1, mb: 3, display: 'flex' }}>
        <TextField
          fullWidth
          placeholder="Rechercher des offres d'emploi par mot-clé..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mr: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Rechercher
        </Button>
      </Paper>
      
      {/* Bouton pour afficher/masquer les filtres */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          color="primary"
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>
        
        {showFilters && (
          <Button 
            onClick={resetFilters}
            color="secondary"
          >
            Réinitialiser les filtres
          </Button>
        )}
      </Box>
      
      {/* Filtres */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>Score de correspondance minimum</Typography>
              <Slider
                value={filters.minMatchScore}
                onChange={(e, newValue) => handleFilterChange('minMatchScore', newValue)}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Domaine d'études</InputLabel>
                <Select
                  value={filters.field_of_study}
                  onChange={(e) => handleFilterChange('field_of_study', e.target.value)}
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
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type d'emploi</InputLabel>
                <Select
                  value={filters.job_type}
                  onChange={(e) => handleFilterChange('job_type', e.target.value)}
                  label="Type d'emploi"
                >
                  <MenuItem value="">Tous les types</MenuItem>
                  {jobTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Localisation</InputLabel>
                <Select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  label="Localisation"
                >
                  <MenuItem value="">Toutes les localisations</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Indicateur de chargement */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Résultats */}
      {!loading && jobs.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aucune offre d'emploi ne correspond à vos critères. Essayez d'élargir votre recherche.
        </Alert>
      )}
      
      {!loading && jobs.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            {jobs.length} offre(s) d'emploi trouvée(s)
          </Typography>
          
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard>
                  {/* Score de correspondance */}
                  <MatchScore score={job.matchScore}>
                    {job.matchScore}%
                  </MatchScore>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.company_name || "Entreprise"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {jobTypes.find(t => t.id === job.job_type)?.name || job.job_type}
                      </Typography>
                    </Box>
                    
                    {job.field_of_study && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {STUDY_FIELDS.find(f => f.id === job.field_of_study)?.name || job.field_of_study}
                        </Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {job.description.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description}
                    </Typography>
                    
                    {job.required_skills && job.required_skills.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Compétences requises:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          {job.required_skills.slice(0, 5).map((skill, index) => (
                            <SkillChip 
                              key={index}
                              label={skill}
                              size="small"
                              color={user?.skills?.includes(skill) ? "primary" : "default"}
                            />
                          ))}
                          {job.required_skills.length > 5 && (
                            <SkillChip 
                              label={`+${job.required_skills.length - 5}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        {job.salary}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Publié le: {new Date(job.posted_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      href={`/jobs/${job.id}`}
                    >
                      Voir l'offre
                    </Button>
                  </Box>
                </JobCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default JobMatchingComponent;
