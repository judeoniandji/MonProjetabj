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
  Business as BusinessIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const CompanyDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    events: 0,
    interviews: 0
  });

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setStats({
        activeJobs: 12,
        applications: 48,
        events: 3,
        interviews: 15
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Entreprise
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Bienvenue, {user?.companyName || user?.name || 'Entreprise'}
        </Typography>
        <Typography variant="body1">
          Vous êtes connecté en tant qu'entreprise. Vous pouvez gérer vos offres d'emploi, vos événements et vos candidatures.
        </Typography>
        {user?.industry && (
          <Box mt={2}>
            <Chip 
              icon={<CategoryIcon />} 
              label={`Secteur: ${user.industry}`} 
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
            Statistiques de recrutement
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader 
                  title="Offres d'emploi" 
                  subheader={`${stats.activeJobs} actives`}
                  avatar={<WorkIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Gérer les offres
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader 
                  title="Candidatures" 
                  subheader={`${stats.applications} reçues`}
                  avatar={<AssignmentIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Voir les candidatures
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
                  title="Entretiens" 
                  subheader={`${stats.interviews} planifiés`}
                  avatar={<PersonIcon color="primary" />}
                />
                <CardContent>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Voir le calendrier
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Dernières candidatures
          </Typography>
          
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Marie Dupont" 
                  secondary="Développeur Full-Stack - Candidature reçue il y a 2 jours" 
                />
                <Box>
                  <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                    Entretien
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Refuser
                  </Button>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Jean Martin" 
                  secondary="Data Scientist - Candidature reçue il y a 3 jours" 
                />
                <Box>
                  <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                    Entretien
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Refuser
                  </Button>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sophie Leclerc" 
                  secondary="Chef de projet - Candidature reçue il y a 5 jours" 
                />
                <Box>
                  <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                    Entretien
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Refuser
                  </Button>
                </Box>
              </ListItem>
            </List>
          </Paper>
          
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
                  primary="Forum des métiers - Université Paris Tech" 
                  secondary="15 avril 2025 - 10h00 à 17h00" 
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
                  primary="Journée de recrutement interne" 
                  secondary="22 avril 2025 - 9h00 à 18h00" 
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
                  primary="Salon de l'emploi - Paris Expo" 
                  secondary="5 mai 2025 - 9h00 à 19h00" 
                />
                <Button variant="text" color="primary">
                  Détails
                </Button>
              </ListItem>
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default CompanyDashboard;
