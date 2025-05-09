import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  CircularProgress, 
  Divider, 
  Container,
  Alert,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { STUDY_FIELDS } from '../constants/formOptions';
import { getSenegalJob } from '../api/senegal';

// Style pour les puces de compétences
const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontWeight: 500,
  },
}));

// Style pour l'avatar de l'entreprise
const CompanyAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[2]
}));

/**
 * Page de détails d'une offre d'emploi
 */
const JobDetails = () => {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  
  // Types d'emploi disponibles
  const jobTypes = {
    'full_time': 'Temps plein',
    'part_time': 'Temps partiel',
    'internship': 'Stage',
    'apprenticeship': 'Alternance',
    'freelance': 'Freelance'
  };

  // Charger les détails de l'offre d'emploi
  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);
  
  // Fonction pour récupérer les détails de l'offre d'emploi
  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSenegalJob(jobId);
      
      if (response.status === 'success') {
        setJob(response.data);
      } else {
        setError("Impossible de charger les détails de l'offre d'emploi.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des détails de l'offre:", err);
      setError("Une erreur s'est produite lors du chargement des détails de l'offre. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Obtenir le nom du domaine d'études
  const getFieldOfStudyName = (fieldId) => {
    const field = STUDY_FIELDS.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Offre d'emploi non trouvée."}
        </Alert>
        <Button component={Link} to="/jobs" variant="contained">
          Retour aux offres d'emploi
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Accueil
        </Link>
        <Link to="/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>
          Offres d'emploi
        </Link>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Détails de l'offre */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {job.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Chip 
                icon={<WorkIcon />} 
                label={jobTypes[job.job_type] || job.job_type} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<LocationOnIcon />} 
                label={job.location} 
                variant="outlined" 
              />
              <Chip 
                icon={<CalendarTodayIcon />} 
                label={`Publié le ${formatDate(job.posted_date)}`} 
                variant="outlined" 
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Description du poste
            </Typography>
            
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Compétences requises
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
              {job.required_skills.map((skill, index) => (
                <SkillChip 
                  key={index} 
                  label={skill} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
            </Box>
            
            <List>
              {job.field_of_study && (
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Domaine d'études" 
                    secondary={getFieldOfStudyName(job.field_of_study)} 
                  />
                </ListItem>
              )}
              
              {job.experience_years && (
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Expérience requise" 
                    secondary={`${job.experience_years} ans`} 
                  />
                </ListItem>
              )}
              
              {job.salary && (
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Rémunération" 
                    secondary={job.salary} 
                  />
                </ListItem>
              )}
              
              {job.application_deadline && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date limite de candidature" 
                    secondary={formatDate(job.application_deadline)} 
                  />
                </ListItem>
              )}
            </List>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<DescriptionIcon />}
              >
                Postuler à cette offre
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Informations sur l'entreprise */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CompanyAvatar 
                src={job.company_logo || '/static/images/company-placeholder.png'} 
                alt={job.company_name}
              >
                {!job.company_logo && job.company_name?.charAt(0)}
              </CompanyAvatar>
              
              <Typography variant="h6" gutterBottom>
                {job.company_name}
              </Typography>
              
              {job.company_industry && (
                <Chip 
                  label={job.company_industry} 
                  color="secondary" 
                  variant="outlined" 
                  sx={{ mb: 2 }} 
                />
              )}
              
              {job.company_description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {job.company_description}
                </Typography>
              )}
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                component={Link}
                to={`/companies/${job.company_id}`}
                startIcon={<BusinessIcon />}
              >
                Voir le profil de l'entreprise
              </Button>
              
              {job.company_website && (
                <Button 
                  variant="text" 
                  color="primary" 
                  fullWidth
                  href={job.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  Visiter le site web
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Offres similaires
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Fonctionnalité à venir prochainement...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Button 
          component={Link} 
          to="/jobs" 
          variant="outlined"
          startIcon={<NavigateNextIcon sx={{ transform: 'rotate(180deg)' }} />}
        >
          Retour aux offres d'emploi
        </Button>
      </Box>
    </Container>
  );
};

export default JobDetails;
