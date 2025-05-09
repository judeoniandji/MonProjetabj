import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Importer le composant de tableau de bord de mentorat
import MentorshipDashboard from '../mentorship/MentorshipDashboard';

// Composant pour afficher les statistiques
const StatCard = ({ icon, title, value, color }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          bgcolor: `${color}.light`, 
          color: `${color}.main`,
          p: 1,
          borderRadius: 1,
          mr: 2
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" align="center" sx={{ fontWeight: 'bold', mt: 2 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

// Composant pour afficher une offre d'emploi/stage
const JobCard = ({ job, onApply }) => (
  <Card elevation={2} sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src={job.company_logo} 
          alt={job.company_name}
          sx={{ width: 50, height: 50, mr: 2 }}
        >
          {!job.company_logo && job.company_name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" component="div">
            {job.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.company_name} • {job.location}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip 
          label={job.type === 'internship' ? 'Stage' : 'Emploi'} 
          color={job.type === 'internship' ? 'info' : 'primary'} 
          size="small" 
        />
        <Chip label={job.duration} size="small" />
        {job.remote && <Chip label="Télétravail" size="small" />}
        {job.tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" variant="outlined" />
        ))}
      </Box>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        endIcon={<ArrowForwardIcon />}
        onClick={() => onApply(job.id)}
      >
        Voir l'offre
      </Button>
      {job.deadline && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
          Date limite: {new Date(job.deadline).toLocaleDateString()}
        </Typography>
      )}
    </CardActions>
  </Card>
);

// Composant pour afficher un événement
const EventCard = ({ event, onView }) => (
  <Card elevation={2} sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Box 
          sx={{ 
            minWidth: 60, 
            textAlign: 'center', 
            p: 1, 
            bgcolor: 'primary.light', 
            color: 'white',
            borderRadius: 1,
            mr: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" component="div">
            {new Date(event.date).getDate()}
          </Typography>
          <Typography variant="caption">
            {new Date(event.date).toLocaleString('default', { month: 'short' })}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" component="div">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.organizer} • {event.location || 'En ligne'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        {event.description.length > 120 
          ? `${event.description.substring(0, 120)}...` 
          : event.description}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip 
          label={`${event.participants_count} participants`} 
          size="small" 
          sx={{ mr: 1 }}
        />
        {event.tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" variant="outlined" sx={{ mr: 1 }} />
        ))}
      </Box>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        endIcon={<ArrowForwardIcon />}
        onClick={() => onView(event.id)}
      >
        Voir l'événement
      </Button>
      {event.registered ? (
        <Chip 
          label="Inscrit" 
          color="success" 
          size="small" 
          icon={<CheckCircleIcon />} 
          sx={{ ml: 'auto' }}
        />
      ) : (
        <Button 
          size="small" 
          variant="outlined" 
          color="primary" 
          sx={{ ml: 'auto' }}
          onClick={() => onView(event.id, true)}
        >
          S'inscrire
        </Button>
      )}
    </CardActions>
  </Card>
);

// Composant pour afficher une candidature
const ApplicationItem = ({ application }) => {
  // Calculer le statut de la candidature
  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending':
        return { 
          label: 'En attente', 
          color: 'warning',
          progress: 25,
          icon: <ScheduleIcon fontSize="small" />
        };
      case 'reviewing':
        return { 
          label: 'En cours d\'examen', 
          color: 'info',
          progress: 50,
          icon: <ScheduleIcon fontSize="small" />
        };
      case 'interview':
        return { 
          label: 'Entretien', 
          color: 'primary',
          progress: 75,
          icon: <CalendarTodayIcon fontSize="small" />
        };
      case 'accepted':
        return { 
          label: 'Acceptée', 
          color: 'success',
          progress: 100,
          icon: <CheckCircleIcon fontSize="small" />
        };
      case 'rejected':
        return { 
          label: 'Refusée', 
          color: 'error',
          progress: 100,
          icon: <CheckCircleIcon fontSize="small" />
        };
      default:
        return { 
          label: 'Inconnue', 
          color: 'default',
          progress: 0,
          icon: <ScheduleIcon fontSize="small" />
        };
    }
  };
  
  const statusInfo = getStatusInfo(application.status);
  
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar 
          src={application.company_logo} 
          alt={application.company_name}
        >
          {!application.company_logo && application.company_name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              {application.job_title}
            </Typography>
            <Chip 
              label={statusInfo.label} 
              color={statusInfo.color} 
              size="small" 
              icon={statusInfo.icon}
            />
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2" component="span" color="text.primary">
              {application.company_name}
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary">
              Candidature envoyée le {new Date(application.applied_date).toLocaleDateString()}
            </Typography>
            <Box sx={{ mt: 1, mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={statusInfo.progress} 
                color={statusInfo.color}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="voir">
          <ArrowForwardIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// Composant pour afficher les relations de mentorat
const MentorshipCard = ({ mentorship }) => (
  <Card elevation={2} sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src={mentorship.mentor_avatar} 
          alt={mentorship.mentor_name}
          sx={{ width: 50, height: 50, mr: 2 }}
        >
          {!mentorship.mentor_avatar && mentorship.mentor_name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" component="div">
            {mentorship.mentor_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mentorship.mentor_position} • {mentorship.mentor_company}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        {mentorship.description.length > 150 
          ? `${mentorship.description.substring(0, 150)}...` 
          : mentorship.description}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip 
          label={mentorship.status} 
          color={
            mentorship.status === 'active' ? 'success' : 
            mentorship.status === 'pending' ? 'warning' : 
            'error'
          } 
          size="small" 
        />
        {mentorship.tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" variant="outlined" />
        ))}
      </Box>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        endIcon={<ArrowForwardIcon />}
      >
        Voir le profil
      </Button>
    </CardActions>
  </Card>
);

// Composant pour le tableau de bord de l'étudiant
const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Gestionnaire pour le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Rendu du tableau de bord
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* En-tête du tableau de bord */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Bienvenue, {user?.name || 'Étudiant'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate('/student/profile')}
            >
              Modifier mon profil
            </Button>
          </Box>
          <Divider />
        </Grid>
        
        {/* Onglets principaux */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Tableau de bord" />
              <Tab label="Mentorat" />
              <Tab label="Emplois & Stages" />
            </Tabs>
          </Paper>
        </Grid>
        
        {/* Contenu des onglets */}
        <Grid item xs={12}>
          {/* Onglet Tableau de bord général */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Votre activité récente
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Événements à venir
                    </Typography>
                    <Alert severity="info">
                      Consultez l'onglet Mentorat pour voir vos sessions de mentorat planifiées.
                    </Alert>
                  </Paper>
                  
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Offres recommandées
                    </Typography>
                    <Alert severity="info">
                      Consultez l'onglet Emplois & Stages pour voir les offres disponibles.
                    </Alert>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Statistiques
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Profil complété
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ mt: 1, mb: 0.5 }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        75% - Complétez votre profil pour augmenter vos chances
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Candidatures envoyées
                      </Typography>
                      <Typography variant="h5">
                        3
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Sessions de mentorat
                      </Typography>
                      <Typography variant="h5">
                        2
                      </Typography>
                    </Box>
                  </Paper>
                  
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Notifications
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <MessageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Nouveau message"
                          secondary="Vous avez reçu un message de votre mentor"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <CheckCircleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Candidature acceptée"
                          secondary="Votre candidature a été retenue pour un entretien"
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Onglet Mentorat */}
          {activeTab === 1 && (
            <MentorshipDashboard />
          )}
          
          {/* Onglet Emplois & Stages */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Offres d'emploi et de stage
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Consultez les offres disponibles et postulez directement depuis la plateforme.
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/jobs')}
                sx={{ mb: 3 }}
              >
                Voir toutes les offres
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
