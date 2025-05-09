import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import {
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import mentorshipService from '../../services/mentorshipService';

const ScheduleSessionForm = ({ mentorship, onSessionScheduled, onCancel }) => {
  const [formData, setFormData] = useState({
    date: null,
    duration: 60,
    topic: '',
    description: '',
    mode: 'video',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Options pour la durée de la session
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1 heure 30 minutes' },
    { value: 120, label: '2 heures' }
  ];

  // Options pour le mode de la session
  const modeOptions = [
    { value: 'video', label: 'Visioconférence' },
    { value: 'in_person', label: 'En personne' },
    { value: 'phone', label: 'Appel téléphonique' }
  ];

  // Gestionnaire pour les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Gestionnaire pour le changement de date
  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });
    
    // Effacer l'erreur pour ce champ
    if (errors.date) {
      setErrors({
        ...errors,
        date: null
      });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Veuillez sélectionner une date et une heure';
    } else if (formData.date < new Date()) {
      newErrors.date = 'La date doit être dans le futur';
    }
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Veuillez indiquer un sujet pour la session';
    }
    
    if (formData.mode === 'in_person' && !formData.location.trim()) {
      newErrors.location = 'Veuillez indiquer un lieu de rencontre';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaire pour la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // En production, utiliser cette ligne pour planifier la session
      // await mentorshipService.scheduleSession(mentorship.id, formData);
      
      // Pour le développement, simuler une réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Afficher le succès
      setSuccess(true);
      
      // Notifier le composant parent
      if (onSessionScheduled) {
        onSessionScheduled({
          ...formData,
          id: `session-${Date.now()}`,
          status: 'scheduled'
        });
      }
      
      // Réinitialiser le formulaire après un délai
      setTimeout(() => {
        setFormData({
          date: null,
          duration: 60,
          topic: '',
          description: '',
          mode: 'video',
          location: ''
        });
        setSuccess(false);
        
        // Fermer le formulaire
        if (onCancel) {
          onCancel();
        }
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la planification de la session:', err);
      setError('Impossible de planifier la session. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Planifier une session de mentorat</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          Session planifiée avec succès !
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DateTimePicker
                label="Date et heure de la session"
                value={formData.date}
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
                disablePast
                minutesStep={5}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="duration-label">Durée</InputLabel>
              <Select
                labelId="duration-label"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                label="Durée"
              >
                {durationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="mode-label">Mode de session</InputLabel>
              <Select
                labelId="mode-label"
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                label="Mode de session"
              >
                {modeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {formData.mode === 'in_person' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="location"
                name="location"
                label="Lieu de rencontre"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="topic"
              name="topic"
              label="Sujet de la session"
              value={formData.topic}
              onChange={handleChange}
              error={!!errors.topic}
              helperText={errors.topic}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description et objectifs"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Décrivez les objectifs et le contenu prévu pour cette session..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                onClick={onCancel}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <ScheduleIcon />}
              >
                {loading ? 'Planification en cours...' : 'Planifier la session'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ScheduleSessionForm;
