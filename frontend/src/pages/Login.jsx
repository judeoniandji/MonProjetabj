import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import { styled, keyframes } from '@mui/material/styles';
import { animations, transitions } from '../styles/animations';

// Animation de flottement pour l'image
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Composants stylisés avec animations
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #1E88E5, #64B5F6)',
  },
  ...animations.fadeIn,
  animationDuration: '0.8s',
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      boxShadow: '0 6px 16px rgba(30, 136, 229, 0.15)',
    }
  },
  ...animations.slideUp,
  animationDuration: '0.6s',
  opacity: 0,
  animationFillMode: 'forwards',
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))',
    transition: 'all 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 7px 14px rgba(0, 0, 0, 0.15)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
  },
  ...animations.slideUp,
  animationDuration: '0.6s',
  animationDelay: '0.3s',
  opacity: 0,
  animationFillMode: 'forwards',
}));

const AnimatedTypography = styled(Typography)(({ theme, delay = 0 }) => ({
  ...animations.slideUp,
  animationDuration: '0.6s',
  animationDelay: `${delay * 0.1}s`,
  opacity: 0,
  animationFillMode: 'forwards',
}));

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(3)} 0`,
  ...animations.fadeIn,
  animationDuration: '0.8s',
  animationDelay: '0.2s',
  opacity: 0,
  animationFillMode: 'forwards',
}));

const AnimatedBox = styled(Box)(({ theme, delay = 0 }) => ({
  ...animations.fadeIn,
  animationDuration: '0.8s',
  animationDelay: `${delay * 0.1}s`,
  opacity: 0,
  animationFillMode: 'forwards',
}));

const FloatingImage = styled(Box)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token, user } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (token && user?.user_type) {
      const userType = user.user_type;
      let route = '/';
      
      switch (userType) {
        case 'student':
          route = '/student/dashboard';
          break;
        case 'university':
        case 'school':
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
          route = '/';
      }
      
      navigate(route);
    }
  }, [token, user, navigate]);
  
  // Récupérer les paramètres d'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);
  
  // Effacer les erreurs lors du démontage
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation de l'email
    if (!email) {
      setEmailError('L\'email est requis');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Format d\'email invalide');
      return;
    } else {
      setEmailError('');
    }
    
    // Connexion simplifiée sans mot de passe
    dispatch(loginUser({ email }));
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%)',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <FloatingImage>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
                  alt="Étudiants sénégalais"
                  sx={{
                    width: '80%',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.12)',
                  }}
                />
              </FloatingImage>
            </Grid>
          )}
          
          <Grid item xs={12} md={6} sm={8}>
            <AnimatedPaper>
              <AnimatedTypography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 3 }}
                delay={0}
              >
                Connexion
              </AnimatedTypography>
              
              <AnimatedTypography 
                variant="body1" 
                color="text.secondary" 
                align="center" 
                paragraph
                sx={{ mb: 4 }}
                delay={1}
              >
                Bienvenue sur Campus Connect ! Connectez-vous pour accéder à votre espace personnel.
              </AnimatedTypography>
              
              {error && (
                <AnimatedBox delay={2}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: theme.shape.borderRadius * 1.5,
                      ...animations.pulse,
                      animationDuration: '2s',
                    }}
                  >
                    {error}
                  </Alert>
                </AnimatedBox>
              )}
              
              <form onSubmit={handleSubmit}>
                <AnimatedTextField
                  fullWidth
                  label="Adresse email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    animationDelay: '0.1s',
                  }}
                />
                
                <AnimatedButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(45deg, #1E88E5 30%, #42A5F5 90%)',
                    color: 'white',
                    py: 1.5,
                  }}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter sans mot de passe'}
                </AnimatedButton>
              </form>
              
              <AnimatedDivider>
                <Typography variant="body2" color="text.secondary">
                  ou
                </Typography>
              </AnimatedDivider>
              
              <AnimatedBox delay={4} sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Vous n'avez pas encore de compte ?
                </Typography>
                
                <AnimatedButton
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    mt: 1,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                    }
                  }}
                >
                  Créer un compte
                </AnimatedButton>
              </AnimatedBox>
              
              <AnimatedBox delay={5} sx={{ mt: 4, textAlign: 'center' }}>
                <Link 
                  component={RouterLink} 
                  to="/" 
                  color="primary"
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(-5px)',
                    }
                  }}
                >
                  Retour à l'accueil
                </Link>
              </AnimatedBox>
            </AnimatedPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
