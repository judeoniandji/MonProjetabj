import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import { Add as AddIcon } from '@mui/icons-material';
import mentorshipService from '../../services/mentorshipService';

const SessionScheduler = ({ mentorshipId, onSessionScheduled }) => {
  const [open, setOpen] = useState(false);
  const [sessionData, setSessionData] = useState({
    date: null,
    duration: 60,
    topic: '',
    description: '',
    location_type: 'video'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Options pour la durée de la session
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1 heure 30' },
    { value: 120, label: '2 heures' }
  ];

  // Options pour le type de lieu
  const locationTypeOptions = [
    { value: 'video', label: 'Visioconférence' },
    { value: 'in_person', label: 'En personne' },
    { value: 'phone', label: 'Appel téléphonique' }
  ];

  // Gestionnaire pour ouvrir le dialogue
  const handleOpen = () => {
    setOpen(true);
  };

  // Gestionnaire pour fermer le dialogue
  const handleClose = () => {
    setOpen(false);
    setSessionData({
      date: null,
      duration: 60,
      topic: '',
      description: '',
      location_type: 'video'
    });
    setErrors({});
    setSubmitError(null);
  };

  // Gestionnaire pour le changement des données de la session
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Gestionnaire pour le changement de date
  const handleDateChange = (newDate) => {
    setSessionData(prev => ({
      ...prev,
      date: newDate
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: null
      }));
    }
  };

  // Valider les données du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!sessionData.date) {
      newErrors.date = 'Veuillez sélectionner une date et une heure';
    } else if (sessionData.date < new Date()) {
      newErrors.date = 'La date doit être dans le futur';
    }
    
    if (!sessionData.topic.trim()) {
      newErrors.topic = 'Veuillez saisir un sujet pour la session';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaire pour soumettre le formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // En production, utiliser cette ligne pour planifier la session
      // const response = await mentorshipService.scheduleSession(mentorshipId, sessionData);
      
      // Pour le développement, simuler une réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        id: 'session-' + Date.now(),
        ...sessionData,
        status: 'scheduled'
      };
      
      // Fermer le dialogue
      handleClose();
      
      // Appeler le callback avec la session planifiée
      if (onSessionScheduled) {
        onSessionScheduled(mockResponse);
      }
    } catch (err) {
      console.error('Erreur lors de la planification de la session:', err);
      setSubmitError('Une erreur est survenue lors de la planification de la session. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        fullWidth
      >
        Planifier une session
      </Button>
      
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Planifier une nouvelle session de mentorat</DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
                <DateTimePicker
                  label="Date et heure"
                  value={sessionData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.date}
                      helperText={errors.date}
                    />
                  )}
                  minDateTime={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Durée</InputLabel>
                <Select
                  name="duration"
                  value={sessionData.duration}
                  onChange={handleChange}
                  label="Durée"
                >
                  {durationOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Sujet de la session"
                name="topic"
                value={sessionData.topic}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.topic}
                helperText={errors.topic}
                placeholder="Ex: Développement de carrière, Revue de CV, Technologies web..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={sessionData.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                placeholder="Décrivez les objectifs et le contenu prévu pour cette session..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type de rencontre</InputLabel>
                <Select
                  name="location_type"
                  value={sessionData.location_type}
                  onChange={handleChange}
                  label="Type de rencontre"
                >
                  {locationTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {sessionData.location_type === 'in_person' && (
              <Grid item xs={12}>
                <TextField
                  label="Lieu de rencontre"
                  name="location"
                  value={sessionData.location || ''}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Adresse ou lieu de rencontre"
                />
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Une invitation sera envoyée à votre mentoré/mentor une fois la session planifiée.
              {sessionData.location_type === 'video' && ' Un lien de visioconférence sera généré automatiquement.'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Planifier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionScheduler;
