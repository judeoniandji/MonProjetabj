import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { adminService } from '../../api/admin';

const DatabaseReset = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ success: null, message: '' });

  const handleClickOpen = () => {
    setOpen(true);
    // Réinitialiser les résultats précédents
    setResult({ success: null, message: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      // Appel au service d'administration pour réinitialiser la base de données
      const response = await adminService.resetDatabase();
      
      setResult({
        success: true,
        message: response.message || 'Base de données réinitialisée avec succès.'
      });
      
      // Effacer les données locales également
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('registeredUser');
      
      // Attendre 3 secondes avant de fermer la boîte de dialogue
      setTimeout(() => {
        handleClose();
        // Rediriger vers la page de connexion après réinitialisation
        window.location.href = '/login';
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de la base de données:', error);
      setResult({
        success: false,
        message: error.message || 'Erreur lors de la réinitialisation de la base de données.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Réinitialisation de la base de données
      </Typography>
      <Typography variant="body1" paragraph>
        Cette action supprimera toutes les données de l'application et recréera la structure de la base de données.
        Un compte administrateur par défaut sera créé.
      </Typography>
      <Button 
        variant="contained" 
        color="error" 
        onClick={handleClickOpen}
        startIcon={<WarningIcon />}
      >
        Réinitialiser la base de données
      </Button>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation de réinitialisation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" color="error" fontWeight="bold">
                ATTENTION: Cette action est irréversible!
              </Typography>
            </Box>
            <Typography variant="body1">
              Vous êtes sur le point de supprimer toutes les données de l'application:
            </Typography>
            <ul>
              <li>Tous les utilisateurs (étudiants, universités, entreprises)</li>
              <li>Tous les profils</li>
              <li>Toutes les offres d'emploi et candidatures</li>
              <li>Tous les événements et inscriptions</li>
              <li>Tous les messages et notifications</li>
            </ul>
            <Typography variant="body1">
              Après la réinitialisation, un compte administrateur par défaut sera créé avec les identifiants suivants:
            </Typography>
            <Box component="pre" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
              Email: admin@example.com<br/>
              Mot de passe: Admin123!
            </Box>
            <Typography variant="body1" fontWeight="bold">
              Êtes-vous sûr de vouloir continuer?
            </Typography>
          </DialogContentText>
          
          {result.success !== null && (
            <Alert 
              severity={result.success ? "success" : "error"} 
              sx={{ mt: 2 }}
            >
              {result.message}
            </Alert>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="primary"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleReset} 
            color="error" 
            variant="contained"
            disabled={loading}
            autoFocus
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DatabaseReset;
