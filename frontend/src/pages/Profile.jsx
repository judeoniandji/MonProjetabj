import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    education: [],
    experience: [],
    skills: []
  });

  // Simuler le chargement des données du profil
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      const mockProfile = {
        name: user?.name || 'Jean Dupont',
        email: user?.email || 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France',
        bio: 'Étudiant passionné par le développement web et l\'intelligence artificielle. Je recherche actuellement un stage de fin d\'études dans ces domaines.',
        website: 'www.jeandupont.fr',
        education: [
          {
            id: 1,
            institution: 'Université Paris-Saclay',
            degree: 'Master en Informatique',
            field: 'Intelligence Artificielle',
            startDate: '2023',
            endDate: '2025',
            description: 'Spécialisation en apprentissage automatique et traitement du langage naturel.'
          },
          {
            id: 2,
            institution: 'Université de Lyon',
            degree: 'Licence en Informatique',
            field: 'Développement logiciel',
            startDate: '2020',
            endDate: '2023',
            description: 'Formation généraliste en informatique avec un accent sur le développement logiciel.'
          }
        ],
        experience: [
          {
            id: 1,
            company: 'TechCorp',
            position: 'Stagiaire développeur web',
            startDate: 'Juin 2023',
            endDate: 'Août 2023',
            description: 'Développement d\'une application web avec React et Node.js. Mise en place d\'une API RESTful et intégration avec une base de données MongoDB.'
          },
          {
            id: 2,
            company: 'DataAnalytics',
            position: 'Projet étudiant',
            startDate: 'Janvier 2023',
            endDate: 'Mai 2023',
            description: 'Projet de groupe sur l\'analyse de données massives. Utilisation de Python, Pandas et scikit-learn pour l\'analyse prédictive.'
          }
        ],
        skills: [
          { id: 1, name: 'JavaScript', level: 4 },
          { id: 2, name: 'React', level: 4 },
          { id: 3, name: 'Node.js', level: 3 },
          { id: 4, name: 'Python', level: 4 },
          { id: 5, name: 'Machine Learning', level: 3 },
          { id: 6, name: 'SQL', level: 3 },
          { id: 7, name: 'Git', level: 4 },
          { id: 8, name: 'HTML/CSS', level: 5 }
        ]
      };
      
      setProfileData(mockProfile);
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    setLoading(true);
    // Simuler un appel API pour sauvegarder les données
    setTimeout(() => {
      setEditMode(false);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Rendu des étoiles pour le niveau de compétence
  const renderSkillLevel = (level) => {
    return Array(5).fill().map((_, index) => (
      <StarIcon 
        key={index} 
        fontSize="small" 
        sx={{ color: index < level ? 'gold' : 'grey.300' }} 
      />
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profil
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ width: 100, height: 100, mr: 3, bgcolor: 'primary.main' }}
                >
                  {profileData.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user?.user_type === 'student' ? 'Étudiant' : 
                     user?.user_type === 'company' ? 'Entreprise' : 
                     user?.user_type === 'university' ? 'Université' : 
                     user?.user_type === 'mentor' ? 'Mentor' : 'Utilisateur'}
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                onClick={editMode ? handleSaveProfile : handleEditToggle}
              >
                {editMode ? 'Enregistrer' : 'Modifier'}
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Informations personnelles
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">
                            {profileData.email}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Téléphone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">
                            {profileData.phone}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Localisation"
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">
                            {profileData.location}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {editMode ? (
                          <TextField
                            fullWidth
                            label="Site web"
                            name="website"
                            value={profileData.website}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">
                            {profileData.website}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    À propos
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Biographie"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  ) : (
                    <Typography variant="body1" paragraph>
                      {profileData.bio}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Compétences" />
                <Tab label="Formation" />
                <Tab label="Expérience" />
              </Tabs>
            </Box>
            
            {/* Onglet Compétences */}
            {tabValue === 0 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Compétences
                  </Typography>
                  {editMode && (
                    <Button variant="outlined" size="small">
                      Ajouter une compétence
                    </Button>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  {profileData.skills.map(skill => (
                    <Grid item xs={12} sm={6} md={4} key={skill.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {skill.name}
                            </Typography>
                            <Box>
                              {renderSkillLevel(skill.level)}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
            
            {/* Onglet Formation */}
            {tabValue === 1 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Formation
                  </Typography>
                  {editMode && (
                    <Button variant="outlined" size="small">
                      Ajouter une formation
                    </Button>
                  )}
                </Box>
                
                {profileData.education.map(edu => (
                  <Card key={edu.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6">
                            {edu.degree}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            {edu.institution}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {edu.field} | {edu.startDate} - {edu.endDate}
                          </Typography>
                          <Typography variant="body2">
                            {edu.description}
                          </Typography>
                        </Box>
                        {editMode && (
                          <Button size="small" startIcon={<EditIcon />}>
                            Modifier
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
            
            {/* Onglet Expérience */}
            {tabValue === 2 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Expérience professionnelle
                  </Typography>
                  {editMode && (
                    <Button variant="outlined" size="small">
                      Ajouter une expérience
                    </Button>
                  )}
                </Box>
                
                {profileData.experience.map(exp => (
                  <Card key={exp.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6">
                            {exp.position}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            {exp.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {exp.startDate} - {exp.endDate}
                          </Typography>
                          <Typography variant="body2">
                            {exp.description}
                          </Typography>
                        </Box>
                        {editMode && (
                          <Button size="small" startIcon={<EditIcon />}>
                            Modifier
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Profile;
