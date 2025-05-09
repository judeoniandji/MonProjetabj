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
  Alert,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Skeleton,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAIJobRecommendations, recordJobInteraction } from '../../api/ai';
import { STUDY_FIELDS } from '../../constants/formOptions';

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

// Style pour le score de correspondance IA
const AIMatchScore = styled(Box)(({ theme, score }) => ({
  position: 'absolute',
  top: -15,
  right: 20,
  backgroundColor: 
    score >= 80 ? theme.palette.success.main : 
    score >= 60 ? theme.palette.primary.main : 
    theme.palette.warning.main,
  color: score >= 60 ? '#fff' : '#000',
  borderRadius: '50%',
  width: 50,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  boxShadow: theme.shadows[3],
  zIndex: 1,
  border: '2px solid white'
}));

// Style pour les puces de compétences
const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontWeight: 500,
  },
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.contrastText,
  '&.MuiChip-colorPrimary': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  }
}));

// Types d'emploi disponibles
const jobTypes = {
  'full_time': 'Temps plein',
  'part_time': 'Temps partiel',
  'internship': 'Stage',
  'apprenticeship': 'Alternance',
  'freelance': 'Freelance'
};

/**
 * Composant de recommandations d'emploi basées sur l'IA
 * Utilise un système de recommandation avancé pour suggérer des offres pertinentes
 */
const AIJobRecommendations = () => {
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const theme = useTheme();
  
  // Charger les recommandations au chargement du composant
  useEffect(() => {
    fetchRecommendations();
  }, [user]);
  
  // Récupérer les offres d'emploi sauvegardées depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur lors du chargement des offres sauvegardées:', e);
        setSavedJobs([]);
      }
    }
  }, []);
  
  // Fonction pour récupérer les recommandations d'emploi personnalisées
  const fetchRecommendations = async () => {
    if (!user) {
      setError("Connectez-vous pour obtenir des recommandations personnalisées");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAIJobRecommendations(
        user,
        user.id,
        10 // Limiter à 10 recommandations
      );
      
      if (response.status === 'success') {
        setRecommendations(response.data);
        
        // Enregistrer l'interaction de visualisation pour chaque offre
        if (user.id) {
          response.data.forEach(job => {
            recordJobInteraction(user.id, job.id, 'view')
              .catch(err => console.error('Erreur lors de l\'enregistrement de l\'interaction:', err));
          });
        }
      } else {
        setError("Impossible de charger les recommandations. Veuillez réessayer plus tard.");
      }
    } catch (err) {
      console.error('Erreur lors du chargement des recommandations:', err);
      setError("Une erreur s'est produite lors du chargement des recommandations.");
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour sauvegarder/désauvegarder une offre d'emploi
  const toggleSaveJob = (jobId) => {
    let updatedSavedJobs;
    
    if (savedJobs.includes(jobId)) {
      updatedSavedJobs = savedJobs.filter(id => id !== jobId);
      
      // Enregistrer l'interaction de désauvegarder
      if (user?.id) {
        recordJobInteraction(user.id, jobId, 'dismiss')
          .catch(err => console.error('Erreur lors de l\'enregistrement de l\'interaction:', err));
      }
    } else {
      updatedSavedJobs = [...savedJobs, jobId];
      
      // Enregistrer l'interaction de sauvegarder
      if (user?.id) {
        recordJobInteraction(user.id, jobId, 'save')
          .catch(err => console.error('Erreur lors de l\'enregistrement de l\'interaction:', err));
      }
    }
    
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };
  
  // Fonction pour indiquer qu'une offre est pertinente/non pertinente
  const handleFeedback = (jobId, isRelevant) => {
    if (!user?.id) return;
    
    // Enregistrer l'interaction de feedback
    recordJobInteraction(
      user.id, 
      jobId, 
      isRelevant ? 'apply' : 'dismiss'
    ).catch(err => console.error('Erreur lors de l\'enregistrement du feedback:', err));
    
    // Afficher un message de confirmation (dans une implémentation réelle)
    console.log(`Feedback enregistré pour l'offre ${jobId}: ${isRelevant ? 'pertinent' : 'non pertinent'}`);
  };
  
  // Obtenir le nom du domaine d'études
  const getFieldOfStudyName = (fieldId) => {
    const field = STUDY_FIELDS.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };
  
  // Rendu des squelettes de chargement
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={30} width="80%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="50%" sx={{ mb: 2 }} />
            <Divider sx={{ my: 1.5 }} />
            <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Skeleton variant="rectangular" height={24} width={80} />
              <Skeleton variant="rectangular" height={24} width={60} />
              <Skeleton variant="rectangular" height={24} width={70} />
            </Box>
            <Skeleton variant="rectangular" height={36} width="100%" />
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mr: 1, mb: 0 }}>
          Recommandations IA personnalisées
        </Typography>
        <Tooltip title="Ces offres sont recommandées par notre système d'IA qui analyse votre profil et vos interactions pour vous suggérer les emplois les plus pertinents">
          <IconButton size="small">
            <InfoIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Notre système d'intelligence artificielle analyse votre profil, vos compétences et vos interactions 
        pour vous recommander les offres d'emploi les plus pertinentes au Sénégal.
      </Typography>
      
      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Grille de recommandations */}
      <Grid container spacing={3}>
        {/* Afficher les squelettes pendant le chargement */}
        {loading && renderSkeletons()}
        
        {/* Afficher les recommandations */}
        {!loading && recommendations.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <JobCard>
              {/* Score de correspondance IA */}
              <AIMatchScore score={job.ai_match_score}>
                <Tooltip title="Score de correspondance IA basé sur votre profil">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                      IA
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {job.ai_match_score}%
                    </Typography>
                  </Box>
                </Tooltip>
              </AIMatchScore>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom sx={{ color: theme.palette.primary.dark }}>
                  {job.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.company_name || "Entreprise"}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {jobTypes[job.job_type] || job.job_type}
                  </Typography>
                </Box>
                
                {job.field_of_study && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {getFieldOfStudyName(job.field_of_study)}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {job.description.length > 120 
                    ? `${job.description.substring(0, 120)}...` 
                    : job.description}
                </Typography>
                
                {job.required_skills && job.required_skills.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Compétences requises:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {job.required_skills.slice(0, 3).map((skill, index) => (
                        <SkillChip 
                          key={index}
                          label={skill}
                          size="small"
                          color={user?.skills?.includes(skill) ? "primary" : "default"}
                        />
                      ))}
                      {job.required_skills.length > 3 && (
                        <SkillChip 
                          label={`+${job.required_skills.length - 3}`}
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
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <Button 
                      component={Link}
                      to={`/jobs/senegal/${job.id}`}
                      variant="contained" 
                      color="primary" 
                      fullWidth
                    >
                      Voir l'offre
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip title={savedJobs.includes(job.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>
                      <IconButton 
                        color={savedJobs.includes(job.id) ? "primary" : "default"}
                        onClick={() => toggleSaveJob(job.id)}
                        sx={{ border: '1px solid #e0e0e0', borderRadius: 1, width: '100%', height: '100%' }}
                      >
                        {savedJobs.includes(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Tooltip title="Cette offre me correspond">
                    <IconButton 
                      size="small" 
                      onClick={() => handleFeedback(job.id, true)}
                      sx={{ color: 'success.main' }}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Typography variant="caption" color="text.secondary">
                    Publié le {new Date(job.posted_date).toLocaleDateString()}
                  </Typography>
                  
                  <Tooltip title="Cette offre ne me correspond pas">
                    <IconButton 
                      size="small" 
                      onClick={() => handleFeedback(job.id, false)}
                      sx={{ color: 'error.main' }}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </JobCard>
          </Grid>
        ))}
        
        {/* Message si aucune recommandation */}
        {!loading && recommendations.length === 0 && !error && (
          <Grid item xs={12}>
            <Alert severity="info">
              Aucune recommandation disponible pour le moment. Complétez votre profil pour obtenir des suggestions personnalisées.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AIJobRecommendations;
