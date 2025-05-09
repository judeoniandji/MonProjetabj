import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
} from '@mui/material';
import {
  Work as WorkIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function StudentDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* En-tête */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Tableau de bord étudiant</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/student/jobs"
              startIcon={<WorkIcon />}
            >
              Voir les offres d'emploi
            </Button>
          </Paper>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Candidatures
            </Typography>
            <Typography component="p" variant="h4">
              3
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              en cours
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Événements
            </Typography>
            <Typography component="p" variant="h4">
              2
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              auxquels vous participez
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Messages
            </Typography>
            <Typography component="p" variant="h4">
              5
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              non lus
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Badges
            </Typography>
            <Typography component="p" variant="h4">
              2
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              obtenus
            </Typography>
          </Paper>
        </Grid>

        {/* Actions rapides */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actions rapides
            </Typography>
            <List>
              <ListItem button component={Link} to="/student/jobs">
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Parcourir les offres d'emploi" />
              </ListItem>
              <ListItem button component={Link} to="/student/events">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Voir les événements" />
              </ListItem>
              <ListItem button component={Link} to="/student/messages">
                <ListItemIcon>
                  <MessageIcon />
                </ListItemIcon>
                <ListItemText primary="Voir les messages" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recommandations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommandations
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Complétez votre profil"
                  secondary="Ajoutez vos compétences et votre CV pour augmenter vos chances"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Participez à un événement"
                  secondary="Un webinar sur la préparation aux entretiens est disponible"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Postulez à des offres"
                  secondary="3 offres correspondent à votre profil"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StudentDashboard; 