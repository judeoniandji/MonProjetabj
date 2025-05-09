import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Message as MessageIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mentorshipService from '../../services/mentorshipService';

const ActiveMentorships = ({ userType }) => {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        setLoading(true);
        
        // En production, utiliser cette ligne pour récupérer les données réelles
        // const data = await mentorshipService.getActiveMentorships();
        
        // Pour le développement, utiliser des données simulées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées pour les relations de mentorat
        const mockMentorships = [
          {
            id: 'mentorship-1',
            mentor: {
              id: 'mentor-1',
              name: 'Amadou Diop',
              avatar: '',
              title: 'Développeur Senior',
              company: 'TechSenegal'
            },
            student: {
              id: 'student-1',
              name: 'Fatou Ndiaye',
              avatar: '',
              university: 'Université Cheikh Anta Diop',
              field: 'Informatique'
            },
            start_date: '2025-02-15',
            end_date: '2025-08-15',
            status: 'active',
            next_session: {
              id: 'session-1',
              date: '2025-04-10T14:00:00',
              duration: 60,
              topic: 'Développement de carrière'
            },
            sessions_count: 5,
            completed_sessions: 3,
            domains: ['Développement Web', 'Intelligence Artificielle'],
            last_activity: '2025-04-01T09:30:00'
          },
          {
            id: 'mentorship-2',
            mentor: {
              id: 'mentor-2',
              name: 'Mariama Sow',
              avatar: '',
              title: 'Chef de Projet Digital',
              company: 'Digital Africa'
            },
            student: {
              id: 'student-2',
              name: 'Omar Fall',
              avatar: '',
              university: 'École Supérieure Polytechnique',
              field: 'Génie Logiciel'
            },
            start_date: '2025-03-01',
            end_date: '2025-06-01',
            status: 'active',
            next_session: {
              id: 'session-2',
              date: '2025-04-08T16:00:00',
              duration: 45,
              topic: 'Gestion de projet agile'
            },
            sessions_count: 3,
            completed_sessions: 2,
            domains: ['Gestion de Projet', 'Marketing Digital'],
            last_activity: '2025-03-28T15:45:00'
          }
        ];
        
        setMentorships(mockMentorships);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des relations de mentorat:', err);
        setError('Impossible de charger les relations de mentorat. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentorships();
  }, []);

  // Formater la date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Formater la date et l'heure
  const formatDateTime = (dateTimeString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('fr-FR', options);
  };
  
  // Calculer le temps restant avant la prochaine session
  const getTimeUntilNextSession = (dateTimeString) => {
    const now = new Date();
    const sessionDate = new Date(dateTimeString);
    const diffTime = sessionDate - now;
    
    if (diffTime <= 0) {
      return 'Maintenant';
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return `Dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (mentorships.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {userType === 'student' 
          ? 'Vous n\'avez pas encore de relation de mentorat active. Recherchez un mentor pour commencer votre parcours de mentorat.' 
          : 'Vous n\'avez pas encore de mentorés. Attendez que des étudiants vous envoient des demandes de mentorat.'}
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {mentorships.map((mentorship) => (
          <Grid item xs={12} md={6} key={mentorship.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    src={userType === 'student' ? mentorship.mentor.avatar : mentorship.student.avatar}
                    alt={userType === 'student' ? mentorship.mentor.name : mentorship.student.name}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  >
                    {(userType === 'student' ? mentorship.mentor.name : mentorship.student.name).charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {userType === 'student' ? mentorship.mentor.name : mentorship.student.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userType === 'student' 
                        ? `${mentorship.mentor.title} chez ${mentorship.mentor.company}`
                        : `${mentorship.student.field} - ${mentorship.student.university}`}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {mentorship.domains.map((domain, index) => (
                        <Chip key={index} label={domain} size="small" />
                      ))}
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Grid container spacing={1} sx={{ mb: 1.5 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Début du mentorat
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(mentorship.start_date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fin prévue
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(mentorship.end_date)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Grid container spacing={1} sx={{ mb: 1.5 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Sessions complétées
                    </Typography>
                    <Typography variant="body2">
                      {mentorship.completed_sessions} / {mentorship.sessions_count}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Dernière activité
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(mentorship.last_activity)}
                    </Typography>
                  </Grid>
                </Grid>
                
                {mentorship.next_session && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Prochaine session
                    </Typography>
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: 'primary.light', 
                      color: 'primary.contrastText',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {mentorship.next_session.topic}
                        </Typography>
                        <Typography variant="body2">
                          {formatDateTime(mentorship.next_session.date)} ({mentorship.next_session.duration} min)
                        </Typography>
                      </Box>
                      <Chip 
                        label={getTimeUntilNextSession(mentorship.next_session.date)} 
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<MessageIcon />}
                  component={Link}
                  to={`/messages?contact=${userType === 'student' ? mentorship.mentor.id : mentorship.student.id}`}
                >
                  Message
                </Button>
                <Button 
                  size="small" 
                  startIcon={<EventIcon />}
                  component={Link}
                  to={`/mentorship/${mentorship.id}/sessions`}
                >
                  Sessions
                </Button>
                <Button 
                  size="small" 
                  startIcon={<InfoIcon />}
                  component={Link}
                  to={`/mentorship/${mentorship.id}`}
                >
                  Détails
                </Button>
                {mentorship.next_session && new Date(mentorship.next_session.date) <= new Date(Date.now() + 15 * 60 * 1000) && (
                  <Tooltip title="Rejoindre la session vidéo">
                    <IconButton 
                      color="primary"
                      component={Link}
                      to={`/mentorship/session/${mentorship.next_session.id}/join`}
                    >
                      <VideoCallIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveMentorships;
