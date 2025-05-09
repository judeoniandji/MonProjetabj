import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert,
  Divider,
  Container,
  Breadcrumbs,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import { getJobMarketInsights } from '../api/ai';
import AIJobRecommendations from '../components/jobs/AIJobRecommendations';

// Style pour les cartes
const InsightCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  },
  border: `1px solid ${theme.palette.grey[100]}`,
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #1E88E5, #00B0FF)',
  }
}));

// Style pour les barres de progression
const GrowthBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: 
      value >= 15 ? theme.palette.success.main : 
      value >= 10 ? theme.palette.primary.main : 
      theme.palette.info.main,
    backgroundImage: 
      value >= 15 ? 'linear-gradient(90deg, #00C853, #69F0AE)' : 
      value >= 10 ? 'linear-gradient(90deg, #1E88E5, #64B5F6)' : 
      'linear-gradient(90deg, #00B0FF, #80D8FF)',
  }
}));

// Style pour les puces de tendance
const TrendChip = styled(Chip)(({ theme, growth }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 
    growth >= 15 ? theme.palette.success.light : 
    growth >= 10 ? theme.palette.primary.light : 
    theme.palette.info.light,
  color: 
    growth >= 15 ? theme.palette.success.contrastText : 
    growth >= 10 ? theme.palette.primary.contrastText : 
    theme.palette.info.contrastText,
  '& .MuiChip-icon': {
    color: 'inherit'
  },
  fontWeight: 500,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: 'none',
}));

/**
 * Page d'insights sur le marché de l'emploi basés sur l'IA
 */
const JobInsights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const theme = useTheme();
  
  // Charger les insights au chargement de la page
  useEffect(() => {
    fetchInsights();
  }, []);
  
  // Fonction pour récupérer les insights du marché de l'emploi
  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getJobMarketInsights();
      
      if (response.status === 'success') {
        setInsights(response.data);
      } else {
        setError("Impossible de charger les insights du marché de l'emploi.");
      }
    } catch (err) {
      console.error('Erreur lors du chargement des insights:', err);
      setError("Une erreur s'est produite lors du chargement des insights du marché de l'emploi.");
    } finally {
      setLoading(false);
    }
  };

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
          Emplois
        </Link>
        <Typography color="text.primary">Insights IA</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Insights IA du marché de l'emploi sénégalais
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Notre système d'intelligence artificielle analyse en permanence le marché de l'emploi au Sénégal 
        pour vous fournir des insights précieux sur les tendances, les compétences recherchées et 
        les opportunités émergentes.
      </Typography>
      
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
      
      {/* Contenu des insights */}
      {!loading && insights && (
        <Grid container spacing={4}>
          {/* Compétences en tendance */}
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" component="h2" sx={{ 
                    color: theme.palette.primary.dark,
                    fontWeight: 'bold'
                  }}>
                    Compétences en forte demande
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Ces compétences connaissent une croissance significative dans les offres d'emploi au Sénégal.
                  Développez-les pour augmenter votre employabilité.
                </Typography>
                
                <List>
                  {insights.trending_skills.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.skill.replace('_', ' ')} 
                        secondary={`Croissance: ${item.growth}%`} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Box sx={{ width: '40%', ml: 2 }}>
                        <GrowthBar 
                          variant="determinate" 
                          value={item.growth * 5} // Multiplier pour avoir une échelle visuelle
                          value={item.growth}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
          
          {/* Industries en croissance */}
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon color="secondary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" component="h2" sx={{ 
                    color: theme.palette.secondary.dark,
                    fontWeight: 'bold'
                  }}>
                    Industries en croissance
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Ces secteurs connaissent une expansion rapide au Sénégal et offrent de nombreuses opportunités d'emploi.
                </Typography>
                
                <List>
                  {insights.growing_industries.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingUpIcon 
                          fontSize="small"
                          color={item.growth >= 15 ? "success" : "primary"}
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.industry} 
                        secondary={`Croissance: ${item.growth}%`} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Box sx={{ width: '40%', ml: 2 }}>
                        <GrowthBar 
                          variant="determinate" 
                          value={item.growth * 4} 
                          value={item.growth}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
          
          {/* Tendances salariales */}
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon color="info" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" component="h2" sx={{ 
                    color: theme.palette.info.dark,
                    fontWeight: 'bold'
                  }}>
                    Tendances salariales
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Évolution des salaires par domaine d'études au Sénégal sur les 12 derniers mois.
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Croissance globale des salaires: +{insights.salary_trends.overall_growth}%
                  </Typography>
                  <GrowthBar 
                    variant="determinate" 
                    value={insights.salary_trends.overall_growth * 10} 
                    value={insights.salary_trends.overall_growth}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Par domaine d'études:
                </Typography>
                
                <List dense>
                  {Object.entries(insights.salary_trends.by_field).map(([field, growth], index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText 
                        primary={field.replace('_', ' ')} 
                        secondary={`+${growth}%`} 
                      />
                      <Box sx={{ width: '40%', ml: 2 }}>
                        <GrowthBar 
                          variant="determinate" 
                          value={growth * 10} 
                          value={growth}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
          
          {/* Demande par localisation */}
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" component="h2" sx={{ 
                    color: theme.palette.success.dark,
                    fontWeight: 'bold'
                  }}>
                    Demande par localisation
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Niveau de demande d'emploi dans différentes régions du Sénégal.
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                  {insights.location_demand.map((item, index) => {
                    // Convertir le niveau de demande en valeur numérique pour la couleur
                    const demandLevel = 
                      item.demand === 'Très élevée' ? 20 :
                      item.demand === 'Élevée' ? 15 :
                      item.demand === 'Modérée' ? 10 :
                      item.demand === 'En croissance' ? 12 : 5;
                    
                    return (
                      <TrendChip
                        key={index}
                        icon={<LocationOnIcon />}
                        label={`${item.location}: ${item.demand}`}
                        growth={demandLevel}
                        sx={{ mb: 1, mr: 1 }}
                      />
                    );
                  })}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Conseils pour votre recherche d'emploi:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TimelineIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Concentrez-vous sur les compétences en forte demande dans votre domaine" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TimelineIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Explorez les opportunités dans les industries en croissance" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TimelineIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Considérez les régions à forte demande pour élargir vos possibilités" />
                  </ListItem>
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
        </Grid>
      )}
      
      {/* Section de recommandations personnalisées */}
      <Box sx={{ mt: 6 }}>
        <Divider sx={{ mb: 4 }} />
        <AIJobRecommendations />
      </Box>
    </Container>
  );
};

export default JobInsights;
