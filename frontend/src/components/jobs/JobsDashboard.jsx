import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import JobOffersComponent from './JobOffersComponent';

// Style pour les cartes
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

/**
 * Composant pour le tableau de bord des offres d'emploi
 */
const JobsDashboard = () => {
  // État pour le contrôle de l'UI
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // Charger l'utilisateur actuel depuis le localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Rendu des onglets
  const renderTabs = () => {
    return (
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="job dashboard tabs"
        >
          <Tab 
            icon={<WorkIcon />} 
            label="Offres d'emploi" 
            iconPosition="start"
          />
          <Tab 
            icon={<BookmarkIcon />} 
            label="Offres sauvegardées" 
            iconPosition="start"
          />
          <Tab 
            icon={<SearchIcon />} 
            label="Recherche avancée" 
            iconPosition="start"
          />
          <Tab 
            icon={<SchoolIcon />} 
            label="Formations" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
    );
  };

  // Rendu du contenu de l'onglet actuel
  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <JobOffersComponent />;
      case 1:
        return renderSavedJobs();
      case 2:
        return renderAdvancedSearch();
      case 3:
        return renderTrainings();
      default:
        return <JobOffersComponent />;
    }
  };

  // Rendu des offres sauvegardées
  const renderSavedJobs = () => {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <BookmarkIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Offres sauvegardées
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Retrouvez ici les offres d'emploi que vous avez sauvegardées pour y revenir plus tard.
        </Typography>
        
        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
          Vous n'avez pas encore sauvegardé d'offres d'emploi.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setTabValue(0)}
          >
            Découvrir des offres
          </Button>
        </Box>
      </Box>
    );
  };

  // Rendu de la recherche avancée
  const renderAdvancedSearch = () => {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Recherche avancée
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Utilisez notre recherche avancée pour trouver des offres d'emploi correspondant précisément à vos critères.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Cette fonctionnalité sera bientôt disponible. Revenez plus tard !
        </Typography>
      </Box>
    );
  };

  // Rendu des formations
  const renderTrainings = () => {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Formations recommandées
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Découvrez des formations adaptées à votre profil pour développer vos compétences et améliorer votre employabilité.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt="Formation en développement web"
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Formation complète en développement web
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Organisme: OpenClassrooms
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Durée: 6 mois
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" paragraph>
                  Apprenez le développement web de A à Z : HTML, CSS, JavaScript, React, Node.js et plus encore.
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Voir la formation
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt="Formation en data science"
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Data Science et Machine Learning
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Organisme: Coursera
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Durée: 4 mois
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" paragraph>
                  Maîtrisez les fondamentaux de la data science, de l'analyse de données et du machine learning.
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Voir la formation
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt="Formation en UX/UI Design"
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  UX/UI Design: créer des interfaces utilisateur
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Organisme: Udemy
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Durée: 3 mois
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" paragraph>
                  Apprenez à concevoir des interfaces utilisateur intuitives et esthétiques avec les principes du UX/UI design.
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Voir la formation
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Si aucun utilisateur n'est connecté
  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Offres d'emploi
        </Typography>
        <Typography variant="body1">
          Veuillez vous connecter pour accéder aux offres d'emploi.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Offres d'emploi
      </Typography>
      
      {renderTabs()}
      {renderTabContent()}
    </Container>
  );
};

export default JobsDashboard;
