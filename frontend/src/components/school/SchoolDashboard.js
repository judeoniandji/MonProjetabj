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
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function SchoolDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* En-tête */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Tableau de bord établissement</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/school/events/new"
              startIcon={<AddIcon />}
            >
              Créer un événement
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
              250
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              actifs sur la plateforme
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Partenaires
            </Typography>
            <Typography component="p" variant="h4">
              15
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              entreprises partenaires
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Événements
            </Typography>
            <Typography component="p" variant="h4">
              5
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              à venir
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Messages
            </Typography>
            <Typography component="p" variant="h4">
              6
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
              <ListItem button component={Link} to="/school/students">
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer les étudiants" />
              </ListItem>
              <ListItem button component={Link} to="/school/partners">
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer les partenaires" />
              </ListItem>
              <ListItem button component={Link} to="/school/events">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer les événements" />
              </ListItem>
              <ListItem button component={Link} to="/school/messages">
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
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Engagement des étudiants"
                  secondary="Encouragez vos étudiants à compléter leurs profils"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Nouveaux partenaires"
                  secondary="3 entreprises souhaitent devenir partenaires"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Événements à organiser"
                  secondary="Planifiez un forum des métiers pour la semaine prochaine"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SchoolDashboard; 