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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as AcceptIcon,
  Close as RejectIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Message as MessageIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mentorshipService from '../../services/mentorshipService';

const MentorshipRequests = ({ userType }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [responseDialog, setResponseDialog] = useState({
    open: false,
    requestId: null,
    action: null, // 'accept' or 'reject'
    message: ''
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        
        // En production, utiliser ces lignes pour récupérer les données réelles
        // const data = userType === 'mentor' 
        //   ? await mentorshipService.getMentorshipRequests()
        //   : await mentorshipService.getSentMentorshipRequests();
        
        // Pour le développement, utiliser des données simulées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées pour les demandes de mentorat
        const mockRequests = [
          {
            id: 'request-1',
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
            request_date: '2025-04-01T10:15:00',
            status: 'pending',
            objectives: 'Je souhaite développer mes compétences en développement web et intelligence artificielle pour me préparer au marché du travail après mon diplôme.',
            message: 'Bonjour M. Diop, je suis actuellement en dernière année d\'informatique à l\'UCAD et je suis très intéressé par votre parcours professionnel. J\'aimerais bénéficier de votre expérience pour m\'orienter dans ma carrière de développeur.',
            duration: '6_months',
            preferred_schedule: 'weekday_evening',
            expectations: 'J\'aimerais avoir des conseils sur les technologies à maîtriser et comment construire un portfolio solide.'
          },
          {
            id: 'request-2',
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
            request_date: '2025-03-28T14:30:00',
            status: 'pending',
            objectives: 'Je souhaite développer mes compétences en gestion de projet et apprendre les méthodologies agiles pour me spécialiser dans ce domaine.',
            message: 'Bonjour Mme Sow, je suis étudiant en génie logiciel et je m\'intéresse particulièrement à la gestion de projet. Votre expérience chez Digital Africa m\'inspire et j\'aimerais bénéficier de vos conseils pour orienter ma carrière.',
            duration: '3_months',
            preferred_schedule: 'weekend_morning',
            expectations: 'J\'aimerais comprendre comment devenir un bon chef de projet et quelles certifications seraient utiles pour ma carrière.'
          }
        ];
        
        setRequests(mockRequests);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des demandes de mentorat:', err);
        setError('Impossible de charger les demandes de mentorat. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [userType]);

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
  
  // Traduire les valeurs de durée
  const translateDuration = (duration) => {
    const durations = {
      '1_month': '1 mois',
      '3_months': '3 mois',
      '6_months': '6 mois',
      '1_year': '1 an',
      'undefined': 'À définir ensemble'
    };
    return durations[duration] || duration;
  };
  
  // Traduire les valeurs d'horaire préféré
  const translateSchedule = (schedule) => {
    const schedules = {
      'weekday_morning': 'Jours de semaine - Matin',
      'weekday_afternoon': 'Jours de semaine - Après-midi',
      'weekday_evening': 'Jours de semaine - Soir',
      'weekend_morning': 'Week-end - Matin',
      'weekend_afternoon': 'Week-end - Après-midi',
      'flexible': 'Flexible'
    };
    return schedules[schedule] || schedule;
  };
  
  // Gestionnaire pour développer/réduire les détails d'une demande
  const handleExpandClick = (requestId) => {
    setExpandedId(expandedId === requestId ? null : requestId);
  };
  
  // Gestionnaire pour ouvrir le dialogue de réponse
  const handleOpenResponseDialog = (requestId, action) => {
    setResponseDialog({
      open: true,
      requestId,
      action,
      message: ''
    });
  };
  
  // Gestionnaire pour fermer le dialogue de réponse
  const handleCloseResponseDialog = () => {
    setResponseDialog({
      ...responseDialog,
      open: false
    });
  };
  
  // Gestionnaire pour mettre à jour le message de réponse
  const handleResponseMessageChange = (e) => {
    setResponseDialog({
      ...responseDialog,
      message: e.target.value
    });
  };
  
  // Gestionnaire pour soumettre la réponse à une demande
  const handleSubmitResponse = async () => {
    try {
      const { requestId, action, message } = responseDialog;
      
      // En production, utiliser cette ligne pour soumettre la réponse
      // await mentorshipService.respondToMentorshipRequest(requestId, action === 'accept' ? 'accepted' : 'rejected', message);
      
      // Pour le développement, simuler une réponse
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mettre à jour l'état local
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      // Fermer le dialogue
      handleCloseResponseDialog();
      
      // Afficher un message de confirmation (à implémenter selon votre système de notification)
      console.log(`Demande ${action === 'accept' ? 'acceptée' : 'refusée'} avec succès`);
    } catch (err) {
      console.error('Erreur lors de la réponse à la demande de mentorat:', err);
      // Afficher un message d'erreur (à implémenter selon votre système de notification)
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

  if (requests.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {userType === 'mentor' 
          ? 'Vous n\'avez pas de demandes de mentorat en attente.' 
          : 'Vous n\'avez pas de demandes de mentorat en cours.'}
      </Alert>
    );
  }

  return (
    <Box>
      {requests.map((request) => (
        <Card key={request.id} elevation={2} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                src={userType === 'mentor' ? request.student.avatar : request.mentor.avatar}
                alt={userType === 'mentor' ? request.student.name : request.mentor.name}
                sx={{ width: 50, height: 50, mr: 2 }}
              >
                {(userType === 'mentor' ? request.student.name : request.mentor.name).charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {userType === 'mentor' ? request.student.name : request.mentor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userType === 'mentor' 
                    ? `${request.student.field} - ${request.student.university}`
                    : `${request.mentor.title} chez ${request.mentor.company}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Demande envoyée le {formatDate(request.request_date)}
                </Typography>
              </Box>
              <Chip 
                label="En attente" 
                color="warning" 
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Durée souhaitée
                </Typography>
                <Typography variant="body2">
                  {translateDuration(request.duration)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Horaires préférés
                </Typography>
                <Typography variant="body2">
                  {translateSchedule(request.preferred_schedule)}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Objectifs
              </Typography>
              <Typography variant="body2" noWrap={expandedId !== request.id}>
                {request.objectives}
              </Typography>
            </Box>
            
            <Collapse in={expandedId === request.id} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Message
                </Typography>
                <Typography variant="body2" paragraph>
                  {request.message}
                </Typography>
                
                {request.expectations && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Attentes spécifiques
                    </Typography>
                    <Typography variant="body2">
                      {request.expectations}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </CardContent>
          
          <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
            <Button
              size="small"
              onClick={() => handleExpandClick(request.id)}
              endIcon={expandedId === request.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expandedId === request.id ? 'Moins de détails' : 'Plus de détails'}
            </Button>
            
            <Box>
              {userType === 'mentor' ? (
                <>
                  <Button 
                    size="small" 
                    startIcon={<MessageIcon />}
                    component={Link}
                    to={`/messages?contact=${request.student.id}`}
                    sx={{ mr: 1 }}
                  >
                    Message
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<RejectIcon />}
                    onClick={() => handleOpenResponseDialog(request.id, 'reject')}
                    sx={{ mr: 1 }}
                  >
                    Refuser
                  </Button>
                  <Button 
                    size="small" 
                    color="success" 
                    variant="contained"
                    startIcon={<AcceptIcon />}
                    onClick={() => handleOpenResponseDialog(request.id, 'accept')}
                  >
                    Accepter
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="small" 
                    startIcon={<MessageIcon />}
                    component={Link}
                    to={`/messages?contact=${request.mentor.id}`}
                    sx={{ mr: 1 }}
                  >
                    Message
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<InfoIcon />}
                    component={Link}
                    to={`/mentors/${request.mentor.id}`}
                  >
                    Profil du mentor
                  </Button>
                </>
              )}
            </Box>
          </CardActions>
        </Card>
      ))}
      
      {/* Dialogue de réponse à une demande */}
      <Dialog
        open={responseDialog.open}
        onClose={handleCloseResponseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {responseDialog.action === 'accept' ? 'Accepter' : 'Refuser'} la demande de mentorat
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {responseDialog.action === 'accept'
              ? 'Vous êtes sur le point d\'accepter cette demande de mentorat. Vous pouvez ajouter un message pour l\'étudiant.'
              : 'Veuillez expliquer pourquoi vous refusez cette demande de mentorat. Cela aidera l\'étudiant à comprendre votre décision.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={responseDialog.message}
            onChange={handleResponseMessageChange}
            required={responseDialog.action === 'reject'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResponseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmitResponse} 
            color={responseDialog.action === 'accept' ? 'success' : 'error'}
            variant="contained"
            disabled={responseDialog.action === 'reject' && !responseDialog.message.trim()}
          >
            {responseDialog.action === 'accept' ? 'Accepter' : 'Refuser'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorshipRequests;
