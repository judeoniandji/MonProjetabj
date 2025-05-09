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
} from '@mui/material';
import {
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des candidatures
    const mockApplications = [
      {
        id: 1,
        jobTitle: 'Développeur Full Stack',
        company: 'TechCorp',
        status: 'pending',
        date: '2024-03-01',
      },
      {
        id: 2,
        jobTitle: 'Stage Développeur Frontend',
        company: 'WebAgency',
        status: 'accepted',
        date: '2024-02-28',
      },
    ];
    setApplications(mockApplications);
  }, []);

  const handleStatusChange = (applicationId, newStatus) => {
    // TODO: Implémenter la mise à jour du statut
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const handleOpenDialog = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
    setFeedback('');
  };

  const handleSubmitFeedback = () => {
    // TODO: Implémenter l'envoi du feedback
    handleCloseDialog();
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'En attente', icon: <ScheduleIcon /> },
      accepted: { color: 'success', label: 'Acceptée', icon: <CheckCircleIcon /> },
      rejected: { color: 'error', label: 'Refusée', icon: <CancelIcon /> },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mes Candidatures
        </Typography>
        
        <List>
          {applications.map((application) => (
            <ListItem
              key={application.id}
              divider
              sx={{
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon color="primary" />
                    <Typography variant="subtitle1">
                      {application.jobTitle}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {application.company}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Postulé le {new Date(application.date).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {getStatusChip(application.status)}
                  {application.status === 'accepted' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(application)}
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
        <DialogTitle>Donner un retour sur l'expérience</DialogTitle>
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

export default Applications; 