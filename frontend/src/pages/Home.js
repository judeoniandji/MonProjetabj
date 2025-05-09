import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';
import {
  Work as WorkIcon,
  Event as EventIcon,
  People as PeopleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    title: 'Offres d\'emploi',
    description: 'Trouvez des stages, alternances et emplois adaptés à votre profil.',
    path: '/jobs',
  },
  {
    icon: <EventIcon sx={{ fontSize: 40 }} />,
    title: 'Événements',
    description: 'Participez à des workshops, conférences et hackathons.',
    path: '/events',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    title: 'Réseau',
    description: 'Connectez-vous avec d\'autres étudiants et professionnels.',
    path: '/profile',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Formation',
    description: 'Développez vos compétences et votre carrière.',
    path: '/profile',
  },
];

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Bienvenue sur CampusConnect
              </Typography>
              <Typography variant="h5" gutterBottom>
                La plateforme qui connecte les étudiants aux opportunités professionnelles
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
                onClick={() => navigate('/register')}
              >
                Rejoignez-nous
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Découvrez nos fonctionnalités
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(feature.path)}
                  >
                    En savoir plus
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mt: 8 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                1000+
              </Typography>
              <Typography variant="h6">Étudiants inscrits</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                500+
              </Typography>
              <Typography variant="h6">Offres d'emploi</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                100+
              </Typography>
              <Typography variant="h6">Événements</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                50+
              </Typography>
              <Typography variant="h6">Entreprises partenaires</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 