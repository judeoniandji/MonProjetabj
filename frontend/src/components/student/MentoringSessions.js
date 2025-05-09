import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function MentoringSessions() {
  const [sessions, setSessions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des sessions
    const mockSessions = [
      {
        id: 1,
        mentorName: 'Marie Dupont',
        topic: 'Préparation aux entretiens',
        date: '2024-03-15T14:00:00',
        status: 'scheduled',
        duration: 60,
      },
      {
        id: 2,
        mentorName: 'Jean Martin',
        topic: 'Orientation professionnelle',
        date: '2024-03-10T15:00:00',
        status: 'completed',
        duration: 45,
      },
    ];
    setSessions(mockSessions);
  }, []);

  const handleOpenDialog = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSession(null);
    setFeedback('');
  };

  const handleSubmitFeedback = () => {
    // TODO: Implémenter l'envoi du feedback
    handleCloseDialog();
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      scheduled: { color: 'primary', label: 'Planifiée', icon: <ScheduleIcon /> },
      completed: { color: 'success', label: 'Terminée', icon: <CheckCircleIcon /> },
      cancelled: { color: 'error', label: 'Annulée', icon: <CancelIcon /> },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <Chip
        icon={config.icon}
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mes Sessions de Mentorat
        </Typography>
        
        <List>
          {sessions.map((session) => (
            <ListItem
              key={session.id}
              divider
              sx={{
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" />
                    <Typography variant="subtitle1">
                      {session.topic}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Mentor : {session.mentorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(session.date)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Durée : {session.duration} minutes
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {getStatusChip(session.status)}
                  {session.status === 'scheduled' && (
                    <Button
                      variant="contained"
                      startIcon={<VideoCallIcon />}
                      size="small"
                    >
                      Rejoindre
                    </Button>
                  )}
                  {session.status === 'completed' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(session)}
                    >
                      Donner un retour
                    </Button>
                  )}
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Donner un retour sur la session</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Votre retour sur la session"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Grid>
          </Grid>
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

export default MentoringSessions; 