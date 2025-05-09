import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Dashboard as DashboardIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MentorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSessions: 0,
    upcomingSessions: 0,
    messages: 0,
    rating: 0
  });

  // Simuler le chargement des statistiques
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setStats({
        totalStudents: 12,
        activeSessions: 3,
        upcomingSessions: 5,
        messages: 8,
        rating: 4.8
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Mentor
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            {user?.name?.charAt(0) || 'M'}
          </Avatar>
          <Box>
            <Typography variant="h6" gutterBottom>
              Bienvenue, {user?.name || 'Mentor'}
            </Typography>
            <Typography variant="body1">
              Domaine d'expertise: {user?.expertise || 'Développement web'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
              <Typography variant="body2">
                {stats.rating}/5 (basé sur les évaluations des étudiants)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Aperçu de vos activités
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Étudiants" 
                  subheader={`Total: ${stats.totalStudents}`}
                  avatar={<PeopleIcon color="primary" />}
                />
                <CardContent>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to="/mentor/students"
                    fullWidth
                  >
                    Voir tous les étudiants
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Sessions de mentorat" 
                  avatar={<EventIcon color="primary" />}
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary={`Sessions actives: ${stats.activeSessions}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={`Sessions à venir: ${stats.upcomingSessions}`}
                      />
                    </ListItem>
                  </List>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    to="/mentor/sessions"
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Gérer les sessions
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Messages" 
                  subheader={`${stats.messages} non lus`}
                  avatar={<MessageIcon color="primary" />}
                />
                <CardContent>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    to="/mentor/messages"
                    fullWidth
                  >
                    Voir les messages
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Prochaines sessions
          </Typography>
          
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>JD</Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Session avec Jean Dupont" 
                  secondary="Développement web - Aujourd'hui à 15:00" 
                />
                <Chip label="À venir" color="primary" size="small" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'secondary.light' }}>ML</Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Session avec Marie Leroy" 
                  secondary="JavaScript avancé - Demain à 10:00" 
                />
                <Chip label="À venir" color="primary" size="small" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'error.light' }}>PD</Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Session avec Pierre Durand" 
                  secondary="Frameworks React - 24/03/2025 à 14:00" 
                />
                <Chip label="À venir" color="primary" size="small" />
              </ListItem>
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/mentor/sessions"
              >
                Voir toutes les sessions
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default MentorDashboard;
