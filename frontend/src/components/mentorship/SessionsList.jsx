import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Rating,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Notes as NotesIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mentorshipService from '../../services/mentorshipService';
import SessionScheduler from './SessionScheduler';

const SessionsList = ({ mentorshipId }) => {
  const { user } = useSelector(state => state.auth);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [dialogState, setDialogState] = useState({
    open: false,
    type: null, // 'cancel', 'reschedule', 'notes', 'feedback'
    sessionId: null,
    data: {}
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        
        // En production, utiliser cette ligne pour récupérer les données réelles
        // const data = await mentorshipService.getMentoringSessions(mentorshipId);
        
        // Pour le développement, utiliser des données simulées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées pour les sessions de mentorat
        const mockSessions = [
          {
            id: 'session-1',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Dans 3 jours
            duration: 60,
            topic: 'Introduction et définition des objectifs',
            description: 'Première session pour faire connaissance et définir les objectifs du mentorat.',
            location_type: 'video',
            status: 'scheduled',
            video_link: 'https://meet.google.com/abc-defg-hij'
          },
          {
            id: 'session-2',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 7 jours
            duration: 45,
            topic: 'Revue de CV et conseils de carrière',
            description: 'Session pour revoir le CV et discuter des opportunités de carrière.',
            location_type: 'video',
            status: 'completed',
            notes: 'Points à améliorer sur le CV: ajouter plus de détails sur les projets personnels, mettre en avant les compétences techniques. À faire pour la prochaine session: préparer une liste d\'entreprises cibles.',
            feedback: {
              rating: 4.5,
              comment: 'Session très utile, j\'ai reçu des conseils précieux pour améliorer mon CV.'
            }
          },
          {
            id: 'session-3',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 14 jours
            duration: 60,
            topic: 'Technologies web modernes',
            description: 'Discussion sur les frameworks et technologies web actuels.',
            location_type: 'in_person',
            location: 'Café de la Paix, Dakar',
            status: 'completed',
            notes: 'Technologies discutées: React, Vue.js, Node.js, GraphQL. Recommandation de ressources d\'apprentissage.',
            feedback: {
              rating: 5,
              comment: 'Excellente session, très instructive sur les technologies actuelles.'
            }
          },
          {
            id: 'session-4',
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Dans 10 jours
            duration: 90,
            topic: 'Préparation aux entretiens techniques',
            description: 'Session pour préparer les entretiens techniques: questions courantes, exercices pratiques.',
            location_type: 'video',
            status: 'scheduled'
          }
        ];
        
        setSessions(mockSessions);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des sessions de mentorat:', err);
        setError('Impossible de charger les sessions de mentorat. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [mentorshipId]);

  // Gestionnaire pour le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filtrer les sessions selon l'onglet sélectionné
  const filteredSessions = sessions.filter(session => {
    if (tabValue === 0) { // Toutes les sessions
      return true;
    } else if (tabValue === 1) { // Sessions à venir
      return session.status === 'scheduled' && new Date(session.date) > new Date();
    } else if (tabValue === 2) { // Sessions passées
      return session.status === 'completed' || (session.status === 'scheduled' && new Date(session.date) < new Date());
    }
    return true;
  });
  
  // Trier les sessions par date
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Formater la date
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Vérifier si une session est imminente (dans les 15 minutes)
  const isSessionImminent = (dateString) => {
    const sessionDate = new Date(dateString);
    const now = new Date();
    const diffTime = sessionDate - now;
    return diffTime > 0 && diffTime <= 15 * 60 * 1000; // 15 minutes en millisecondes
  };
  
  // Obtenir le statut affiché d'une session
  const getSessionStatusDisplay = (session) => {
    const sessionDate = new Date(session.date);
    const now = new Date();
    
    if (session.status === 'completed') {
      return { label: 'Terminée', color: 'success' };
    } else if (session.status === 'cancelled') {
      return { label: 'Annulée', color: 'error' };
    } else if (sessionDate < now) {
      return { label: 'Passée', color: 'warning' };
    } else if (isSessionImminent(session.date)) {
      return { label: 'Imminente', color: 'error' };
    } else {
      return { label: 'Planifiée', color: 'primary' };
    }
  };
  
  // Obtenir l'icône du type de lieu
  const getLocationIcon = (locationType) => {
    switch (locationType) {
      case 'video':
        return <VideoCallIcon fontSize="small" />;
      case 'phone':
        return <PhoneIcon fontSize="small" />;
      case 'in_person':
        return <LocationIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };
  
  // Obtenir le texte du type de lieu
  const getLocationText = (session) => {
    switch (session.location_type) {
      case 'video':
        return 'Visioconférence';
      case 'phone':
        return 'Appel téléphonique';
      case 'in_person':
        return session.location || 'En personne';
      default:
        return 'Non spécifié';
    }
  };
  
  // Gestionnaire pour ouvrir un dialogue
  const handleOpenDialog = (type, sessionId, initialData = {}) => {
    setDialogState({
      open: true,
      type,
      sessionId,
      data: initialData
    });
  };
  
  // Gestionnaire pour fermer un dialogue
  const handleCloseDialog = () => {
    setDialogState({
      ...dialogState,
      open: false
    });
  };
  
  // Gestionnaire pour mettre à jour les données du dialogue
  const handleDialogDataChange = (e) => {
    const { name, value } = e.target;
    setDialogState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value
      }
    }));
  };
  
  // Gestionnaire pour soumettre l'action du dialogue
  const handleDialogSubmit = async () => {
    try {
      const { type, sessionId, data } = dialogState;
      
      // En production, utiliser ces lignes pour effectuer les actions réelles
      // if (type === 'cancel') {
      //   await mentorshipService.updateSessionStatus(sessionId, 'cancelled', { cancellation_reason: data.reason });
      // } else if (type === 'notes') {
      //   await mentorshipService.addSessionNotes(sessionId, data.notes);
      // } else if (type === 'feedback') {
      //   await mentorshipService.provideFeedback(sessionId, { rating: data.rating, comment: data.comment });
      // }
      
      // Pour le développement, simuler une réponse
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mettre à jour l'état local
      setSessions(prevSessions => {
        return prevSessions.map(session => {
          if (session.id === sessionId) {
            if (type === 'cancel') {
              return { ...session, status: 'cancelled', cancellation_reason: data.reason };
            } else if (type === 'notes') {
              return { ...session, notes: data.notes };
            } else if (type === 'feedback') {
              return { ...session, feedback: { rating: data.rating, comment: data.comment } };
            }
          }
          return session;
        });
      });
      
      // Fermer le dialogue
      handleCloseDialog();
    } catch (err) {
      console.error(`Erreur lors de l'action ${dialogState.type}:`, err);
      // Afficher un message d'erreur (à implémenter selon votre système de notification)
    }
  };
  
  // Gestionnaire pour ajouter une nouvelle session
  const handleSessionAdded = (newSession) => {
    setSessions(prevSessions => [...prevSessions, newSession]);
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Sessions de mentorat</Typography>
        {user && user.type === 'mentor' && (
          <Box sx={{ width: '200px' }}>
            <SessionScheduler 
              mentorshipId={mentorshipId} 
              onSessionScheduled={handleSessionAdded} 
            />
          </Box>
        )}
      </Box>
      
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Toutes" />
          <Tab label="À venir" />
          <Tab label="Passées" />
        </Tabs>
      </Paper>
      
      {sortedSessions.length === 0 ? (
        <Alert severity="info">
          Aucune session {tabValue === 1 ? 'à venir' : tabValue === 2 ? 'passée' : ''} trouvée.
          {tabValue === 1 && user && user.type === 'mentor' && ' Cliquez sur "Planifier une session" pour en créer une nouvelle.'}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {sortedSessions.map((session) => {
            const statusDisplay = getSessionStatusDisplay(session);
            const isUpcoming = new Date(session.date) > new Date() && session.status !== 'cancelled';
            const isPast = new Date(session.date) < new Date() || session.status === 'completed';
            
            return (
              <Grid item xs={12} key={session.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" component="div">
                          {session.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {formatDate(session.date)} · {session.duration} minutes
                        </Typography>
                      </Box>
                      <Chip 
                        label={statusDisplay.label} 
                        color={statusDisplay.color} 
                        size="small"
                      />
                    </Box>
                    
                    {session.description && (
                      <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                        {session.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {getLocationIcon(session.location_type)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {getLocationText(session)}
                      </Typography>
                    </Box>
                    
                    {session.status === 'cancelled' && session.cancellation_reason && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Raison de l'annulation :</strong> {session.cancellation_reason}
                        </Typography>
                      </Alert>
                    )}
                    
                    {session.notes && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Notes de session
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 1.5 }}>
                          <Typography variant="body2">
                            {session.notes}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                    
                    {session.feedback && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Évaluation
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={session.feedback.rating} precision={0.5} readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {session.feedback.rating}/5
                          </Typography>
                        </Box>
                        {session.feedback.comment && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            "{session.feedback.comment}"
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {isUpcoming && (
                      <>
                        {session.location_type === 'video' && session.video_link && isSessionImminent(session.date) && (
                          <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<VideoCallIcon />}
                            href={session.video_link}
                            target="_blank"
                          >
                            Rejoindre
                          </Button>
                        )}
                        
                        {user && user.type === 'mentor' && (
                          <Button 
                            color="error" 
                            startIcon={<CloseIcon />}
                            onClick={() => handleOpenDialog('cancel', session.id)}
                          >
                            Annuler
                          </Button>
                        )}
                      </>
                    )}
                    
                    {isPast && session.status !== 'cancelled' && (
                      <>
                        {user && user.type === 'mentor' && !session.notes && (
                          <Button 
                            startIcon={<NotesIcon />}
                            onClick={() => handleOpenDialog('notes', session.id)}
                          >
                            Ajouter des notes
                          </Button>
                        )}
                        
                        {user && user.type === 'student' && !session.feedback && (
                          <Button 
                            startIcon={<FeedbackIcon />}
                            onClick={() => handleOpenDialog('feedback', session.id, { rating: 0 })}
                          >
                            Évaluer
                          </Button>
                        )}
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {/* Dialogue d'annulation de session */}
      {dialogState.type === 'cancel' && (
        <Dialog
          open={dialogState.open}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Annuler la session</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Veuillez indiquer la raison de l'annulation. Cette information sera partagée avec votre mentoré.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="reason"
              label="Raison de l'annulation"
              fullWidth
              multiline
              rows={3}
              value={dialogState.data.reason || ''}
              onChange={handleDialogDataChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button 
              onClick={handleDialogSubmit} 
              color="error"
              variant="contained"
              disabled={!dialogState.data.reason?.trim()}
            >
              Confirmer l'annulation
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Dialogue d'ajout de notes */}
      {dialogState.type === 'notes' && (
        <Dialog
          open={dialogState.open}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Ajouter des notes de session</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ces notes vous aideront à suivre la progression de votre mentoré et à préparer les sessions futures.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="notes"
              label="Notes de session"
              fullWidth
              multiline
              rows={6}
              value={dialogState.data.notes || ''}
              onChange={handleDialogDataChange}
              placeholder="Points abordés, progrès réalisés, actions à entreprendre..."
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button 
              onClick={handleDialogSubmit} 
              color="primary"
              variant="contained"
              disabled={!dialogState.data.notes?.trim()}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Dialogue d'évaluation */}
      {dialogState.type === 'feedback' && (
        <Dialog
          open={dialogState.open}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Évaluer la session</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Votre évaluation aidera votre mentor à améliorer ses sessions futures.
            </DialogContentText>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <Typography component="legend">Note globale</Typography>
              <Rating
                name="rating"
                value={dialogState.data.rating || 0}
                precision={0.5}
                onChange={(event, newValue) => {
                  setDialogState(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      rating: newValue
                    }
                  }));
                }}
                size="large"
              />
            </Box>
            <TextField
              margin="dense"
              name="comment"
              label="Commentaire (optionnel)"
              fullWidth
              multiline
              rows={4}
              value={dialogState.data.comment || ''}
              onChange={handleDialogDataChange}
              placeholder="Partagez votre expérience et vos suggestions d'amélioration..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button 
              onClick={handleDialogSubmit} 
              color="primary"
              variant="contained"
              disabled={!dialogState.data.rating}
            >
              Soumettre
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default SessionsList;
