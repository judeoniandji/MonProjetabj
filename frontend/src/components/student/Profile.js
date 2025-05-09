import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Profile() {
  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    school: 'École Supérieure de Technologie',
    level: 'Master 2',
    major: 'Développement Web',
    bio: 'Passionné par le développement web et les nouvelles technologies.',
    skills: ['React', 'Node.js', 'Python', 'SQL'],
    languages: [
      { name: 'Français', level: 'Natif' },
      { name: 'Anglais', level: 'C1' },
    ],
    experiences: [
      {
        id: 1,
        title: 'Stage Développeur Frontend',
        company: 'TechCorp',
        period: 'Juin 2023 - Août 2023',
        description: 'Développement d\'applications web avec React et TypeScript',
      },
    ],
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleOpenDialog = (type, data = {}) => {
    setDialogType(type);
    setFormData(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    setFormData({});
  };

  const handleSubmit = () => {
    // TODO: Implémenter la mise à jour du profil
    handleCloseDialog();
  };

  const handleAddSkill = (skill) => {
    setProfile({
      ...profile,
      skills: [...profile.skills, skill],
    });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const renderDialog = () => {
    switch (dialogType) {
      case 'editProfile':
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Modifier le profil</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    value={formData.firstName || profile.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    value={formData.lastName || profile.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    value={formData.bio || profile.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button onClick={handleSubmit} variant="contained">
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
        );
      case 'addExperience':
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Ajouter une expérience</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Titre"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Entreprise"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Période"
                    value={formData.period || ''}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button onClick={handleSubmit} variant="contained">
                Ajouter
              </Button>
            </DialogActions>
          </Dialog>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* En-tête du profil */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                sx={{ width: 120, height: 120 }}
                src="/path/to/avatar.jpg"
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {profile.level} - {profile.major}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {typeof profile.school === 'object' ? profile.school?.name : profile.school}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => handleOpenDialog('editProfile')}
              >
                Modifier le profil
              </Button>
            </Box>
          </Grid>

          {/* Bio */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              À propos
            </Typography>
            <Typography variant="body1" paragraph>
              {profile.bio}
            </Typography>
          </Grid>

          {/* Compétences */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Compétences
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
              <Chip
                icon={<AddIcon />}
                label="Ajouter"
                onClick={() => handleAddSkill('Nouvelle compétence')}
              />
            </Box>
          </Grid>

          {/* Langues */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Langues
            </Typography>
            <List>
              {profile.languages.map((lang) => (
                <ListItem key={lang.name}>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={lang.name}
                    secondary={lang.level}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Expériences */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Expériences
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('addExperience')}
              >
                Ajouter une expérience
              </Button>
            </Box>
            <List>
              {profile.experiences.map((exp) => (
                <ListItem key={exp.id}>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={exp.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {exp.company}
                        </Typography>
                        {' • '}
                        <Typography component="span" variant="body2">
                          {exp.period}
                        </Typography>
                      </>
                    }
                  />
                  <IconButton size="small" onClick={() => handleOpenDialog('editExperience', exp)}>
                    <EditIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      {renderDialog()}
    </Container>
  );
}

export default Profile; 