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
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Students() {
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [note, setNote] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des étudiants
    const mockStudents = [
      {
        id: 1,
        name: 'Marie Martin',
        school: 'École Supérieure de Technologie',
        level: 'Master 2',
        email: 'marie.martin@example.com',
        phone: '+33 6 12 34 56 78',
        avatar: '/path/to/avatar1.jpg',
        status: 'active',
        progress: 75,
        lastSession: '2024-03-01',
        nextSession: '2024-03-15',
        goals: ['Trouver un stage', 'Développer ses compétences en React'],
        notes: [
          {
            id: 1,
            date: '2024-02-28',
            content: 'Très motivée, bonne progression',
          },
        ],
      },
      {
        id: 2,
        name: 'Pierre Dubois',
        school: 'Institut de Technologie',
        level: 'Licence 3',
        email: 'pierre.dubois@example.com',
        phone: '+33 6 98 76 54 32',
        avatar: '/path/to/avatar2.jpg',
        status: 'active',
        progress: 60,
        lastSession: '2024-02-28',
        nextSession: '2024-03-10',
        goals: ['Préparer les entretiens', 'Améliorer son portfolio'],
        notes: [
          {
            id: 2,
            date: '2024-02-25',
            content: 'Besoin de plus de confiance en soi',
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
        Mes Étudiants
      </Typography>

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
                        {student.school} - {student.level}
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

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Objectifs
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {student.goals.map((goal) => (
                      <Chip
                        key={goal}
                        label={goal}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Prochaines sessions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Dernière : {formatDate(student.lastSession)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prochaine : {formatDate(student.nextSession)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes récentes
                  </Typography>
                  <List>
                    {student.notes.map((note) => (
                      <ListItem key={note.id}>
                        <ListItemText
                          primary={note.content}
                          secondary={formatDate(note.date)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<VideoCallIcon />}
                >
                  Planifier une session
                </Button>
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
        <MenuItem onClick={() => {
          handleOpenDialog(selectedStudent);
          handleMenuClose();
        }}>
          <CalendarIcon sx={{ mr: 1 }} /> Planifier une session
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <MessageIcon sx={{ mr: 1 }} /> Envoyer un message
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