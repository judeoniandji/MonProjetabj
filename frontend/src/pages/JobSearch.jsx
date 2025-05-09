import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Divider, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Autocomplete, 
  Pagination, 
  CircularProgress, 
  Alert, 
  Paper, 
  IconButton, 
  InputAdornment,
  Drawer,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocationOn as LocationIcon, 
  Work as WorkIcon, 
  Euro as EuroIcon, 
  FilterList as FilterListIcon, 
  Bookmark as BookmarkIcon, 
  BookmarkBorder as BookmarkBorderIcon, 
  AccessTime as AccessTimeIcon, 
  Business as BusinessIcon, 
  ExpandMore as ExpandMoreIcon, 
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';

// Composant pour afficher une offre d'emploi
const JobCard = ({ job, onSave, onApply, onView, saved }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 30) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <Card elevation={2} sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
              {job.company_name}
            </Typography>
          </Box>
          <IconButton 
            color={saved ? "primary" : "default"} 
            onClick={() => onSave(job.id)}
            aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{job.location}</Typography>
          </Box>
          {job.salary_range && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <EuroIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{job.salary_range}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WorkIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {job.contract_type === 'full_time' ? 'CDI' : 
               job.contract_type === 'part_time' ? 'Temps partiel' : 
               job.contract_type === 'internship' ? 'Stage' : 
               job.contract_type === 'apprenticeship' ? 'Alternance' : 
               job.contract_type === 'temporary' ? 'CDD' : 
               job.contract_type}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {job.description.length > 200 
            ? job.description.substring(0, 200) + '...' 
            : job.description}
        </Typography>
        
        {job.skills && job.skills.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {job.skills.map((skill, index) => (
              <Chip key={index} label={skill} size="small" variant="outlined" />
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Publié {formatDate(job.published_date)}
            </Typography>
          </Box>
          
          {job.company_rating && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 0.5 }}>
                {job.company_rating}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {[...Array(5)].map((_, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <StarBorderIcon fontSize="small" color="warning" />
                    {i < Math.floor(job.company_rating) && (
                      <StarIcon 
                        fontSize="small" 
                        color="warning" 
                        sx={{ position: 'absolute', top: 0, left: 0 }} 
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          color="primary" 
          onClick={() => onView(job.id)}
        >
          Voir les détails
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          color="primary" 
          onClick={() => onApply(job.id)}
        >
          Postuler
        </Button>
      </CardActions>
    </Card>
  );
};

// Page principale de recherche d'emploi
const JobSearch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // États pour les filtres
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [contractTypes, setContractTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [salaryRange, setSalaryRange] = useState([0, 100000]);
  const [distance, setDistance] = useState(50);
  const [datePosted, setDatePosted] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // États pour les résultats
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Options pour les filtres
  const contractTypeOptions = [
    { value: 'full_time', label: 'CDI' },
    { value: 'part_time', label: 'Temps partiel' },
    { value: 'internship', label: 'Stage' },
    { value: 'apprenticeship', label: 'Alternance' },
    { value: 'temporary', label: 'CDD' },
    { value: 'freelance', label: 'Freelance' }
  ];
  
  const experienceLevelOptions = [
    { value: 'entry_level', label: 'Débutant' },
    { value: 'mid_level', label: 'Intermédiaire' },
    { value: 'senior_level', label: 'Expérimenté' },
    { value: 'executive_level', label: 'Cadre supérieur' }
  ];
  
  const datePostedOptions = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'three_days', label: '3 derniers jours' },
    { value: 'week', label: '7 derniers jours' },
    { value: 'month', label: '30 derniers jours' },
    { value: 'any', label: 'Toutes les offres' }
  ];
  
  // Charger les offres d'emploi sauvegardées au chargement de la page
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        if (user && user.type === 'student') {
          const data = await jobService.getSavedJobs();
          setSavedJobs(data.map(job => job.id));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des offres sauvegardées:', err);
      }
    };
    
    fetchSavedJobs();
  }, [user]);
  
  // Fonction pour rechercher des offres d'emploi
  const searchJobs = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire les filtres pour la recherche
      const filters = {
        keyword,
        location,
        contract_types: contractTypes,
        experience_levels: experienceLevels,
        min_salary: salaryRange[0],
        max_salary: salaryRange[1],
        distance,
        date_posted: datePosted,
        remote_only: remoteOnly,
        page: pageNum,
        limit: 10
      };
      
      const data = await jobService.getJobs(filters);
      setJobs(data.jobs);
      setTotalPages(Math.ceil(data.total / 10));
      setPage(pageNum);
    } catch (err) {
      console.error('Erreur lors de la recherche d\'offres d\'emploi:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
      // Fermer le tiroir de filtres sur mobile après la recherche
      if (isMobile) {
        setFilterDrawerOpen(false);
      }
    }
  };
  
  // Gestionnaire pour la soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchJobs(1);
  };
  
  // Gestionnaire pour le changement de page
  const handlePageChange = (event, value) => {
    searchJobs(value);
  };
  
  // Gestionnaire pour sauvegarder/retirer une offre des favoris
  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await jobService.unsaveJob(jobId);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        await jobService.saveJob(jobId);
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde/suppression de l\'offre:', err);
    }
  };
  
  // Gestionnaire pour postuler à une offre
  const handleApplyJob = (jobId) => {
    navigate(`/jobs/${jobId}/apply`);
  };
  
  // Gestionnaire pour voir les détails d'une offre
  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };
  
  // Gestionnaire pour réinitialiser les filtres
  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setContractTypes([]);
    setExperienceLevels([]);
    setSalaryRange([0, 100000]);
    setDistance(50);
    setDatePosted('');
    setRemoteOnly(false);
  };
  
  // Contenu des filtres
  const filtersContent = (
    <Box sx={{ p: 2, width: isMobile ? 'auto' : 280 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filtres</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Type de contrat</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {contractTypeOptions.map(option => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox 
                    checked={contractTypes.includes(option.value)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setContractTypes([...contractTypes, option.value]);
                      } else {
                        setContractTypes(contractTypes.filter(type => type !== option.value));
                      }
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Niveau d'expérience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {experienceLevelOptions.map(option => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox 
                    checked={experienceLevels.includes(option.value)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExperienceLevels([...experienceLevels, option.value]);
                      } else {
                        setExperienceLevels(experienceLevels.filter(level => level !== option.value));
                      }
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Salaire</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={salaryRange}
              onChange={(e, newValue) => setSalaryRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              valueLabelFormat={(value) => `${value.toLocaleString()} €`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">{salaryRange[0].toLocaleString()} €</Typography>
              <Typography variant="body2">{salaryRange[1].toLocaleString()} €</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Distance</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={distance}
              onChange={(e, newValue) => setDistance(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={5}
              valueLabelFormat={(value) => `${value} km`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">0 km</Typography>
              <Typography variant="body2">100 km</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Date de publication</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <Select
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Toutes les dates</MenuItem>
              {datePostedOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={remoteOnly} 
              onChange={(e) => setRemoteOnly(e.target.checked)}
            />
          }
          label="Télétravail uniquement"
        />
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleResetFilters}
        >
          Réinitialiser
        </Button>
        <Button 
          variant="contained" 
          onClick={() => searchJobs(1)}
        >
          Appliquer
        </Button>
      </Box>
    </Box>
  );
  
  // Générer des données de test pour le développement
  useEffect(() => {
    const generateTestData = () => {
      const testJobs = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: ['Développeur Full Stack', 'Data Scientist', 'Chef de Projet IT', 'UX Designer', 'Ingénieur DevOps'][i % 5],
        company_name: ['TechCorp', 'DataSolutions', 'InnovSoft', 'DesignHub', 'CloudTech'][i % 5],
        location: ['Paris', 'Lyon', 'Bordeaux', 'Toulouse', 'Lille'][i % 5],
        salary_range: ['30 000 € - 40 000 €', '45 000 € - 55 000 €', '60 000 € - 70 000 €', '35 000 € - 45 000 €', '50 000 € - 65 000 €'][i % 5],
        contract_type: ['full_time', 'part_time', 'internship', 'apprenticeship', 'temporary'][i % 5],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
        skills: [
          ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          ['Python', 'TensorFlow', 'SQL', 'Data Analysis'],
          ['Agile', 'Scrum', 'JIRA', 'Project Management'],
          ['Figma', 'Adobe XD', 'UI/UX', 'Wireframing'],
          ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
        ][i % 5],
        published_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        company_rating: [4.2, 3.8, 4.5, 3.5, 4.0][i % 5]
      }));
      
      setJobs(testJobs);
      setTotalPages(5);
    };
    
    generateTestData();
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recherche d'emploi
      </Typography>
      
      <Paper component="form" onSubmit={handleSearchSubmit} elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Poste, compétence ou entreprise"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Ville ou code postal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Rechercher'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Filtres - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper elevation={2}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Filtres</Typography>
              </Box>
              {filtersContent}
            </Paper>
          </Grid>
        )}
        
        {/* Résultats */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {/* Bouton de filtres sur mobile */}
          {isMobile && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                {jobs.length > 0 ? `${jobs.length} offres trouvées` : 'Aucune offre trouvée'}
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filtres
              </Button>
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {jobs.length > 0 ? (
                <>
                  {jobs.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onSave={handleSaveJob}
                      onApply={handleApplyJob}
                      onView={handleViewJob}
                      saved={savedJobs.includes(job.id)}
                    />
                  ))}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary" 
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Aucune offre trouvée
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Essayez de modifier vos critères de recherche
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
      
      {/* Tiroir de filtres sur mobile */}
      <Drawer
        anchor="right"
        open={isMobile && filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        {filtersContent}
      </Drawer>
    </Container>
  );
};

export default JobSearch;
