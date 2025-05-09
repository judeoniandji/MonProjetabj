import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Divider, 
  Chip, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControl,
  CircularProgress, 
  Alert, 
  IconButton,
  Avatar,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip,
  Snackbar
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  Work as WorkIcon, 
  Euro as EuroIcon, 
  AccessTime as AccessTimeIcon, 
  Business as BusinessIcon, 
  Bookmark as BookmarkIcon, 
  BookmarkBorder as BookmarkBorderIcon, 
  Share as ShareIcon, 
  Print as PrintIcon, 
  Flag as FlagIcon, 
  Star as StarIcon, 
  StarBorder as StarBorderIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  People as PeopleIcon,
  Apartment as ApartmentIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';

// Composant pour afficher les détails d'une offre d'emploi
const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume_id: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Charger les détails de l'offre d'emploi
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        
        // En production, utiliser cette ligne pour récupérer les données réelles
        // const data = await jobService.getJobById(jobId);
        
        // Pour le développement, utiliser des données simulées
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = {
          id: jobId,
          title: 'Développeur Full Stack JavaScript',
          company_name: 'TechCorp',
          company_logo: '',
          company_rating: 4.2,
          company_reviews_count: 125,
          location: 'Paris, France',
          remote_type: 'hybrid', // 'on_site', 'remote', 'hybrid'
          salary_range: '45 000 € - 60 000 € par an',
          contract_type: 'full_time',
          description: `
            <h3>À propos de TechCorp</h3>
            <p>TechCorp est une entreprise innovante spécialisée dans le développement de solutions web et mobiles pour les entreprises du CAC 40. Nous recherchons un développeur Full Stack JavaScript pour rejoindre notre équipe parisienne.</p>
            
            <h3>Description du poste</h3>
            <p>En tant que Développeur Full Stack JavaScript, vous serez responsable de la conception, du développement et de la maintenance de nos applications web et mobiles. Vous travaillerez en étroite collaboration avec nos équipes de design, de produit et de backend pour créer des expériences utilisateur exceptionnelles.</p>
            
            <h3>Responsabilités</h3>
            <ul>
              <li>Développer des applications web et mobiles en utilisant les technologies JavaScript modernes</li>
              <li>Collaborer avec les équipes de design et de produit pour créer des interfaces utilisateur intuitives</li>
              <li>Participer à la conception et à l'implémentation de nouvelles fonctionnalités</li>
              <li>Assurer la qualité du code par des tests unitaires et d'intégration</li>
              <li>Participer aux revues de code et aux sessions de pair programming</li>
              <li>Rester à jour sur les dernières tendances et technologies web</li>
            </ul>
            
            <h3>Profil recherché</h3>
            <ul>
              <li>Expérience de 3 ans minimum en développement web</li>
              <li>Maîtrise de JavaScript, HTML5 et CSS3</li>
              <li>Expérience avec React, Vue.js ou Angular</li>
              <li>Connaissance de Node.js et Express</li>
              <li>Expérience avec les bases de données SQL et NoSQL</li>
              <li>Bonne compréhension des principes de conception responsive</li>
              <li>Capacité à travailler en équipe et à communiquer efficacement</li>
            </ul>
            
            <h3>Avantages</h3>
            <ul>
              <li>Salaire compétitif</li>
              <li>Télétravail partiel (2 jours par semaine)</li>
              <li>Mutuelle d'entreprise</li>
              <li>Tickets restaurant</li>
              <li>Formation continue</li>
              <li>Événements d'entreprise réguliers</li>
            </ul>
          `,
          skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'HTML5', 'CSS3'],
          published_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          application_deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          experience_level: 'mid_level',
          education_level: 'bachelor',
          languages: ['Français', 'Anglais'],
          company_size: '50-250 employés',
          company_industry: 'Technologies de l\'information',
          similar_jobs: [
            { id: 101, title: 'Développeur Frontend React', company_name: 'WebSolutions', location: 'Paris' },
            { id: 102, title: 'Développeur Backend Node.js', company_name: 'DataTech', location: 'Lyon' },
            { id: 103, title: 'Ingénieur Full Stack', company_name: 'InnovCorp', location: 'Bordeaux' }
          ]
        };
        
        setJob(data);
        
        // Vérifier si l'offre est sauvegardée
        if (user && user.type === 'student') {
          try {
            const savedJobs = await jobService.getSavedJobs();
            setSaved(savedJobs.some(savedJob => savedJob.id === jobId));
          } catch (err) {
            console.error('Erreur lors de la vérification des offres sauvegardées:', err);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de l\'offre:', err);
        setError('Impossible de charger les détails de l\'offre. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetail();
  }, [jobId, user]);
  
  // Gestionnaire pour sauvegarder/retirer une offre des favoris
  const handleSaveJob = async () => {
    try {
      if (saved) {
        await jobService.unsaveJob(jobId);
        setSaved(false);
        setSnackbarMessage('Offre retirée des favoris');
      } else {
        await jobService.saveJob(jobId);
        setSaved(true);
        setSnackbarMessage('Offre ajoutée aux favoris');
      }
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde/suppression de l\'offre:', err);
      setSnackbarMessage('Une erreur est survenue');
      setSnackbarOpen(true);
    }
  };
  
  // Gestionnaire pour ouvrir le dialogue de candidature
  const handleOpenApplyDialog = () => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${jobId}` } });
      return;
    }
    
    if (user.type !== 'student') {
      setSnackbarMessage('Seuls les étudiants peuvent postuler aux offres');
      setSnackbarOpen(true);
      return;
    }
    
    setApplyDialogOpen(true);
  };
  
  // Gestionnaire pour fermer le dialogue de candidature
  const handleCloseApplyDialog = () => {
    setApplyDialogOpen(false);
    setSubmitError(null);
  };
  
  // Gestionnaire pour mettre à jour les données de candidature
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestionnaire pour soumettre une candidature
  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Simuler une soumission de candidature
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, utiliser cette ligne pour soumettre la candidature
      // await jobService.applyToJob(jobId, applicationData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setApplyDialogOpen(false);
        setSubmitSuccess(false);
        setApplicationData({
          cover_letter: '',
          resume_id: '',
          phone: ''
        });
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la soumission de la candidature:', err);
      setSubmitError('Une erreur est survenue lors de la soumission de votre candidature. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Gestionnaire pour partager l'offre
  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Offre d'emploi: ${job.title} chez ${job.company_name}`,
        url: window.location.href
      })
      .catch(err => console.error('Erreur lors du partage:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setSnackbarMessage('Lien copié dans le presse-papier');
          setSnackbarOpen(true);
        })
        .catch(err => console.error('Erreur lors de la copie du lien:', err));
    }
  };
  
  // Gestionnaire pour imprimer l'offre
  const handlePrintJob = () => {
    window.print();
  };
  
  // Formater la date
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
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Offre d\'emploi non trouvée'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          to="/jobs"
        >
          Retour aux offres
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Accueil
        </MuiLink>
        <MuiLink component={Link} to="/jobs" underline="hover" color="inherit">
          Offres d'emploi
        </MuiLink>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={3}>
        {/* Colonne principale */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {job.company_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">{job.location}</Typography>
                  {job.remote_type === 'remote' && (
                    <Chip label="Télétravail" size="small" sx={{ ml: 1 }} />
                  )}
                  {job.remote_type === 'hybrid' && (
                    <Chip label="Hybride" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {job.salary_range && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      Publié {formatDate(job.published_date)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {job.company_logo && (
                <Avatar 
                  src={job.company_logo} 
                  alt={job.company_name}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleOpenApplyDialog}
              >
                Postuler maintenant
              </Button>
              <Tooltip title={saved ? "Retirer des favoris" : "Sauvegarder l'offre"}>
                <IconButton 
                  color={saved ? "primary" : "default"} 
                  onClick={handleSaveJob}
                >
                  {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Partager">
                <IconButton onClick={handleShareJob}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Imprimer">
                <IconButton onClick={handlePrintJob}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description du poste
            </Typography>
            
            <Box 
              dangerouslySetInnerHTML={{ __html: job.description }} 
              sx={{ 
                '& h3': { 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  mt: 3,
                  mb: 1
                },
                '& p': { 
                  mb: 2 
                },
                '& ul': { 
                  pl: 2,
                  mb: 2
                },
                '& li': { 
                  mb: 0.5 
                }
              }}
            />
            
            {job.skills && job.skills.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Compétences
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {job.skills.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleOpenApplyDialog}
            >
              Postuler maintenant
            </Button>
          </Box>
        </Grid>
        
        {/* Colonne latérale */}
        <Grid item xs={12} md={4}>
          {/* Informations sur l'entreprise */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              À propos de {job.company_name}
            </Typography>
            
            {job.company_rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ mr: 0.5, fontWeight: 'bold' }}>
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
                {job.company_reviews_count && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({job.company_reviews_count} avis)
                  </Typography>
                )}
              </Box>
            )}
            
            <List dense>
              {job.company_industry && (
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Secteur" 
                    secondary={job.company_industry} 
                  />
                </ListItem>
              )}
              
              {job.company_size && (
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Taille de l'entreprise" 
                    secondary={job.company_size} 
                  />
                </ListItem>
              )}
              
              <ListItem>
                <ListItemIcon>
                  <ApartmentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Siège social" 
                  secondary={job.location.split(',')[0]} 
                />
              </ListItem>
            </List>
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 1 }}
              component={Link}
              to={`/companies/${job.company_name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              Voir le profil de l'entreprise
            </Button>
          </Paper>
          
          {/* Informations sur le poste */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Détails du poste
            </Typography>
            
            <List dense>
              {job.experience_level && (
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Expérience" 
                    secondary={
                      job.experience_level === 'entry_level' ? 'Débutant' : 
                      job.experience_level === 'mid_level' ? 'Intermédiaire' : 
                      job.experience_level === 'senior_level' ? 'Expérimenté' : 
                      job.experience_level === 'executive_level' ? 'Cadre supérieur' : 
                      job.experience_level
                    } 
                  />
                </ListItem>
              )}
              
              {job.education_level && (
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Formation" 
                    secondary={
                      job.education_level === 'high_school' ? 'Bac' : 
                      job.education_level === 'associate' ? 'Bac+2' : 
                      job.education_level === 'bachelor' ? 'Bac+3/4' : 
                      job.education_level === 'master' ? 'Bac+5' : 
                      job.education_level === 'doctorate' ? 'Doctorat' : 
                      job.education_level
                    } 
                  />
                </ListItem>
              )}
              
              {job.languages && job.languages.length > 0 && (
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Langues" 
                    secondary={job.languages.join(', ')} 
                  />
                </ListItem>
              )}
              
              {job.application_deadline && (
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date limite de candidature" 
                    secondary={new Date(job.application_deadline).toLocaleDateString()} 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
          
          {/* Offres similaires */}
          {job.similar_jobs && job.similar_jobs.length > 0 && (
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Offres similaires
              </Typography>
              
              <List>
                {job.similar_jobs.map(similarJob => (
                  <ListItem 
                    key={similarJob.id} 
                    button 
                    component={Link} 
                    to={`/jobs/${similarJob.id}`}
                    sx={{ px: 1 }}
                  >
                    <ListItemText 
                      primary={similarJob.title} 
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            {similarJob.company_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: '0.8rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {similarJob.location}
                            </Typography>
                          </Box>
                        </Box>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button 
                fullWidth 
                component={Link} 
                to="/jobs" 
                sx={{ mt: 1 }}
              >
                Voir plus d'offres
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Dialogue de candidature */}
      <Dialog 
        open={applyDialogOpen} 
        onClose={handleCloseApplyDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Postuler à l'offre: {job.title}
        </DialogTitle>
        
        <DialogContent dividers>
          {submitSuccess ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Candidature envoyée avec succès !
              </Typography>
              <Typography variant="body1">
                Votre candidature a été transmise à {job.company_name}. Vous recevrez une notification lorsqu'ils l'auront consultée.
              </Typography>
            </Box>
          ) : (
            <Box>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Lettre de motivation"
                    multiline
                    rows={8}
                    fullWidth
                    name="cover_letter"
                    value={applicationData.cover_letter}
                    onChange={handleApplicationChange}
                    placeholder="Expliquez pourquoi vous êtes intéressé par ce poste et ce que vous pouvez apporter à l'entreprise..."
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="Numéro de téléphone"
                      name="phone"
                      value={applicationData.phone}
                      onChange={handleApplicationChange}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="CV (ID)"
                      name="resume_id"
                      value={applicationData.resume_id}
                      onChange={handleApplicationChange}
                      helperText="Vous pouvez gérer vos CV dans votre profil"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        {!submitSuccess && (
          <DialogActions>
            <Button onClick={handleCloseApplyDialog}>
              Annuler
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmitApplication}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Envoyer ma candidature'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default JobDetail;
