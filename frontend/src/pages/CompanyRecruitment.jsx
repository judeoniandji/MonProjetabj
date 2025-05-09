import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider, 
  Card, 
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  Business as BusinessIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

// Composant stylisé pour les cartes d'offres d'emploi
const JobCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.grey[200]}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.light,
  },
}));

// Composant stylisé pour le formulaire
const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: 'linear-gradient(to right bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.grey[200]}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #1E88E5, #00B0FF, #00C853)',
  }
}));

// Étapes du processus de recrutement
const recruitmentSteps = [
  'Création de l\'offre',
  'Publication',
  'Présélection des candidats',
  'Entretiens',
  'Sélection finale'
];

/**
 * Page de recrutement pour les entreprises
 * Inspirée par Indeed
 */
const CompanyRecruitment = () => {
  const theme = useTheme();
  const { user } = useSelector(state => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [jobPostings, setJobPostings] = useState([
    {
      id: 1,
      title: 'Développeur Full Stack',
      location: 'Dakar, Sénégal',
      type: 'CDI',
      salary: '1 500 000 - 2 000 000 FCFA',
      description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe...',
      requirements: ['React', 'Node.js', 'MongoDB', '3+ ans d\'expérience'],
      applicants: 12,
      status: 'active',
      createdAt: '2025-03-15'
    },
    {
      id: 2,
      title: 'Data Scientist',
      location: 'Dakar, Sénégal',
      type: 'CDD',
      salary: '1 800 000 - 2 500 000 FCFA',
      description: 'Rejoignez notre équipe d\'analyse de données pour travailler sur des projets innovants...',
      requirements: ['Python', 'Machine Learning', 'SQL', 'Statistiques'],
      applicants: 8,
      status: 'active',
      createdAt: '2025-03-20'
    }
  ]);
  
  // État du formulaire de création d'offre
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: '',
    educationLevel: ''
  });
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob({
      ...newJob,
      [name]: value
    });
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Créer une nouvelle offre d'emploi
    const newJobPosting = {
      id: jobPostings.length + 1,
      ...newJob,
      requirements: newJob.requirements.split(',').map(req => req.trim()),
      applicants: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Ajouter l'offre à la liste
    setJobPostings([...jobPostings, newJobPosting]);
    
    // Réinitialiser le formulaire
    setNewJob({
      title: '',
      location: '',
      type: '',
      salary: '',
      description: '',
      requirements: '',
      educationLevel: ''
    });
    
    // Passer à l'étape suivante
    setActiveStep(1);
  };
  
  // Avancer dans le processus de recrutement
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Reculer dans le processus de recrutement
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.dark,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'inline-block',
              width: '5px',
              height: '30px',
              background: 'linear-gradient(to bottom, #1E88E5, #00B0FF)',
              marginRight: '15px',
              borderRadius: '3px'
            }
          }}
        >
          Espace Recrutement
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Publiez des offres d'emploi, gérez vos candidatures et trouvez les meilleurs talents pour votre entreprise.
        </Typography>
      </Box>
      
      {/* Stepper pour le processus de recrutement */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {recruitmentSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Formulaire de création d'offre d'emploi */}
          <FormPaper elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" component="h2">
                Créer une nouvelle offre d'emploi
              </Typography>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Titre du poste"
                    name="title"
                    value={newJob.title}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Lieu"
                    name="location"
                    value={newJob.location}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Ex: Dakar, Sénégal"
                    InputProps={{
                      startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Type de contrat</InputLabel>
                    <Select
                      name="type"
                      value={newJob.type}
                      onChange={handleChange}
                      label="Type de contrat"
                    >
                      <MenuItem value="CDI">CDI</MenuItem>
                      <MenuItem value="CDD">CDD</MenuItem>
                      <MenuItem value="Stage">Stage</MenuItem>
                      <MenuItem value="Freelance">Freelance</MenuItem>
                      <MenuItem value="Alternance">Alternance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salaire (optionnel)"
                    name="salary"
                    value={newJob.salary}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Ex: 1 500 000 - 2 000 000 FCFA"
                    InputProps={{
                      startAdornment: <SalaryIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Niveau d'études</InputLabel>
                    <Select
                      name="educationLevel"
                      value={newJob.educationLevel}
                      onChange={handleChange}
                      label="Niveau d'études"
                    >
                      <MenuItem value="Bac">Bac</MenuItem>
                      <MenuItem value="Bac+2">Bac+2</MenuItem>
                      <MenuItem value="Bac+3">Bac+3 (Licence)</MenuItem>
                      <MenuItem value="Bac+5">Bac+5 (Master)</MenuItem>
                      <MenuItem value="Doctorat">Doctorat</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Description du poste"
                    name="description"
                    value={newJob.description}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Décrivez les responsabilités et les missions du poste..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Compétences requises"
                    name="requirements"
                    value={newJob.requirements}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Ex: React, Node.js, MongoDB (séparés par des virgules)"
                    helperText="Séparez les compétences par des virgules"
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ 
                      background: 'linear-gradient(45deg, #1E88E5 30%, #00B0FF 90%)',
                      boxShadow: '0 3px 10px rgba(30, 136, 229, 0.3)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(30, 136, 229, 0.4)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Publier l'offre
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormPaper>
          
          {/* Liste des offres d'emploi publiées */}
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.text.primary,
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '20px',
                  background: theme.palette.secondary.main,
                  marginRight: '10px',
                  borderRadius: '2px'
                }
              }}
            >
              Vos offres d'emploi ({jobPostings.length})
            </Typography>
            
            {jobPostings.map((job) => (
              <JobCard key={job.id} elevation={1}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {job.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          {job.location}
                        </Typography>
                        
                        <ScheduleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.type}
                        </Typography>
                      </Box>
                      
                      {job.salary && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SalaryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.salary}
                          </Typography>
                        </Box>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {job.description.substring(0, 150)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {job.requirements.map((req, index) => (
                          <Chip 
                            key={index} 
                            label={req} 
                            size="small" 
                            sx={{ 
                              background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.info.light})`,
                              color: 'white',
                              fontWeight: 500
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Chip 
                        label={`${job.applicants} candidats`} 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 1 }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Publié le {job.createdAt}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      sx={{ mr: 1 }}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                    >
                      Voir les candidatures
                    </Button>
                  </Box>
                </CardContent>
              </JobCard>
            ))}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Statistiques et conseils */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%)',
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: theme.shape.borderRadius
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Statistiques de recrutement
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" color="primary.main">
                  {jobPostings.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Offres actives
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" color="secondary.main">
                  {jobPostings.reduce((acc, job) => acc + job.applicants, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Candidatures
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" color="success.main">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recrutements
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Conseils de recrutement */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              background: 'linear-gradient(to right bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: theme.shape.borderRadius
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HelpIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
              <Typography variant="h6" component="h2">
                Conseils pour un recrutement efficace
              </Typography>
            </Box>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Les offres d'emploi avec une description détaillée reçoivent 30% plus de candidatures qualifiées.
            </Alert>
            
            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, mt: 2 }}>
              Bonnes pratiques :
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" paragraph>
                Soyez précis sur les compétences requises et les responsabilités du poste
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Mentionnez la fourchette de salaire pour attirer des candidats plus qualifiés
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Répondez rapidement aux candidatures pour ne pas perdre les meilleurs talents
              </Typography>
            </Box>
            
            <Button 
              fullWidth 
              variant="outlined" 
              color="info"
              sx={{ mt: 2 }}
            >
              Guide complet du recrutement
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyRecruitment;
