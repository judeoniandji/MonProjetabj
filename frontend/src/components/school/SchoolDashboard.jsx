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
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const SchoolDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    events: 0,
    partners: 0
  });

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setStats({
        students: 1250,
        courses: 75,
        events: 12,
        partners: 28
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Université
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Bienvenue, {user?.universityName || user?.name || 'Université'}
        </Typography>
        <Typography variant="body1">
          Vous êtes connecté en tant qu'établissement d'enseignement. Vous pouvez gérer vos étudiants, vos cours et vos partenariats.
        </Typography>
        {user?.location && (
          <Box mt={2}>
            <Chip 
              icon={<LocationIcon />} 
              label={`Localisation: ${user.location}`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        )}
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Statistiques de l'établissement
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader 
                  title="Étudiants" 
                  subheader={`${stats.students} inscrits`}
                  avatar={<PersonIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Gérer les étudiants
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader 
                  title="Formations" 
                  subheader={`${stats.courses} cours`}
                  avatar={<AssignmentIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Gérer les formations
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader 
                  title="Événements" 
                  subheader={`${stats.events} à venir`}
                  avatar={<EventIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Gérer les événements
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader 
                  title="Partenaires" 
                  subheader={`${stats.partners} entreprises`}
                  avatar={<BusinessIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Gérer les partenariats
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Événements à venir
          </Typography>
          
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Journée portes ouvertes" 
                  secondary="30 mars 2025 - 500 participants attendus" 
                />
                <Button variant="text" color="primary">
                  Détails
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Forum des métiers" 
                  secondary="15 avril 2025 - En partenariat avec 15 entreprises" 
                />
                <Button variant="text" color="primary">
                  Détails
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Conférence sur l'IA" 
                  secondary="22 avril 2025 - Intervenant: Dr. Martin, Google Research" 
                />
                <Button variant="text" color="primary">
                  Détails
                </Button>
              </ListItem>
            </List>
          </Paper>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Dernières demandes de partenariat
          </Typography>
          
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="TechCorp" 
                  secondary="Demande de partenariat pour stages - Reçue il y a 2 jours" 
                />
                <Box>
                  <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                    Accepter
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Refuser
                  </Button>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Innovate Labs" 
                  secondary="Proposition de projets étudiants - Reçue il y a 5 jours" 
                />
                <Box>
                  <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                    Accepter
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Refuser
                  </Button>
                </Box>
              </ListItem>
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default SchoolDashboard;
