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
  CardMedia, 
  Divider, 
  Chip, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Pagination, 
  CircularProgress, 
  Alert, 
  IconButton,
  Avatar,
  Rating,
  Drawer,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  LocationOn as LocationIcon, 
  School as SchoolIcon, 
  Work as WorkIcon, 
  Star as StarIcon, 
  Language as LanguageIcon, 
  ExpandMore as ExpandMoreIcon, 
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mentorshipService from '../services/mentorshipService';

// Composant pour la page de recherche de mentors
const MentorSearch = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    domains: [],
    experience_level: '',
    availability: '',
    languages: [],
    rating: 0
  });
  
  // Options pour les filtres
  const domainOptions = [
    'Développement Web', 
    'Marketing Digital', 
    'Finance', 
    'Entrepreneuriat', 
    'Design', 
    'Data Science', 
    'Intelligence Artificielle',
    'Gestion de Projet',
    'Ressources Humaines',
    'Droit des Affaires'
  ];
  
  const experienceLevelOptions = [
    { value: 'junior', label: '1-3 ans' },
    { value: 'mid_level', label: '4-7 ans' },
    { value: 'senior', label: '8+ ans' }
  ];
  
  const availabilityOptions = [
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'biweekly', label: 'Bimensuelle' },
    { value: 'monthly', label: 'Mensuelle' },
    { value: 'on_demand', label: 'Sur demande' }
  ];
  
  const languageOptions = [
    'Français',
    'Anglais',
    'Wolof',
    'Arabe',
    'Espagnol'
  ];
  
  // Fonction pour charger les mentors
  const searchMentors = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Préparer les paramètres de recherche
      const searchParams = {
        page: pageNum,
        search: searchQuery,
        location: location,
        ...filters
      };
      
      // En production, utiliser cette ligne pour récupérer les données réelles
      // const data = await mentorshipService.getMentors(searchParams);
      
      // Pour le développement, utiliser des données simulées
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées pour les mentors
      const mockMentors = Array(10).fill().map((_, index) => ({
        id: `mentor-${index + 1 + (pageNum - 1) * 10}`,
        name: `${['Amadou', 'Fatou', 'Omar', 'Aïssatou', 'Moussa', 'Mariama', 'Ibrahima', 'Aminata', 'Cheikh', 'Dieynaba'][index % 10]} ${['Diop', 'Ndiaye', 'Sow', 'Fall', 'Gueye', 'Mbaye', 'Thiam', 'Diallo', 'Sarr', 'Ba'][Math.floor(Math.random() * 10)]}`,
        avatar: '',
        title: `${['Développeur Senior', 'Chef de Projet Digital', 'Consultant Marketing', 'Entrepreneur', 'Designer UX/UI', 'Data Scientist', 'Ingénieur IA', 'Responsable RH', 'Juriste d\'Affaires', 'Analyste Financier'][index % 10]}`,
        company: `${['TechSenegal', 'Digital Africa', 'Startup Nation', 'Dakar Designs', 'DataWest', 'AI Solutions', 'Talent Hub', 'Legal Experts', 'FinTech Senegal', 'Project Masters'][index % 10]}`,
        location: `${['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack'][Math.floor(Math.random() * 5)]}, Sénégal`,
        domains: [domainOptions[index % 10], domainOptions[(index + 3) % 10]],
        experience_level: experienceLevelOptions[Math.floor(Math.random() * 3)].value,
        availability: availabilityOptions[Math.floor(Math.random() * 4)].value,
        languages: [languageOptions[0], languageOptions[Math.floor(Math.random() * 5)]],
        rating: 3 + Math.floor(Math.random() * 2) + Math.random(),
        reviews_count: 5 + Math.floor(Math.random() * 20),
        bio: `Professionnel expérimenté dans le domaine ${domainOptions[index % 10]}. Passionné par le partage de connaissances et l'accompagnement des jeunes talents.`,
        mentees_count: Math.floor(Math.random() * 10),
        sessions_completed: 5 + Math.floor(Math.random() * 30),
        is_verified: Math.random() > 0.3
      }));
      
      const mockData = {
        mentors: mockMentors,
        total_pages: 5
      };
      
      setMentors(mockData.mentors);
      setTotalPages(mockData.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Erreur lors de la recherche de mentors:', err);
      setError('Impossible de charger les mentors. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les mentors au chargement de la page et lorsque les filtres changent
  useEffect(() => {
    searchMentors(1);
  }, []);
  
  // Gestionnaire pour le changement de page
  const handlePageChange = (event, value) => {
    searchMentors(value);
    window.scrollTo(0, 0);
  };
  
  // Gestionnaire pour la soumission du formulaire de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    searchMentors(1);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };
  
  // Gestionnaire pour la réinitialisation des filtres
  const handleResetFilters = () => {
    setFilters({
      domains: [],
      experience_level: '',
      availability: '',
      languages: [],
      rating: 0
    });
    
    // Effectuer une nouvelle recherche avec les filtres réinitialisés
    setTimeout(() => searchMentors(1), 0);
  };
  
  // Gestionnaire pour le changement des filtres
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestionnaire pour le changement des filtres à sélection multiple
  const handleMultiFilterChange = (name, value) => {
    const currentValues = filters[name];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFilters(prev => ({
      ...prev,
      [name]: newValues
    }));
  };
  
  // Gestionnaire pour l'envoi d'une demande de mentorat
  const handleRequestMentorship = (mentorId) => {
    if (!user) {
      navigate('/login', { state: { from: '/mentors' } });
      return;
    }
    
    if (user.type !== 'student') {
      alert('Seuls les étudiants peuvent envoyer des demandes de mentorat');
      return;
    }
    
    navigate(`/mentors/${mentorId}/request`);
  };
  
  // Composant pour les filtres (desktop et mobile)
  const FiltersComponent = () => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filtres</Typography>
        <Button 
          size="small" 
          onClick={handleResetFilters}
        >
          Réinitialiser
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Filtre par domaine d'expertise */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Domaines d'expertise</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {domainOptions.map((domain) => (
              <Box key={domain} sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={domain}
                  clickable
                  color={filters.domains.includes(domain) ? 'primary' : 'default'}
                  onClick={() => handleMultiFilterChange('domains', domain)}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Filtre par niveau d'expérience */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Niveau d'expérience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Expérience</InputLabel>
            <Select
              value={filters.experience_level}
              onChange={(e) => handleFilterChange('experience_level', e.target.value)}
              label="Expérience"
            >
              <MenuItem value="">Tous</MenuItem>
              {experienceLevelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      {/* Filtre par disponibilité */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Disponibilité</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Disponibilité</InputLabel>
            <Select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              label="Disponibilité"
            >
              <MenuItem value="">Toutes</MenuItem>
              {availabilityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      {/* Filtre par langue */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Langues</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {languageOptions.map((language) => (
              <Chip
                key={language}
                label={language}
                clickable
                color={filters.languages.includes(language) ? 'primary' : 'default'}
                onClick={() => handleMultiFilterChange('languages', language)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Filtre par évaluation */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Évaluation minimale</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={filters.rating}
              onChange={(event, newValue) => {
                handleFilterChange('rating', newValue);
              }}
              precision={1}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {filters.rating > 0 ? `${filters.rating} étoiles et plus` : 'Toutes les évaluations'}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {isMobile && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => setDrawerOpen(false)}
            startIcon={<CloseIcon />}
          >
            Fermer
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Appliquer
          </Button>
        </Box>
      )}
    </Paper>
  );
  
  // Composant pour afficher un mentor
  const MentorCard = ({ mentor }) => (
    <Card elevation={2} sx={{ mb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={mentor.avatar}
            alt={mentor.name}
            sx={{ width: 60, height: 60, mr: 2 }}
          >
            {mentor.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="h6" component="h2">
                {mentor.name}
              </Typography>
              {mentor.is_verified && (
                <Tooltip title="Mentor vérifié">
                  <CheckCircleIcon color="primary" fontSize="small" />
                </Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {mentor.title} chez {mentor.company}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{mentor.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={mentor.rating} precision={0.5} size="small" readOnly />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                ({mentor.reviews_count} avis)
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Typography variant="body2" paragraph>
          {mentor.bio}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {mentor.domains.map((domain, index) => (
            <Chip key={index} label={domain} size="small" />
          ))}
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {mentor.experience_level === 'junior' ? '1-3 ans' : 
                 mentor.experience_level === 'mid_level' ? '4-7 ans' : 
                 mentor.experience_level === 'senior' ? '8+ ans' : 
                 mentor.experience_level}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {mentor.availability === 'weekly' ? 'Hebdomadaire' : 
                 mentor.availability === 'biweekly' ? 'Bimensuelle' : 
                 mentor.availability === 'monthly' ? 'Mensuelle' : 
                 mentor.availability === 'on_demand' ? 'Sur demande' : 
                 mentor.availability}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {mentor.languages.join(', ')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {mentor.mentees_count} mentorés
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          fullWidth
          component={Link}
          to={`/mentors/${mentor.id}`}
        >
          Voir le profil
        </Button>
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<MessageIcon />}
          onClick={() => handleRequestMentorship(mentor.id)}
        >
          Demander
        </Button>
      </CardActions>
    </Card>
  );
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Rechercher un mentor
      </Typography>
      
      <Typography variant="body1" paragraph>
        Trouvez le mentor idéal pour vous accompagner dans votre parcours professionnel.
      </Typography>
      
      {/* Barre de recherche */}
      <Paper component="form" onSubmit={handleSearch} elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, domaine d'expertise, compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="medium"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Localisation (ville, pays)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
              size="medium"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                startIcon={<SearchIcon />}
              >
                Rechercher
              </Button>
              {isMobile && (
                <Button 
                  variant="outlined" 
                  onClick={() => setDrawerOpen(true)}
                  startIcon={<FilterListIcon />}
                >
                  Filtres
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Filtres (desktop) */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <FiltersComponent />
          </Grid>
        )}
        
        {/* Liste des mentors */}
        <Grid item xs={12} md={!isMobile ? 9 : 12}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : mentors.length > 0 ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {mentors.length} mentor{mentors.length > 1 ? 's' : ''} trouvé{mentors.length > 1 ? 's' : ''}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {mentors.map((mentor) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={mentor.id}>
                    <MentorCard mentor={mentor} />
                  </Grid>
                ))}
              </Grid>
              
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
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Aucun mentor trouvé
              </Typography>
              <Typography variant="body1">
                Essayez de modifier vos critères de recherche.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Drawer pour les filtres (mobile) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: '350px',
            p: 2
          }
        }}
      >
        <FiltersComponent />
      </Drawer>
    </Container>
  );
};

export default MentorSearch;
