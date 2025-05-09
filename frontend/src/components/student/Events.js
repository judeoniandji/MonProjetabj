import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Events() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des événements
    const mockEvents = [
      {
        id: 1,
        title: 'Forum des Métiers',
        description: 'Rencontrez des professionnels de différents secteurs',
        date: '2024-03-20T09:00:00',
        location: 'Campus Principal',
        type: 'forum',
        participants: 45,
        maxParticipants: 100,
        status: 'upcoming',
      },
      {
        id: 2,
        title: 'Workshop Développement Web',
        description: 'Apprenez les bases du développement web',
        date: '2024-03-15T14:00:00',
        location: 'Salle 101',
        type: 'workshop',
        participants: 20,
        maxParticipants: 25,
        status: 'registered',
      },
    ];
    setEvents(mockEvents);
  }, []);

  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setFeedback('');
  };

  const handleSubmitFeedback = () => {
    // TODO: Implémenter l'envoi du feedback
    handleCloseDialog();
  };

  const getEventTypeChip = (type) => {
    const typeConfig = {
      forum: { color: 'primary', label: 'Forum' },
      workshop: { color: 'secondary', label: 'Workshop' },
      conference: { color: 'success', label: 'Conférence' },
    };

    const config = typeConfig[type] || typeConfig.forum;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      upcoming: { color: 'info', label: 'À venir' },
      registered: { color: 'success', label: 'Inscrit' },
      completed: { color: 'default', label: 'Terminé' },
    };

    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Événements
      </Typography>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EventIcon color="primary" />
                  <Typography variant="h6">
                    {event.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(event.date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2">
                      {event.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon fontSize="small" />
                    <Typography variant="body2">
                      {event.participants}/{event.maxParticipants} participants
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {getEventTypeChip(event.type)}
                  {getStatusChip(event.status)}
                </Box>
              </CardContent>
              
              <CardActions>
                {event.status === 'upcoming' && (
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                  >
                    S'inscrire
                  </Button>
                )}
                {event.status === 'registered' && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleOpenDialog(event)}
                  >
                    Donner un retour
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Donner un retour sur l'événement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Votre retour"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmitFeedback} variant="contained">
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Events; 