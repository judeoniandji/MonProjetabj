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
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des candidatures
    const mockApplications = [
      {
        id: 1,
        jobTitle: 'Développeur Full Stack',
        candidate: {
          name: 'Marie Martin',
          school: 'École Supérieure de Technologie',
          level: 'Master 2',
          email: 'marie.martin@example.com',
          phone: '+33 6 12 34 56 78',
          avatar: '/path/to/avatar1.jpg',
        },
        status: 'pending',
        date: '2024-03-01',
        skills: ['React', 'Node.js', 'Python'],
        coverLetter: 'Je suis très intéressé par ce poste...',
      },
      {
        id: 2,
        jobTitle: 'Stage Développeur Frontend',
        candidate: {
          name: 'Pierre Dubois',
          school: 'Institut de Technologie',
          level: 'Licence 3',
          email: 'pierre.dubois@example.com',
          phone: '+33 6 98 76 54 32',
          avatar: '/path/to/avatar2.jpg',
        },
        status: 'accepted',
        date: '2024-02-28',
        skills: ['React', 'TypeScript', 'CSS'],
        coverLetter: 'Je souhaite effectuer un stage dans votre entreprise...',
      },
    ];
    setApplications(mockApplications);
  }, []);

  const handleOpenDialog = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
    setFeedback('');
  };

  const handleMenuClick = (event, application) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplication(null);
  };

  const handleStatusChange = (newStatus) => {
    // TODO: Implémenter la mise à jour du statut
    setApplications(applications.map(app =>
      app.id === selectedApplication.id ? { ...app, status: newStatus } : app
    ));
    handleMenuClose();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Candidatures
      </Typography>

      <Grid container spacing={3}>
        {applications.map((application) => (
          <Grid item xs={12} key={application.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {application.jobTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Postulé le {formatDate(application.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusChip(application.status)}
                    <IconButton onClick={(e) => handleMenuClick(e, application)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={application.candidate.avatar} />
                    <Box>
                      <Typography variant="subtitle1">
                        {application.candidate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {application.candidate.school} - {application.candidate.level}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {application.candidate.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {application.candidate.phone}
                  </Typography>
                </Box>

                <Typography variant="body2" paragraph>
                  {application.coverLetter}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {application.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<EmailIcon />}
                >
                  Contacter
                </Button>
                {application.status === 'accepted' && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenDialog(application)}
                  >
                    Donner un retour
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('accepted')}>
          <CheckCircleIcon sx={{ mr: 1 }} /> Accepter
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('rejected')}>
          <CancelIcon sx={{ mr: 1 }} /> Refuser
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Donner un retour sur la candidature</DialogTitle>
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