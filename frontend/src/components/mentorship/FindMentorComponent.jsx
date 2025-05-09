import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Rating,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Mock data pour les mentors
const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Amadou Diop',
    avatar: '',
    position: 'Développeur Full Stack Senior',
    company: 'TechCorp',
    bio: 'Développeur passionné avec 5 ans d\'expérience dans le développement web. Spécialisé en React, Node.js et bases de données NoSQL.',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    location: 'Dakar, Sénégal',
    rating: 4.8,
    reviewCount: 15,
    availability: 'Soirs et week-ends'
  },
  {
    id: 2,
    name: 'Fatoumata Ba',
    avatar: '',
    position: 'Data Scientist',
    company: 'DataInsight',
    bio: 'Data scientist avec une expertise en machine learning et analyse de données. Passionnée par l\'IA et les technologies émergentes.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    location: 'Abidjan, Côte d\'Ivoire',
    rating: 4.5,
    reviewCount: 8,
    availability: 'Mardi et Jeudi soirs'
  },
  {
    id: 3,
    name: 'Kofi Mensah',
    avatar: '',
    position: 'Ingénieur DevOps',
    company: 'CloudTech',
    bio: 'Spécialiste en infrastructure cloud et automatisation. Expérience en AWS, Docker et Kubernetes.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    location: 'Accra, Ghana',
    rating: 4.9,
    reviewCount: 12,
    availability: 'Flexible'
  },
  {
    id: 4,
    name: 'Amina Toure',
    avatar: '',
    position: 'UX/UI Designer',
    company: 'DesignStudio',
    bio: 'Designer avec une passion pour créer des expériences utilisateur intuitives et esthétiques. Spécialisée en design d\'interfaces mobiles.',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
    location: 'Casablanca, Maroc',
    rating: 4.7,
    reviewCount: 10,
    availability: 'Week-ends'
  },
  {
    id: 5,
    name: 'Ousmane Sow',
    avatar: '',
    position: 'Product Manager',
    company: 'ProductLabs',
    bio: 'Product manager expérimenté avec une approche centrée sur l\'utilisateur. Expertise en développement agile et stratégie produit.',
    skills: ['Product Strategy', 'Agile', 'User Stories', 'Market Research'],
    location: 'Dakar, Sénégal',
    rating: 4.6,
    reviewCount: 9,
    availability: 'Lundi et Mercredi soirs'
  }
];

// Composant pour afficher un mentor
const MentorCard = ({ mentor, onRequestMentor }) => {
  return (
    <Card elevation={2} sx={{ mb: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={mentor.avatar} 
            alt={mentor.name}
            sx={{ width: 60, height: 60, mr: 2 }}
          >
            {!mentor.avatar && mentor.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {mentor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mentor.position}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Rating 
                value={mentor.rating} 
                precision={0.1} 
                readOnly 
                size="small"
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                ({mentor.reviewCount} avis)
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Typography variant="body2" paragraph>
          {mentor.bio}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {mentor.company}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {mentor.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              Disponibilité: {mentor.availability}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {mentor.skills.map((skill, index) => (
            <Chip key={index} label={skill} size="small" />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<SendIcon />}
          onClick={() => onRequestMentor(mentor.id)}
          fullWidth
        >
          Demander comme mentor
        </Button>
      </CardActions>
    </Card>
  );
};

// Composant principal pour trouver un mentor
const FindMentorComponent = () => {
  const { user } = useSelector(state => state.auth);
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  
  // État pour la boîte de dialogue de demande de mentorat
  const [requestDialog, setRequestDialog] = useState({
    open: false,
    mentorId: null,
    message: '',
    loading: false,
    error: null,
    success: false
  });
  
  // Charger les mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utiliser les données simulées
        setMentors(MOCK_MENTORS);
        setFilteredMentors(MOCK_MENTORS);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des mentors:', err);
        setError('Impossible de charger les mentors. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentors();
  }, []);
  
  // Filtrer les mentors en fonction de la recherche
  useEffect(() => {
    if (!searchTerm && !skillFilter) {
      setFilteredMentors(mentors);
      return;
    }
    
    const filtered = mentors.filter(mentor => {
      const matchesSearch = searchTerm 
        ? mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          mentor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesSkill = skillFilter
        ? mentor.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
        : true;
      
      return matchesSearch && matchesSkill;
    });
    
    setFilteredMentors(filtered);
  }, [searchTerm, skillFilter, mentors]);
  
  // Gérer la demande de mentorat
  const handleRequestMentor = (mentorId) => {
    setRequestDialog({
      open: true,
      mentorId,
      message: '',
      loading: false,
      error: null,
      success: false
    });
  };
  
  // Fermer la boîte de dialogue
  const handleCloseDialog = () => {
    setRequestDialog({
      ...requestDialog,
      open: false
    });
  };
  
  // Soumettre la demande de mentorat
  const handleSubmitRequest = async () => {
    if (!requestDialog.message.trim()) {
      setRequestDialog({
        ...requestDialog,
        error: 'Veuillez saisir un message pour votre demande.'
      });
      return;
    }
    
    try {
      setRequestDialog({
        ...requestDialog,
        loading: true,
        error: null
      });
      
      // Simuler un délai de soumission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler une réponse réussie
      setRequestDialog({
        ...requestDialog,
        loading: false,
        success: true
      });
      
      // Fermer la boîte de dialogue après un délai
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la soumission de la demande:', err);
      setRequestDialog({
        ...requestDialog,
        loading: false,
        error: 'Impossible de soumettre votre demande. Veuillez réessayer plus tard.'
      });
    }
  };
  
  // Effacer les filtres
  const handleClearFilters = () => {
    setSearchTerm('');
    setSkillFilter('');
  };
  
  // Extraire toutes les compétences uniques pour le filtre
  const allSkills = Array.from(new Set(mentors.flatMap(mentor => mentor.skills)));
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trouver un mentor
      </Typography>
      
      <Typography variant="body1" paragraph>
        Connectez-vous avec des professionnels expérimentés qui peuvent vous guider dans votre parcours académique et professionnel.
      </Typography>
      
      {/* Filtres de recherche */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          label="Rechercher un mentor"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => setSearchTerm('')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="skill-filter-label">Compétence</InputLabel>
          <Select
            labelId="skill-filter-label"
            id="skill-filter"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            label="Compétence"
          >
            <MenuItem value="">
              <em>Toutes</em>
            </MenuItem>
            {allSkills.map((skill, index) => (
              <MenuItem key={index} value={skill}>{skill}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          variant="outlined" 
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={!searchTerm && !skillFilter}
        >
          Effacer les filtres
        </Button>
      </Box>
      
      {/* Résultats de recherche */}
      {filteredMentors.length === 0 ? (
        <Alert severity="info">
          Aucun mentor ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
        </Alert>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            {filteredMentors.length} mentor{filteredMentors.length > 1 ? 's' : ''} trouvé{filteredMentors.length > 1 ? 's' : ''}
          </Typography>
          
          <Grid container spacing={3}>
            {filteredMentors.map(mentor => (
              <Grid item xs={12} md={6} lg={4} key={mentor.id}>
                <MentorCard 
                  mentor={mentor} 
                  onRequestMentor={handleRequestMentor}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* Boîte de dialogue pour demander un mentor */}
      <Dialog
        open={requestDialog.open}
        onClose={requestDialog.loading ? undefined : handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Demande de mentorat
        </DialogTitle>
        <DialogContent>
          {requestDialog.success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Votre demande a été envoyée avec succès ! Le mentor vous contactera prochainement.
            </Alert>
          ) : (
            <>
              <DialogContentText paragraph>
                Expliquez brièvement pourquoi vous souhaitez ce mentor et quels sont vos objectifs d'apprentissage.
              </DialogContentText>
              
              <TextField
                autoFocus
                margin="dense"
                id="message"
                label="Message au mentor"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={requestDialog.message}
                onChange={(e) => setRequestDialog({ ...requestDialog, message: e.target.value })}
                disabled={requestDialog.loading}
                error={!!requestDialog.error}
                helperText={requestDialog.error}
              />
            </>
          )}
        </DialogContent>
        {!requestDialog.success && (
          <DialogActions>
            <Button 
              onClick={handleCloseDialog} 
              disabled={requestDialog.loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitRequest} 
              variant="contained" 
              color="primary"
              disabled={requestDialog.loading}
              startIcon={requestDialog.loading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {requestDialog.loading ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default FindMentorComponent;
