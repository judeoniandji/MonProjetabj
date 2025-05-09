import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSettings,
  updateNotificationSettings,
  updatePrivacySettings,
} from '../store/slices/settingsSlice';

function Settings() {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleNotificationChange = async (setting) => {
    try {
      await dispatch(updateNotificationSettings({
        ...settings.notifications,
        [setting]: !settings.notifications[setting],
      })).unwrap();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePrivacyChange = async (setting, value) => {
    try {
      await dispatch(updatePrivacySettings({
        ...settings.privacy,
        [setting]: value,
      })).unwrap();
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Paramètres
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email_notifications}
                      onChange={() => handleNotificationChange('email_notifications')}
                    />
                  }
                  label="Notifications par email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.job_alerts}
                      onChange={() => handleNotificationChange('job_alerts')}
                    />
                  }
                  label="Alertes d'offres d'emploi"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.event_reminders}
                      onChange={() => handleNotificationChange('event_reminders')}
                    />
                  }
                  label="Rappels d'événements"
                />
              </FormGroup>
            </Paper>
          </Grid>

          {/* Confidentialité */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Confidentialité
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Visibilité du profil</InputLabel>
                <Select
                  value={settings.privacy.profile_visibility}
                  label="Visibilité du profil"
                  onChange={(e) => handlePrivacyChange('profile_visibility', e.target.value)}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Privé</MenuItem>
                  <MenuItem value="connections">Connexions uniquement</MenuItem>
                </Select>
              </FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.show_email}
                      onChange={() => handlePrivacyChange('show_email', !settings.privacy.show_email)}
                    />
                  }
                  label="Afficher mon email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.show_connections}
                      onChange={() => handlePrivacyChange('show_connections', !settings.privacy.show_connections)}
                    />
                  }
                  label="Afficher mes connexions"
                />
              </FormGroup>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Settings; 