import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MentorshipRequestsList from './MentorshipRequestsList';
import ActiveMentorships from './ActiveMentorships';
import ScheduleSessionForm from './ScheduleSessionForm';
import FindMentorComponent from './FindMentorComponent';
import AIMatchmakingComponent from './AIMatchmakingComponent';
import mentorshipService from '../../services/mentorshipService';

// Composant pour le tableau de bord de mentorat
const MentorshipDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isMentor = user?.user_type === 'mentor';
  
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleDialog, setScheduleDialog] = useState({
    open: false,
    mentorship: null
  });
  
  // Charger les statistiques de mentorat
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // En production, utiliser cette ligne pour récupérer les données réelles
        // const data = await mentorshipService.getMentorshipStats();
        
        // Pour le développement, utiliser des données simulées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées pour les statistiques
        const mockStats = {
          active_mentorships: isMentor ? 5 : 2,
          pending_requests: isMentor ? 3 : 1,
          upcoming_sessions: 2,
          completed_sessions: 8,
          total_hours: 12,
          recent_activity: [
            {
              id: 'activity-1',
              type: 'session_scheduled',
              date: '2025-04-05T10:30:00',
              user: {
                id: isMentor ? 'student-1' : 'mentor-1',
                name: isMentor ? 'Fatou Ndiaye' : 'Amadou Diop'
              },
              details: {
                session_date: '2025-04-10T14:00:00',
                topic: 'Développement de carrière'
              }
            },
            {
              id: 'activity-2',
              type: 'request_received',
              date: '2025-04-03T15:45:00',
              user: {
                id: isMentor ? 'student-2' : 'mentor-2',
                name: isMentor ? 'Omar Fall' : 'Mariama Sow'
              },
              details: {
                status: 'pending'
              }
            }
          ]
        };
        
        setStats(mockStats);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques de mentorat:', err);
        setError('Impossible de charger les statistiques de mentorat. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user, isMentor]);
  
  // Gestionnaire pour le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Ouvrir la boîte de dialogue pour planifier une session
  const handleOpenScheduleDialog = (mentorship) => {
    setScheduleDialog({
      open: true,
      mentorship
    });
  };
  
  // Fermer la boîte de dialogue pour planifier une session
  const handleCloseScheduleDialog = () => {
    setScheduleDialog({
      ...scheduleDialog,
      open: false
    });
  };
  
  // Gestionnaire pour la planification d'une session
  const handleSessionScheduled = (session) => {
    // Mettre à jour les statistiques
    if (stats) {
      setStats({
        ...stats,
        upcoming_sessions: stats.upcoming_sessions + 1
      });
    }
  };
  
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
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('fr-FR', options);
  };
  
  // Rendu du tableau de bord
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* En-tête du tableau de bord */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h1">
              Tableau de bord de mentorat
            </Typography>
          </Box>
          <Divider />
        </Grid>
        
        {/* Cartes de statistiques */}
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Relations de mentorat actives
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats?.active_mentorships || 0}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {isMentor ? 'Demandes en attente' : 'Demandes envoyées'}
                </Typography>
                <Typography variant="h4" color="secondary">
                  {stats?.pending_requests || 0}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sessions à venir
                </Typography>
                <Typography variant="h4" style={{ color: theme.palette.success.main }}>
                  {stats?.upcoming_sessions || 0}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Heures de mentorat
                </Typography>
                <Typography variant="h4" style={{ color: theme.palette.info.main }}>
                  {stats?.total_hours || 0}
                </Typography>
              </Paper>
            </Grid>
          </>
        )}
        
        {/* Onglets */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile ? 'auto' : false}
            >
              <Tab 
                icon={<DashboardIcon />} 
                label="Aperçu" 
                iconPosition="start"
              />
              <Tab 
                icon={<PeopleIcon />} 
                label={isMentor ? "Demandes" : "Trouver un mentor"} 
                iconPosition="start"
              />
              <Tab 
                icon={<EventIcon />} 
                label="Relations actives" 
                iconPosition="start"
              />
              <Tab 
                icon={<SearchIcon />} 
                label="Matchmaking IA" 
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Grid>
        
        {/* Contenu des onglets */}
        <Grid item xs={12}>
          {/* Onglet Aperçu */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Activité récente
              </Typography>
              
              {stats?.recent_activity?.length > 0 ? (
                <Grid container spacing={2}>
                  {stats.recent_activity.map((activity) => (
                    <Grid item xs={12} md={6} key={activity.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                              {activity.type === 'session_scheduled' ? <EventIcon /> : <MessageIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                {activity.type === 'session_scheduled' 
                                  ? 'Session planifiée' 
                                  : 'Nouvelle demande de mentorat'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDateTime(activity.date)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" paragraph>
                            {activity.type === 'session_scheduled' 
                              ? `Session planifiée avec ${activity.user.name} le ${formatDateTime(activity.details.session_date)}` 
                              : `${activity.user.name} vous a envoyé une demande de mentorat`}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={activity.type === 'session_scheduled' 
                                ? 'Session' 
                                : 'Demande'}
                              color={activity.type === 'session_scheduled' 
                                ? 'success' 
                                : 'primary'}
                              size="small"
                            />
                            {activity.type === 'session_scheduled' && (
                              <Chip 
                                label={activity.details.topic} 
                                variant="outlined" 
                                size="small" 
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  Aucune activité récente à afficher.
                </Alert>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Actions rapides
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EventIcon />}
                      onClick={() => setTabValue(2)}
                    >
                      Voir mes relations de mentorat
                    </Button>
                  </Grid>
                  
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={isMentor ? <PeopleIcon /> : <SearchIcon />}
                      onClick={() => setTabValue(1)}
                    >
                      {isMentor ? 'Gérer les demandes' : 'Trouver un mentor'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
          
          {/* Onglet Demandes / Trouver un mentor */}
          {tabValue === 1 && (
            isMentor ? <MentorshipRequestsList /> : <FindMentorComponent />
          )}
          
          {/* Onglet Relations actives */}
          {tabValue === 2 && (
            <ActiveMentorships onScheduleSession={handleOpenScheduleDialog} />
          )}
          
          {/* Onglet Matchmaking IA */}
          {tabValue === 3 && (
            <AIMatchmakingComponent />
          )}
        </Grid>
      </Grid>
      
      {/* Boîte de dialogue pour planifier une session */}
      <Dialog
        open={scheduleDialog.open}
        onClose={handleCloseScheduleDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Planifier une session de mentorat
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseScheduleDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ScheduleSessionForm 
            mentorship={scheduleDialog.mentorship}
            onSuccess={(session) => {
              handleSessionScheduled(session);
              handleCloseScheduleDialog();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MentorshipDashboard;
