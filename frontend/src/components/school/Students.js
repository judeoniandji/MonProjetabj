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
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Students() {
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [note, setNote] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des étudiants
    const mockStudents = [
      {
        id: 1,
        name: 'Marie Martin',
        level: 'Master 2',
        email: 'marie.martin@example.com',
        phone: '+33 6 12 34 56 78',
        avatar: '/path/to/avatar1.jpg',
        status: 'active',
        progress: 75,
        internship: {
          company: 'TechCorp',
          position: 'Développeur Frontend',
          startDate: '2024-03-01',
          endDate: '2024-08-31',
        },
        applications: [
          {
            id: 1,
            company: 'WebAgency',
            position: 'Stage Développeur Full Stack',
            status: 'pending',
            date: '2024-02-28',
          },
        ],
      },
      {
        id: 2,
        name: 'Pierre Dubois',
        level: 'Licence 3',
        email: 'pierre.dubois@example.com',
        phone: '+33 6 98 76 54 32',
        avatar: '/path/to/avatar2.jpg',
        status: 'active',
        progress: 60,
        internship: null,
        applications: [
          {
            id: 2,
            company: 'Digital Solutions',
            position: 'Stage Développeur Backend',
            status: 'accepted',
            date: '2024-02-25',
          },
        ],
      },
    ];
    setStudents(mockStudents);
  }, []);

  const handleOpenDialog = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setNote('');
  };

  const handleMenuClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleAddNote = () => {
    // TODO: Implémenter l'ajout de note
    handleCloseDialog();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'En attente' },
      accepted: { color: 'success', label: 'Acceptée' },
      rejected: { color: 'error', label: 'Refusée' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Gestion des étudiants
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Tous les étudiants" />
          <Tab label="En stage" />
          <Tab label="En recherche" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} key={student.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={student.avatar}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.level}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={(e) => handleMenuClick(e, student)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {student.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {student.phone}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progression
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={student.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {student.internship && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Stage en cours
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" />
                      <Typography variant="body2">
                        {student.internship.company} - {student.internship.position}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Du {formatDate(student.internship.startDate)} au {formatDate(student.internship.endDate)}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Candidatures récentes
                  </Typography>
                  <List>
                    {student.applications.map((application) => (
                      <ListItem key={application.id}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {application.company} - {application.position}
                              </Typography>
                              {getStatusChip(application.status)}
                            </Box>
                          }
                          secondary={formatDate(application.date)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<MessageIcon />}
                >
                  Message
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenDialog(student)}
                >
                  Ajouter une note
                </Button>
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
        <MenuItem onClick={handleMenuClose}>
          <MessageIcon sx={{ mr: 1 }} /> Envoyer un message
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDialog(selectedStudent);
          handleMenuClose();
        }}>
          <SchoolIcon sx={{ mr: 1 }} /> Voir le profil complet
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddNote} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Students; 