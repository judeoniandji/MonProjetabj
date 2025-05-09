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
  School as SchoolIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function MentorDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* En-tête */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Tableau de bord mentor</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/mentor/sessions/new"
              startIcon={<AddIcon />}
            >
              Créer une session
            </Button>
          </Paper>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Étudiants
            </Typography>
            <Typography component="p" variant="h4">
              8
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              en suivi
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Sessions
            </Typography>
            <Typography component="p" variant="h4">
              3
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              à venir
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
              à animer
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Messages
            </Typography>
            <Typography component="p" variant="h4">
              4
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              non lus
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
              <ListItem button component={Link} to="/mentor/students">
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer mes étudiants" />
              </ListItem>
              <ListItem button component={Link} to="/mentor/sessions">
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Voir mes sessions" />
              </ListItem>
              <ListItem button component={Link} to="/mentor/events">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer les événements" />
              </ListItem>
              <ListItem button component={Link} to="/mentor/messages">
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
                  primary="Planification des sessions"
                  secondary="3 sessions à planifier pour la semaine prochaine"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Nouveaux étudiants"
                  secondary="2 nouveaux étudiants souhaitent un suivi"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Événements à venir"
                  secondary="Un webinar sur la carrière est prévu demain"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MentorDashboard; 