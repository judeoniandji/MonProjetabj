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
  Divider, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Alert, 
  Avatar,
  Rating,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Link as MuiLink,
  Breadcrumbs
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  School as SchoolIcon, 
  Work as WorkIcon, 
  Star as StarIcon, 
  Language as LanguageIcon, 
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mentorshipService from '../services/mentorshipService';

// Composant pour la page de demande de mentorat
const MentorshipRequest = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [requestData, setRequestData] = useState({
    objectives: '',
    message: '',
    duration: '',
    preferred_schedule: '',
    expectations: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Vérifier si l'utilisateur est connecté et est un étudiant
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/mentors/${mentorId}/request` } });
      return;
    }
    
    if (user.type !== 'student') {
      navigate('/mentors');
      return;
    }
  }, [user, mentorId, navigate]);
  
  // Charger les détails du mentor
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setLoading(true);
        
        // En production, utiliser cette ligne pour récupérer les données réelles
        // const data = await mentorshipService.getMentorById(mentorId);
        
        // Pour le développement, utiliser des données simulées
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = {
          id: mentorId,
          name: 'Amadou Diop',
          avatar: '',
          title: 'Développeur Senior',
          company: 'TechSenegal',
          location: 'Dakar, Sénégal',
          domains: ['Développement Web', 'Intelligence Artificielle'],
          experience_level: 'senior',
          availability: 'weekly',
          languages: ['Français', 'Anglais'],
          rating: 4.8,
          reviews_count: 15,
          bio: 'Professionnel expérimenté dans le domaine du développement web et de l\'intelligence artificielle. Passionné par le partage de connaissances et l\'accompagnement des jeunes talents.',
          mentees_count: 8,
          sessions_completed: 35,
          is_verified: true,
          education: [
            { degree: 'Master en Informatique', institution: 'Université Cheikh Anta Diop', year: '2010' },
            { degree: 'Licence en Génie Logiciel', institution: 'École Supérieure Polytechnique', year: '2008' }
          ],
          experience: [
            { position: 'Développeur Senior', company: 'TechSenegal', duration: '2015 - Présent' },
            { position: 'Développeur Web', company: 'Digital Africa', duration: '2010 - 2015' }
          ],
          mentorship_approach: 'Je privilégie une approche personnalisée, adaptée aux besoins et objectifs de chaque mentoré. Je combine des sessions régulières de suivi avec des exercices pratiques et des retours constructifs.'
        };
        
        setMentor(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des détails du mentor:', err);
        setError('Impossible de charger les détails du mentor. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentorDetails();
  }, [mentorId]);
  
  // Étapes du processus de demande
  const steps = [
    'Informations sur le mentor',
    'Objectifs et attentes',
    'Confirmation'
  ];
  
  // Options pour la durée de mentorat
  const durationOptions = [
    { value: '1_month', label: '1 mois' },
    { value: '3_months', label: '3 mois' },
    { value: '6_months', label: '6 mois' },
    { value: '1_year', label: '1 an' },
    { value: 'undefined', label: 'À définir ensemble' }
  ];
  
  // Options pour les horaires préférés
  const scheduleOptions = [
    { value: 'weekday_morning', label: 'Jours de semaine - Matin' },
    { value: 'weekday_afternoon', label: 'Jours de semaine - Après-midi' },
    { value: 'weekday_evening', label: 'Jours de semaine - Soir' },
    { value: 'weekend_morning', label: 'Week-end - Matin' },
    { value: 'weekend_afternoon', label: 'Week-end - Après-midi' },
    { value: 'flexible', label: 'Flexible' }
  ];
  
  // Gestionnaire pour le changement des données de la demande
  const handleRequestDataChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestionnaire pour passer à l'étape suivante
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Gestionnaire pour revenir à l'étape précédente
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Vérifier si les champs requis sont remplis
  const isStepValid = () => {
    if (activeStep === 1) {
      return (
        requestData.objectives.trim() !== '' && 
        requestData.message.trim() !== '' && 
        requestData.duration !== '' && 
        requestData.preferred_schedule !== ''
      );
    }
    return true;
  };
  
  // Gestionnaire pour soumettre la demande
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Simuler une soumission de demande
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, utiliser cette ligne pour soumettre la demande
      // await mentorshipService.sendMentorshipRequest(mentorId, requestData);
      
      setSubmitSuccess(true);
      
      // Rediriger vers la page de confirmation après un court délai
      setTimeout(() => {
        navigate('/dashboard', { state: { mentorshipRequestSent: true } });
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la soumission de la demande de mentorat:', err);
      setSubmitError('Une erreur est survenue lors de la soumission de votre demande. Veuillez réessayer.');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error || !mentor) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Mentor non trouvé'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          to="/mentors"
        >
          Retour à la recherche
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Accueil
        </MuiLink>
        <MuiLink component={Link} to="/mentors" underline="hover" color="inherit">
          Mentors
        </MuiLink>
        <MuiLink component={Link} to={`/mentors/${mentorId}`} underline="hover" color="inherit">
          {mentor.name}
        </MuiLink>
        <Typography color="text.primary">Demande de mentorat</Typography>
      </Breadcrumbs>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Demande de mentorat
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {submitSuccess ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Demande envoyée avec succès !
            </Typography>
            <Typography variant="body1">
              Votre demande de mentorat a été transmise à {mentor.name}. Vous recevrez une notification lorsqu'il y aura répondu.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Étape 1: Informations sur le mentor */}
            {activeStep === 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Avatar
                    src={mentor.avatar}
                    alt={mentor.name}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  >
                    {mentor.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="h5" component="h2">
                        {mentor.name}
                      </Typography>
                      {mentor.is_verified && (
                        <Tooltip title="Mentor vérifié">
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography variant="body1" gutterBottom>
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
                
                <Typography variant="body1" paragraph>
                  {mentor.bio}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Domaines d'expertise
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {mentor.domains.map((domain, index) => (
                    <Chip key={index} label={domain} />
                  ))}
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Expérience
                    </Typography>
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
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Disponibilité
                    </Typography>
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
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Langues
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LanguageIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {mentor.languages.join(', ')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Statistiques
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {mentor.mentees_count} mentorés · {mentor.sessions_completed} sessions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Approche de mentorat
                </Typography>
                <Typography variant="body1" paragraph>
                  {mentor.mentorship_approach}
                </Typography>
              </Box>
            )}
            
            {/* Étape 2: Objectifs et attentes */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Vos objectifs et attentes
                </Typography>
                <Typography variant="body2" paragraph>
                  Veuillez fournir des informations sur ce que vous attendez de cette relation de mentorat. Cela aidera {mentor.name} à comprendre comment il peut vous aider au mieux.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Objectifs professionnels"
                      name="objectives"
                      value={requestData.objectives}
                      onChange={handleRequestDataChange}
                      multiline
                      rows={3}
                      fullWidth
                      required
                      placeholder="Quels sont vos objectifs professionnels à court et long terme ?"
                      error={requestData.objectives.trim() === ''}
                      helperText={requestData.objectives.trim() === '' ? 'Ce champ est requis' : ''}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Message au mentor"
                      name="message"
                      value={requestData.message}
                      onChange={handleRequestDataChange}
                      multiline
                      rows={4}
                      fullWidth
                      required
                      placeholder="Présentez-vous brièvement et expliquez pourquoi vous souhaitez être mentoré par cette personne en particulier."
                      error={requestData.message.trim() === ''}
                      helperText={requestData.message.trim() === '' ? 'Ce champ est requis' : ''}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={requestData.duration === ''}>
                      <InputLabel>Durée souhaitée</InputLabel>
                      <Select
                        name="duration"
                        value={requestData.duration}
                        onChange={handleRequestDataChange}
                        label="Durée souhaitée"
                      >
                        {durationOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {requestData.duration === '' && (
                        <FormHelperText>Ce champ est requis</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={requestData.preferred_schedule === ''}>
                      <InputLabel>Horaires préférés</InputLabel>
                      <Select
                        name="preferred_schedule"
                        value={requestData.preferred_schedule}
                        onChange={handleRequestDataChange}
                        label="Horaires préférés"
                      >
                        {scheduleOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {requestData.preferred_schedule === '' && (
                        <FormHelperText>Ce champ est requis</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Attentes spécifiques"
                      name="expectations"
                      value={requestData.expectations}
                      onChange={handleRequestDataChange}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Avez-vous des attentes spécifiques concernant cette relation de mentorat ? (optionnel)"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Étape 3: Confirmation */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Récapitulatif de votre demande
                </Typography>
                <Typography variant="body2" paragraph>
                  Veuillez vérifier les informations ci-dessous avant de soumettre votre demande de mentorat à {mentor.name}.
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Objectifs professionnels
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {requestData.objectives}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Message au mentor
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {requestData.message}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Durée souhaitée
                      </Typography>
                      <Typography variant="body2">
                        {durationOptions.find(option => option.value === requestData.duration)?.label}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Horaires préférés
                      </Typography>
                      <Typography variant="body2">
                        {scheduleOptions.find(option => option.value === requestData.preferred_schedule)?.label}
                      </Typography>
                    </Grid>
                    
                    {requestData.expectations && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Attentes spécifiques
                        </Typography>
                        <Typography variant="body2">
                          {requestData.expectations}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
                
                {submitError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {submitError}
                  </Alert>
                )}
                
                <Typography variant="body2" paragraph>
                  En soumettant cette demande, vous acceptez de vous engager dans une relation de mentorat professionnelle et respectueuse. Le mentor peut accepter ou refuser votre demande en fonction de sa disponibilité et de la compatibilité avec vos objectifs.
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Retour
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={<SendIcon />}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Envoyer la demande'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                  >
                    Suivant
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MentorshipRequest;
