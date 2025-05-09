import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Edit as EditIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';

function Profile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(profile)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Colonne de gauche */}
        <Grid item xs={12} md={8}>
          {/* En-tête du profil */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={profile?.avatar_url}
                sx={{ width: 120, height: 120, mr: 3 }}
              >
                {profile?.name?.[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {profile?.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {profile?.title}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ mr: 1 }}
                  >
                    Modifier le profil
                  </Button>
                  <Button variant="outlined">
                    Paramètres
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* À propos */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              À propos
            </Typography>
            <Typography variant="body1" paragraph>
              {profile?.about}
            </Typography>
          </Paper>

          {/* Compétences */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Compétences
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile?.skills?.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>

          {/* Expérience */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Expérience
            </Typography>
            <List>
              {profile?.experience?.map((exp, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={exp.title}
                      secondary={
                        <>
                          {exp.company} • {exp.period}
                          <br />
                          {exp.description}
                        </>
                      }
                    />
                  </ListItem>
                  {index < profile.experience.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Formation */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Formation
            </Typography>
            <List>
              {profile?.education?.map((edu, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={edu.degree}
                      secondary={
                        <>
                          {edu.school} • {edu.period}
                          <br />
                          {edu.description}
                        </>
                      }
                    />
                  </ListItem>
                  {index < profile.education.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Colonne de droite */}
        <Grid item xs={12} md={4}>
          {/* Badges */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Badges
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile?.badges?.map((badge) => (
                <Chip
                  key={badge}
                  label={badge}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>

          {/* Statistiques */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Candidatures"
                  secondary={profile?.stats?.applications || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Événements suivis"
                  secondary={profile?.stats?.events_attended || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Connexions"
                  secondary={profile?.stats?.connections || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Note"
                  secondary={`${profile?.stats?.rating || 0}/5`}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Liens externes */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Liens externes
            </Typography>
            <List>
              {profile?.linkedin && (
                <ListItem>
                  <ListItemIcon>
                    <LinkedInIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="LinkedIn"
                    secondary={profile.linkedin}
                  />
                </ListItem>
              )}
              {profile?.github && (
                <ListItem>
                  <ListItemIcon>
                    <GitHubIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="GitHub"
                    secondary={profile.github}
                  />
                </ListItem>
              )}
              {profile?.portfolio && (
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Portfolio"
                    secondary={profile.portfolio}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile; 