import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const steps = ['Adresse email', 'Code de vérification', 'Nouveau mot de passe'];
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simuler l'envoi d'un email avec un code de vérification
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActiveStep(1);
    } catch (err) {
      setError('Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simuler la vérification du code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vérifier que le code est correct (ici on accepte n'importe quel code à 6 chiffres)
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        throw new Error('Code de vérification invalide');
      }
      
      setActiveStep(2);
    } catch (err) {
      setError(err.message || 'Erreur lors de la vérification du code. Veuillez réessayer.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier que les mots de passe correspondent
      if (newPassword !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      // Vérifier que le mot de passe est assez fort
      if (newPassword.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }
      
      // Simuler la réinitialisation du mot de passe
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Récupération de mot de passe
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4, pt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Mot de passe réinitialisé avec succès !
              </Typography>
              <Typography variant="body1" paragraph>
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
                sx={{ mt: 2 }}
              >
                Se connecter
              </Button>
            </Box>
          ) : (
            <>
              {activeStep === 0 && (
                <Box component="form" onSubmit={handleEmailSubmit}>
                  <Typography variant="body1" paragraph>
                    Veuillez entrer l'adresse email associée à votre compte. Nous vous enverrons un code de vérification.
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Adresse email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Envoyer le code de vérification'}
                  </Button>
                </Box>
              )}
              
              {activeStep === 1 && (
                <Box component="form" onSubmit={handleVerificationSubmit}>
                  <Typography variant="body1" paragraph>
                    Un code de vérification a été envoyé à {email}. Veuillez entrer ce code ci-dessous.
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="verificationCode"
                    label="Code de vérification"
                    name="verificationCode"
                    autoFocus
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    inputProps={{ maxLength: 6 }}
                  />
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setActiveStep(0)}
                        disabled={loading}
                      >
                        Retour
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Vérifier'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeStep === 2 && (
                <Box component="form" onSubmit={handlePasswordSubmit}>
                  <Typography variant="body1" paragraph>
                    Veuillez entrer votre nouveau mot de passe.
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="newPassword"
                    label="Nouveau mot de passe"
                    name="newPassword"
                    type="password"
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setActiveStep(1)}
                        disabled={loading}
                      >
                        Retour
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Réinitialiser'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Retour à la page de connexion
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
