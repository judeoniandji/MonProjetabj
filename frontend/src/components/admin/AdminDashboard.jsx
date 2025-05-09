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
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import DatabaseReset from './DatabaseReset';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    universities: 0,
    companies: 0,
    events: 0,
    messages: 0
  });

  // Simuler le chargement des statistiques
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setStats({
        totalUsers: 120,
        students: 85,
        universities: 15,
        companies: 20,
        events: 8,
        messages: 45
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Administrateur
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Bienvenue, {user?.name || 'Administrateur'}
        </Typography>
        <Typography variant="body1">
          Vous êtes connecté en tant qu'administrateur. Vous pouvez gérer les utilisateurs, les événements et les paramètres du système.
        </Typography>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Statistiques du système
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Utilisateurs" 
                  subheader={`Total: ${stats.totalUsers}`}
                  avatar={<PeopleIcon color="primary" />}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Étudiants: ${stats.students}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Universités: ${stats.universities}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Entreprises: ${stats.companies}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Activités" 
                  avatar={<DashboardIcon color="primary" />}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Événements: ${stats.events}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MessageIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Messages: ${stats.messages}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Actions rapides" 
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="contained" color="primary">
                      Gérer les utilisateurs
                    </Button>
                    <Button variant="outlined" color="primary">
                      Créer un événement
                    </Button>
                    <Button variant="outlined" color="primary">
                      Paramètres du système
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Dernières inscriptions
          </Typography>
          
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={user?.name || "JUDE"} 
                  secondary={`Email: ${user?.email || "kota@gmail.com"} - Type: Administrateur - Date: ${new Date().toLocaleDateString()}`} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Marie Dupont" 
                  secondary="Email: marie@example.com - Type: Étudiant - Date: 21/03/2025" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="TechCorp" 
                  secondary="Email: contact@techcorp.com - Type: Entreprise - Date: 20/03/2025" 
                />
              </ListItem>
            </List>
          </Paper>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Administration du système
          </Typography>
          
          <DatabaseReset />
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
