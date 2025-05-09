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
  Work as WorkIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    completedCourses: 0,
    currentCourses: 0,
    upcomingEvents: 0,
    jobApplications: 0,
    unreadMessages: 0
  });

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setStats({
        completedCourses: 8,
        currentCourses: 4,
        upcomingEvents: 3,
        jobApplications: 5,
        unreadMessages: 2
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Étudiant
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Bienvenue, {user?.name || 'Étudiant'}
        </Typography>
        <Typography variant="body1">
          Vous êtes connecté en tant qu'étudiant. Vous pouvez consulter vos cours, postuler à des offres d'emploi et participer à des événements.
        </Typography>
        {user?.school && (
          <Box mt={1}>
            <Chip 
              icon={<SchoolIcon />} 
              label={`École: ${typeof user.school === 'object' ? user.school?.name : user.school || 'Non spécifiée'}`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        )}
        {user?.fieldOfStudy && (
          <Box mt={1}>
            <Chip 
              icon={<AssignmentIcon />} 
              label={`Domaine d'études: ${typeof user.fieldOfStudy === 'object' ? user.fieldOfStudy?.name : user.fieldOfStudy || 'Non spécifié'}`} 
              color="secondary" 
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
            Votre progression
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Cours" 
                  subheader={`${stats.completedCourses} cours terminés`}
                  avatar={<SchoolIcon color="primary" />}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Cours actuels: ${stats.currentCourses}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText primary="Moyenne générale: A-" />
                    </ListItem>
                  </List>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Voir tous les cours
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Emploi" 
                  subheader={`${stats.jobApplications} candidatures`}
                  avatar={<WorkIcon color="primary" />}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText primary="2 entretiens à venir" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText primary="3 offres recommandées" />
                    </ListItem>
                  </List>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Voir les offres d'emploi
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader 
                  title="Événements" 
                  subheader={`${stats.upcomingEvents} événements à venir`}
                  avatar={<EventIcon color="primary" />}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Forum des métiers" 
                        secondary="25 mars 2025" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Atelier CV" 
                        secondary="28 mars 2025" 
                      />
                    </ListItem>
                  </List>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                      Voir tous les événements
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Activité récente
          </Typography>
          
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <MessageIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Nouveau message de Prof. Martin" 
                  secondary="À propos de votre projet final - Reçu il y a 2 heures" 
                />
                <Button variant="text" color="primary">
                  Lire
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <WorkIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Candidature vue par TechCorp" 
                  secondary="Stage développeur web - Il y a 1 jour" 
                />
                <Button variant="text" color="primary">
                  Détails
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Note publiée: Projet Web" 
                  secondary="Vous avez obtenu A - Il y a 3 jours" 
                />
                <Button variant="text" color="primary">
                  Voir
                </Button>
              </ListItem>
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default StudentDashboard;
