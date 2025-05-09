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
  People as PeopleIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function CompanyDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* En-tête */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Tableau de bord entreprise</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/company/jobs/new"
              startIcon={<AddIcon />}
            >
              Publier une offre
            </Button>
          </Paper>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Offres actives
            </Typography>
            <Typography component="p" variant="h4">
              5
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              en cours de recrutement
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Candidatures
            </Typography>
            <Typography component="p" variant="h4">
              12
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              à traiter
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
              3
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
              <ListItem button component={Link} to="/company/jobs">
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer les offres d'emploi" />
              </ListItem>
              <ListItem button component={Link} to="/company/applications">
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Voir les candidatures" />
              </ListItem>
              <ListItem button component={Link} to="/company/events">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Gérer les événements" />
              </ListItem>
              <ListItem button component={Link} to="/company/messages">
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
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Optimisez vos offres"
                  secondary="Ajoutez des mots-clés pertinents pour améliorer la visibilité"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Traitement des candidatures"
                  secondary="3 nouvelles candidatures nécessitent votre attention"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Organisez un événement"
                  secondary="Créez un événement pour rencontrer des candidats"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CompanyDashboard; 