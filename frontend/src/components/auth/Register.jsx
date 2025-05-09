import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  FormHelperText,
  CircularProgress,
  Autocomplete,
  Chip,
  Divider,
} from '@mui/material';
import { authService } from '../../services/api';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../redux/authSlice';
import { STUDY_FIELDS, TECHNICAL_SKILLS, INDUSTRY_SECTORS, EXPERTISE_FIELDS } from '../../constants/formOptions';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'student',
    // Champs pour les étudiants
    studyField: '',
    studyLevel: '',
    university: '',
    graduationYear: '',
    skills: [],
    // Champs pour les universités
    universityName: '',
    location: '',
    websiteUrl: '',
    // Champs pour les entreprises
    companyName: '',
    industrySector: '',
    companySize: '',
    // Champs pour les mentors
    expertise: [],
    yearsOfExperience: '',
    currentPosition: '',
    company: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Validations spécifiques selon le type d'utilisateur
    switch (formData.user_type) {
      case 'student':
        if (!formData.studyField) {
          newErrors.studyField = 'Le domaine d\'études est requis';
        }
        if (!formData.university) {
          newErrors.university = 'L\'université est requise';
        }
        break;
        
      case 'university':
        if (!formData.universityName) {
          newErrors.universityName = 'Le nom de l\'université est requis';
        }
        if (!formData.location) {
          newErrors.location = 'L\'emplacement est requis';
        }
        break;
        
      case 'company':
        if (!formData.companyName) {
          newErrors.companyName = 'Le nom de l\'entreprise est requis';
        }
        if (!formData.industrySector) {
          newErrors.industrySector = 'Le secteur d\'activité est requis';
        }
        break;
        
      case 'mentor':
        if (formData.expertise.length === 0) {
          newErrors.expertise = 'Au moins un domaine d\'expertise est requis';
        }
        if (!formData.yearsOfExperience) {
          newErrors.yearsOfExperience = 'Les années d\'expérience sont requises';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
    
    // Effacer l'erreur API lorsque l'utilisateur modifie le formulaire
    if (apiError) {
      setApiError('');
    }
  };
  
  const handleAutocompleteChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setApiError('');
    
    try {
      // Créer un objet avec les données à envoyer
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: formData.user_type,
      };
      
      // Ajouter les champs spécifiques selon le type d'utilisateur
      switch (formData.user_type) {
        case 'student':
          userData.studyField = formData.studyField;
          userData.studyLevel = formData.studyLevel;
          userData.university = formData.university;
          userData.graduationYear = formData.graduationYear;
          userData.skills = formData.skills;
          break;
          
        case 'university':
          userData.universityName = formData.universityName;
          userData.location = formData.location;
          userData.websiteUrl = formData.websiteUrl;
          break;
          
        case 'company':
          userData.companyName = formData.companyName;
          userData.industrySector = formData.industrySector;
          userData.companySize = formData.companySize;
          break;
          
        case 'mentor':
          userData.expertise = formData.expertise;
          userData.yearsOfExperience = formData.yearsOfExperience;
          userData.currentPosition = formData.currentPosition;
          userData.company = formData.company;
          break;
          
        default:
          break;
      }
      
      // Simuler une connexion avec le backend
      // Dans une implémentation réelle, ceci serait un appel API
      // const response = await authService.register(userData);
      
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simuler une réponse réussie
      const user = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: formData.name,
        email: formData.email,
        user_type: formData.user_type,
        ...userData
      };
      
      // Simuler un token
      const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Stocker dans le localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Mettre à jour le Redux store
      dispatch(setUser(user));
      dispatch(setToken(token));
      
      // Rediriger vers le tableau de bord approprié
      let route = '/';
      
      switch(formData.user_type) {
        case 'student':
          route = '/student/dashboard';
          break;
        case 'university':
          route = '/school/dashboard';
          break;
        case 'company':
          route = '/company/dashboard';
          break;
        case 'mentor':
          route = '/mentor/dashboard';
          break;
        case 'admin':
          route = '/admin/dashboard';
          break;
        default:
          route = '/student/dashboard';
      }
      
      navigate(route);
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setApiError(error.message || 'Une erreur s\'est produite lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setApiError('');
    
    try {
      // Utiliser les services d'API pour l'authentification sociale
      let response;
      
      if (provider === 'google') {
        // Dans une implémentation réelle, nous obtiendrions le token via l'API Google
        // Pour cette démonstration, nous simulons un token
        const tokenData = { 
          token: 'fake-google-token-' + Math.random().toString(36).substring(2),
          email: 'user@gmail.com',
          name: 'Utilisateur Google'
        };
        response = await authService.googleAuth(tokenData);
      } else if (provider === 'facebook') {
        // Dans une implémentation réelle, nous obtiendrions le token via l'API Facebook
        // Pour cette démonstration, nous simulons un token
        const tokenData = { 
          token: 'fake-facebook-token-' + Math.random().toString(36).substring(2),
          email: 'user@facebook.com',
          name: 'Utilisateur Facebook'
        };
        response = await authService.facebookAuth(tokenData);
      } else {
        throw new Error(`Fournisseur d'authentification non pris en charge: ${provider}`);
      }
      
      // Récupérer les données de la réponse
      const { access_token, refresh_token, user } = response.data;
      
      // Stocker dans le localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Mettre à jour le Redux store
      dispatch(setUser(user));
      dispatch(setToken(access_token));
      
      // Rediriger vers le tableau de bord étudiant
      navigate('/student/dashboard');
      
    } catch (error) {
      console.error(`Erreur de connexion avec ${provider}:`, error);
      setApiError(error.response?.data?.error || `Une erreur s'est produite lors de la connexion avec ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const renderUserTypeFields = () => {
    switch (formData.user_type) {
      case 'student':
        return (
          <>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={STUDY_FIELDS}
                value={formData.studyField}
                onChange={(_, newValue) => handleAutocompleteChange('studyField', newValue)}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Domaine d'études"
                    error={!!errors.studyField}
                    helperText={errors.studyField}
                    required
                  />
                )}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Niveau d'études"
                name="studyLevel"
                select
                value={formData.studyLevel || ''}
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="licence">Licence</MenuItem>
                <MenuItem value="master">Master</MenuItem>
                <MenuItem value="doctorat">Doctorat</MenuItem>
                <MenuItem value="autre">Autre</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Année de diplôme"
                name="graduationYear"
                type="number"
                value={formData.graduationYear || ''}
                onChange={handleChange}
                disabled={loading}
                InputProps={{ inputProps: { min: 2020, max: 2030 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Université"
                name="university"
                value={formData.university || ''}
                onChange={handleChange}
                error={!!errors.university}
                helperText={errors.university}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={TECHNICAL_SKILLS}
                value={formData.skills}
                onChange={(_, newValue) => handleAutocompleteChange('skills', newValue)}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Compétences techniques"
                    placeholder="Ajouter une compétence"
                    error={!!errors.skills}
                    helperText={errors.skills}
                  />
                )}
                disabled={loading}
              />
            </Grid>
          </>
        );
        
      case 'university':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'université"
                name="universityName"
                value={formData.universityName || ''}
                onChange={handleChange}
                error={!!errors.universityName}
                helperText={errors.universityName}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emplacement"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site web"
                name="websiteUrl"
                value={formData.websiteUrl || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </>
        );
        
      case 'company':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'entreprise"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={INDUSTRY_SECTORS}
                value={formData.industrySector}
                onChange={(_, newValue) => handleAutocompleteChange('industrySector', newValue)}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Secteur d'activité"
                    error={!!errors.industrySector}
                    helperText={errors.industrySector}
                    required
                  />
                )}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Taille de l'entreprise"
                name="companySize"
                select
                value={formData.companySize || ''}
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="1-10">1-10 employés</MenuItem>
                <MenuItem value="11-50">11-50 employés</MenuItem>
                <MenuItem value="51-200">51-200 employés</MenuItem>
                <MenuItem value="201-500">201-500 employés</MenuItem>
                <MenuItem value="501+">Plus de 500 employés</MenuItem>
              </TextField>
            </Grid>
          </>
        );
        
      case 'mentor':
        return (
          <>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={EXPERTISE_FIELDS}
                value={formData.expertise}
                onChange={(_, newValue) => handleAutocompleteChange('expertise', newValue)}
                getOptionLabel={(option) => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key, ...otherProps } = tagProps;
                    return (
                      <Chip
                        key={key}
                        label={typeof option === 'object' ? option.name : option}
                        {...otherProps}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Domaine d'expertise"
                    placeholder="Ajouter un domaine"
                    error={!!errors.expertise}
                    helperText={errors.expertise}
                    required
                  />
                )}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Années d'expérience"
                name="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience || ''}
                onChange={handleChange}
                error={!!errors.yearsOfExperience}
                helperText={errors.yearsOfExperience}
                required
                disabled={loading}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Poste actuel"
                name="currentPosition"
                value={formData.currentPosition || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Entreprise"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Créer un compte
        </Typography>
        
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        
        {/* Boutons d'authentification sociale */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                sx={{ py: 1.2, borderRadius: 2 }}
              >
                Continuer avec Google
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                sx={{ py: 1.2, borderRadius: 2, color: '#1877F2', borderColor: '#1877F2', '&:hover': { borderColor: '#1877F2', backgroundColor: 'rgba(24, 119, 242, 0.04)' } }}
              >
                Continuer avec Facebook
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OU
          </Typography>
        </Divider>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom complet"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="user-type-label">Type d'utilisateur</InputLabel>
                <Select
                  labelId="user-type-label"
                  name="user_type"
                  value={formData.user_type || 'student'}
                  onChange={handleChange}
                  label="Type d'utilisateur"
                  disabled={loading}
                >
                  <MenuItem value="student">Étudiant</MenuItem>
                  <MenuItem value="university">Université</MenuItem>
                  <MenuItem value="company">Entreprise</MenuItem>
                  <MenuItem value="mentor">Mentor</MenuItem>
                  <MenuItem value="admin">Administrateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Champs spécifiques selon le type d'utilisateur */}
            {renderUserTypeFields()}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Inscription en cours...
                  </>
                ) : (
                  'S\'inscrire'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Vous avez déjà un compte?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Se connecter
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
