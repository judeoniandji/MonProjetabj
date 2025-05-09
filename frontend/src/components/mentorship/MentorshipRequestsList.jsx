import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Grid,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as AcceptIcon,
  Close as RejectIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import mentorshipService from '../../services/mentorshipService';

// Composant pour afficher et gérer les demandes de mentorat
const MentorshipRequestsList = () => {
  const { user } = useSelector(state => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [responseDialog, setResponseDialog] = useState({
    open: false,
    requestId: null,
    action: null,
    message: '',
    loading: false,
    error: null
  });

  // Charger les demandes de mentorat
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // En production, utiliser cette ligne pour récupérer les données réelles
      // const data = user.user_type === 'mentor' 
      //   ? await mentorshipService.getMentorshipRequests()
      //   : await mentorshipService.getSentMentorshipRequests();

      // Pour le développement, utiliser des données simulées
      await new Promise(resolve => setTimeout(resolve, 800));

      // Données simulées pour les demandes de mentorat
      const mockRequests = Array(5).fill().map((_, index) => ({
        id: `request-${index + 1}`,
        student: {
          id: `student-${index + 1}`,
          name: `${['Amadou', 'Fatou', 'Omar', 'Aïssatou', 'Moussa'][index]} ${['Diop', 'Ndiaye', 'Sow', 'Fall', 'Gueye'][index]}`,
          avatar: '',
          school: `Université ${['Cheikh Anta Diop', 'Gaston Berger', 'Alioune Diop', 'Assane Seck', 'Virtuelle du Sénégal'][index]}`
        },
        mentor: {
          id: `mentor-${index + 1}`,
          name: `${['Ibrahima', 'Mariama', 'Cheikh', 'Aminata', 'Ousmane'][index]} ${['Mbaye', 'Thiam', 'Diallo', 'Sarr', 'Ba'][index]}`,
          avatar: '',
          title: `${['Développeur Senior', 'Chef de Projet Digital', 'Consultant Marketing', 'Entrepreneur', 'Designer UX/UI'][index]}`
        },
        status: ['pending', 'accepted', 'rejected', 'pending', 'pending'][index],
        created_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
        message: `Bonjour, je suis intéressé(e) par votre expertise en ${['développement web', 'gestion de projet', 'marketing digital', 'entrepreneuriat', 'design UX/UI'][index]} et j'aimerais bénéficier de votre accompagnement pour développer mes compétences dans ce domaine.`,
        response_message: index === 1 ? 'Je serais ravi de vous accompagner dans votre parcours professionnel.' : (index === 2 ? 'Malheureusement, je ne suis pas disponible pour le moment.' : ''),
        objectives: `Améliorer mes compétences en ${['développement web', 'gestion de projet', 'marketing digital', 'entrepreneuriat', 'design UX/UI'][index]} et préparer mon entrée sur le marché du travail.`,
        duration_expectation: ['3 mois', '6 mois', '1 mois', '2 mois', 'Indéterminé'][index]
      }));

      setRequests(mockRequests);
    } catch (err) {
      console.error('Erreur lors du chargement des demandes de mentorat:', err);
      setError('Impossible de charger les demandes de mentorat. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les demandes au chargement du composant
  useEffect(() => {
    loadRequests();
  }, [user]);

  // Filtrer les demandes en fonction de l'onglet sélectionné
  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === 'pending';
    if (tabValue === 1) return request.status === 'accepted';
    if (tabValue === 2) return request.status === 'rejected';
    return true;
  });

  // Gestionnaire pour le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Ouvrir la boîte de dialogue de réponse
  const openResponseDialog = (requestId, action) => {
    setResponseDialog({
      open: true,
      requestId,
      action,
      message: '',
      loading: false,
      error: null
    });
  };

  // Fermer la boîte de dialogue de réponse
  const closeResponseDialog = () => {
    setResponseDialog({
      ...responseDialog,
      open: false
    });
  };

  // Gestionnaire pour la réponse à une demande de mentorat
  const handleRequestResponse = async () => {
    try {
      setResponseDialog({
        ...responseDialog,
        loading: true,
        error: null
      });

      const { requestId, action, message } = responseDialog;
      const status = action === 'accept' ? 'accepted' : 'rejected';

      // En production, utiliser cette ligne pour envoyer la réponse
      // await mentorshipService.respondToMentorshipRequest(requestId, status, message);

      // Pour le développement, simuler une réponse
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour l'état local
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { 
                ...request, 
                status, 
                response_message: message 
              } 
            : request
        )
      );

      // Fermer la boîte de dialogue
      closeResponseDialog();
    } catch (err) {
      console.error('Erreur lors de la réponse à la demande de mentorat:', err);
      setResponseDialog({
        ...responseDialog,
        loading: false,
        error: 'Impossible de traiter votre réponse. Veuillez réessayer.'
      });
    }
  };

  // Rendu du composant
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="En attente" />
          <Tab label="Acceptées" />
          <Tab label="Refusées" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : filteredRequests.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aucune demande de mentorat {tabValue === 0 ? 'en attente' : tabValue === 1 ? 'acceptée' : 'refusée'}.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={user.user_type === 'mentor' ? 8 : 8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={user.user_type === 'mentor' ? request.student.avatar : request.mentor.avatar} 
                          alt={user.user_type === 'mentor' ? request.student.name : request.mentor.name}
                          sx={{ mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6">
                            {user.user_type === 'mentor' ? request.student.name : request.mentor.name}
                            {request.mentor.is_verified && (
                              <Tooltip title="Mentor vérifié">
                                <IconButton size="small" color="primary" sx={{ ml: 0.5 }}>
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.user_type === 'mentor' 
                              ? (typeof request.student.school === 'object' ? request.student.school?.name : request.student.school || 'Non spécifiée')
                              : request.mentor.title}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        {request.message}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Objectifs:
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {request.objectives}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={<CalendarIcon />} 
                          label={`Durée souhaitée: ${request.duration_expectation}`} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          icon={<MessageIcon />} 
                          label="Message direct" 
                          size="small" 
                          variant="outlined" 
                          onClick={() => {/* Ouvrir la messagerie */}}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={user.user_type === 'mentor' ? 4 : 4}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%', 
                        justifyContent: 'space-between',
                        borderLeft: { sm: `1px solid ${(theme) => theme.palette.divider}` },
                        pl: { sm: 2 }
                      }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Statut:
                          </Typography>
                          <Chip 
                            label={request.status === 'pending' 
                              ? 'En attente' 
                              : request.status === 'accepted' 
                                ? 'Acceptée' 
                                : 'Refusée'
                            } 
                            color={request.status === 'pending' 
                              ? 'default' 
                              : request.status === 'accepted' 
                                ? 'success' 
                                : 'error'
                            }
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                          
                          <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Date de demande:
                          </Typography>
                          <Typography variant="body2">
                            {format(request.created_at, 'PPP', { locale: fr })}
                          </Typography>
                          
                          {request.response_message && (
                            <>
                              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Réponse:
                              </Typography>
                              <Typography variant="body2">
                                {request.response_message}
                              </Typography>
                            </>
                          )}
                        </Box>
                        
                        {user.user_type === 'mentor' && request.status === 'pending' && (
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              startIcon={<RejectIcon />}
                              onClick={() => openResponseDialog(request.id, 'reject')}
                              size="small"
                            >
                              Refuser
                            </Button>
                            <Button 
                              variant="contained" 
                              color="success" 
                              startIcon={<AcceptIcon />}
                              onClick={() => openResponseDialog(request.id, 'accept')}
                              size="small"
                            >
                              Accepter
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Boîte de dialogue pour répondre à une demande */}
      <Dialog open={responseDialog.open} onClose={closeResponseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {responseDialog.action === 'accept' 
            ? 'Accepter la demande de mentorat' 
            : 'Refuser la demande de mentorat'
          }
        </DialogTitle>
        <DialogContent>
          {responseDialog.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {responseDialog.error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="response-message"
            label="Message de réponse (optionnel)"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={responseDialog.message}
            onChange={(e) => setResponseDialog({ ...responseDialog, message: e.target.value })}
            variant="outlined"
            placeholder={responseDialog.action === 'accept' 
              ? 'Expliquez comment vous envisagez cette relation de mentorat...' 
              : 'Expliquez pourquoi vous ne pouvez pas accepter cette demande...'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResponseDialog} disabled={responseDialog.loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleRequestResponse} 
            color={responseDialog.action === 'accept' ? 'success' : 'error'}
            variant="contained"
            disabled={responseDialog.loading}
            startIcon={responseDialog.loading ? <CircularProgress size={20} /> : null}
          >
            {responseDialog.loading 
              ? 'Traitement en cours' 
              : responseDialog.action === 'accept' 
                ? 'Confirmer l\'acceptation' 
                : 'Confirmer le refus'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorshipRequestsList;
