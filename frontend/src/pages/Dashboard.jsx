import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Box, Alert, Button, Typography, Paper, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

// Import du sélecteur de tableau de bord
import DashboardSelector from '../components/dashboards/DashboardSelector';

/**
 * Page principale du tableau de bord qui affiche un message convivial
 * si l'utilisateur n'est pas connecté
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, token } = useSelector(state => state.auth);
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
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
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: theme.palette.primary.dark,
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Bienvenue sur Campus Connect
          </Typography>
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { color: theme.palette.info.main }
            }}
          >
            Vous devez être connecté pour accéder à votre tableau de bord personnalisé et profiter de toutes les fonctionnalités de Campus Connect.
          </Alert>
          
          <Typography variant="body1" paragraph color="text.secondary">
            Campus Connect vous permet de découvrir des opportunités d'emploi, de vous connecter avec des mentors, et de développer votre réseau professionnel au Sénégal.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/home')}
              sx={{ 
                background: 'linear-gradient(45deg, #1E88E5 30%, #00B0FF 90%)',
                boxShadow: '0 3px 10px rgba(30, 136, 229, 0.3)',
                transition: 'all 0.3s',
                px: 4,
                py: 1.5,
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(30, 136, 229, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Découvrir Campus Connect
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        <DashboardSelector />
      </Box>
    </Container>
  );
};

export default Dashboard;
