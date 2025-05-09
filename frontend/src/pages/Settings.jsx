import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button,
  TextField,
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Language as LanguageIcon,
  ColorLens as ThemeIcon,
  DeleteForever as DeleteIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    // Paramètres du compte
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Paramètres de notification
    emailNotifications: true,
    messageNotifications: true,
    eventNotifications: true,
    
    // Paramètres de confidentialité
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    
    // Paramètres d'affichage
    language: 'fr',
    darkMode: false
  });

  // Simuler le chargement des paramètres
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setSettings({
        ...settings,
        email: user?.email || 'utilisateur@example.com'
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };

  const handleSaveSettings = (section) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    // Simuler un appel API pour sauvegarder les paramètres
    setTimeout(() => {
      // Vérifier si les mots de passe correspondent pour la section du compte
      if (section === 'account' && settings.newPassword) {
        if (settings.newPassword !== settings.confirmPassword) {
          setError('Les mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Réinitialiser les champs de mot de passe après la sauvegarde
      if (section === 'account') {
        setSettings({
          ...settings,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setOpenDeleteDialog(false);
    setLoading(true);
    
    // Simuler un appel API pour supprimer le compte
    setTimeout(() => {
      setLoading(false);
      // Redirection vers la page de connexion serait effectuée ici
      alert('Votre compte a été supprimé. Vous allez être redirigé vers la page d\'accueil.');
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Vos paramètres ont été enregistrés avec succès.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Paramètres du compte */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Paramètres du compte
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Adresse email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Changer de mot de passe
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mot de passe actuel"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={settings.currentPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={settings.newPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmer le nouveau mot de passe"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={settings.confirmPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSaveSettings('account')}
                    disabled={loading}
                  >
                    Enregistrer les modifications
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Paramètres de notification */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                    name="emailNotifications"
                    color="primary"
                  />
                }
                label="Notifications par email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.messageNotifications}
                    onChange={handleInputChange}
                    name="messageNotifications"
                    color="primary"
                  />
                }
                label="Notifications de messages"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.eventNotifications}
                    onChange={handleInputChange}
                    name="eventNotifications"
                    color="primary"
                  />
                }
                label="Notifications d'événements"
              />
            </FormGroup>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<NotificationsIcon />}
                onClick={() => handleSaveSettings('notifications')}
                disabled={loading}
              >
                Enregistrer
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Paramètres de confidentialité */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Confidentialité
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showEmail}
                    onChange={handleInputChange}
                    name="showEmail"
                    color="primary"
                  />
                }
                label="Afficher mon email sur mon profil"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showPhone}
                    onChange={handleInputChange}
                    name="showPhone"
                    color="primary"
                  />
                }
                label="Afficher mon numéro de téléphone sur mon profil"
              />
            </FormGroup>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SecurityIcon />}
                onClick={() => handleSaveSettings('privacy')}
                disabled={loading}
              >
                Enregistrer
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Paramètres d'affichage */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Affichage
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleInputChange}
                    name="darkMode"
                    color="primary"
                  />
                }
                label="Mode sombre"
              />
            </FormGroup>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ThemeIcon />}
                onClick={() => handleSaveSettings('display')}
                disabled={loading}
              >
                Enregistrer
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Suppression du compte */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Supprimer mon compte
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              La suppression de votre compte est définitive et entraînera la perte de toutes vos données.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteDialog(true)}
              >
                Supprimer mon compte
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialogue de confirmation pour la suppression du compte */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Êtes-vous sûr de vouloir supprimer votre compte ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cette action est irréversible. Toutes vos données personnelles, messages et activités seront définitivement supprimés.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
