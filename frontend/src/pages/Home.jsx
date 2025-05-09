import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Link
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  SupervisorAccount as MentorIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { animations, transitions } from '../styles/animations';

// Carte stylisée avec animation
const AnimatedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #1E88E5, #00B0FF)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
    '&::before': {
      opacity: 1,
    },
  },
  ...animations.fadeIn,
  animationDuration: '0.6s',
}));

// Bouton stylisé avec animation
const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: '10px 24px',
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
    boxShadow: '0 7px 14px rgba(0, 0, 0, 0.2)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
  }
}));

// Section stylisée avec animation
const AnimatedSection = styled(Box)(({ theme, delay = 0 }) => ({
  ...animations.slideUp,
  animationDuration: '0.8s',
  animationDelay: `${delay * 0.1}s`,
  opacity: 0,
  animationFillMode: 'forwards',
}));

// Titre animé
const AnimatedTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '60px',
    height: '4px',
    background: 'linear-gradient(90deg, #1E88E5, #00B0FF)',
    borderRadius: '2px',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  },
}));

const Home = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Suppression de la redirection automatique pour toujours afficher la page d'accueil
  // useEffect(() => {
  //   if (token && user?.user_type) {
  //     const userType = user.user_type;
  //     let route = '/';
      
  //     switch (userType) {
  //       case 'student':
  //         route = '/student/dashboard';
  //         break;
  //       case 'university':
  //       case 'school':
  //         route = '/school/dashboard';
  //         break;
  //       case 'company':
  //         route = '/company/dashboard';
  //         break;
  //       case 'mentor':
  //         route = '/mentor/dashboard';
  //         break;
  //       case 'admin':
  //         route = '/admin/dashboard';
  //         break;
  //       default:
  //         route = '/';
  //     }
      
  //     navigate(route);
  //   }
  // }, [token, user, navigate]);

  // Cartes des différents types d'utilisateurs
  const userTypes = [
    {
      type: 'student',
      title: 'Étudiant',
      description: 'Trouvez des opportunités d\'emploi, de stage et de mentorat pour développer votre carrière.',
      icon: <PersonIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: 'linear-gradient(135deg, #1E88E5 0%, #64B5F6 100%)',
      action: 'Trouver des opportunités',
      path: '/register?type=student'
    },
    {
      type: 'university',
      title: 'Établissement',
      description: 'Connectez votre établissement avec des entreprises et suivez le parcours de vos étudiants.',
      icon: <SchoolIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: 'linear-gradient(135deg, #FF6D00 0%, #FFAB40 100%)',
      action: 'Rejoindre la plateforme',
      path: '/register?type=university'
    },
    {
      type: 'company',
      title: 'Entreprise',
      description: 'Recrutez les meilleurs talents et collaborez avec les établissements d\'enseignement.',
      icon: <BusinessIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: 'linear-gradient(135deg, #00C853 0%, #69F0AE 100%)',
      action: 'Recruter des talents',
      path: '/register?type=company'
    },
    {
      type: 'mentor',
      title: 'Mentor',
      description: 'Partagez votre expérience et guidez les étudiants dans leur développement professionnel.',
      icon: <MentorIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      color: 'linear-gradient(135deg, #00B0FF 0%, #80D8FF 100%)',
      action: 'Devenir mentor',
      path: '/register?type=mentor'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%)',
      pt: 4, 
      pb: 8 
    }}>
      {/* Section Hero */}
      <AnimatedSection delay={0}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <AnimatedTitle variant="h2" component="h1" gutterBottom sx={{ 
                  fontWeight: 800,
                  color: theme.palette.primary.dark,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}>
                  Campus Connect Sénégal
                </AnimatedTitle>
                
                <Typography variant="h5" color="text.secondary" paragraph sx={{ 
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.5
                }}>
                  La plateforme qui connecte les étudiants, les établissements et les entreprises pour créer des opportunités professionnelles au Sénégal.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <AnimatedButton 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      background: 'linear-gradient(45deg, #1E88E5 30%, #00B0FF 90%)',
                      color: 'white',
                    }}
                  >
                    Rejoindre maintenant
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/about')}
                    sx={{ 
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    }}
                  >
                    En savoir plus
                  </AnimatedButton>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'relative',
                height: { xs: '300px', md: '400px' },
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(0,176,255,0.2) 0%, rgba(30,136,229,0.4) 100%)',
                  zIndex: 1
                },
                ...animations.fadeIn,
                animationDuration: '1s',
              }}>
                <Box 
                  component="img"
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
                  alt="Étudiants sénégalais"
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </AnimatedSection>
      
      {/* Section des statistiques */}
      <AnimatedSection delay={1}>
        <Container maxWidth="lg">
          <Box sx={{ 
            py: 5, 
            px: { xs: 2, md: 5 },
            mb: 8,
            borderRadius: theme.shape.borderRadius * 2,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 4
          }}>
            {[
              { value: '5,000+', label: 'Étudiants', color: theme.palette.primary.main },
              { value: '200+', label: 'Entreprises', color: theme.palette.success.main },
              { value: '50+', label: 'Établissements', color: theme.palette.secondary.main },
              { value: '1,000+', label: 'Offres d\'emploi', color: theme.palette.info.main }
            ].map((stat, index) => (
              <Box key={index} sx={{ 
                textAlign: 'center',
                ...animations.fadeIn,
                animationDelay: `${0.2 + index * 0.1}s`,
                animationDuration: '0.8s',
              }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  color: stat.color,
                  mb: 1,
                  ...animations.pulse,
                  animationDuration: '2s',
                  animationDelay: `${index * 0.2}s`,
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </AnimatedSection>
      
      {/* Section des types d'utilisateurs */}
      <AnimatedSection delay={2}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <AnimatedTitle variant="h3" component="h2" gutterBottom sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              display: 'inline-block'
            }}>
              Rejoignez Campus Connect
            </AnimatedTitle>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              Choisissez votre profil et commencez à explorer les opportunités
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {userTypes.map((userType, index) => (
              <Grid item xs={12} sm={6} md={3} key={userType.type}>
                <AnimatedCard sx={{ 
                  animationDelay: `${0.3 + index * 0.1}s`,
                }}>
                  <Box sx={{ 
                    height: 120, 
                    background: userType.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      ...animations.pulse,
                      animationDuration: '3s',
                      animationDelay: `${index * 0.2}s`,
                    }}>
                      {userType.icon}
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {userType.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                      {userType.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      size="large"
                      onClick={() => navigate(userType.path)}
                      sx={{ 
                        background: userType.color,
                        color: 'white',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      {userType.action}
                    </Button>
                  </CardActions>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </AnimatedSection>
      
      {/* Section des fonctionnalités */}
      <AnimatedSection delay={3}>
        <Container maxWidth="lg" sx={{ mt: 10 }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <AnimatedTitle variant="h3" component="h2" gutterBottom sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              display: 'inline-block'
            }}>
              Nos fonctionnalités
            </AnimatedTitle>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              Découvrez tout ce que Campus Connect peut faire pour vous
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              {
                title: 'Recommandations d\'emploi IA',
                description: 'Notre système d\'IA analyse votre profil et vous propose des offres d\'emploi parfaitement adaptées à vos compétences et aspirations.',
                icon: '🤖',
                color: 'linear-gradient(135deg, #1E88E5 0%, #64B5F6 100%)'
              },
              {
                title: 'Mentorat personnalisé',
                description: 'Connectez-vous avec des professionnels expérimentés qui vous guideront dans votre parcours professionnel.',
                icon: '🧠',
                color: 'linear-gradient(135deg, #FF6D00 0%, #FFAB40 100%)'
              },
              {
                title: 'Événements et formations',
                description: 'Participez à des événements, webinaires et formations pour développer vos compétences et élargir votre réseau.',
                icon: '📅',
                color: 'linear-gradient(135deg, #00C853 0%, #69F0AE 100%)'
              },
              {
                title: 'Recrutement simplifié',
                description: 'Pour les entreprises, un processus de recrutement optimisé pour trouver les meilleurs talents sénégalais.',
                icon: '🔍',
                color: 'linear-gradient(135deg, #00B0FF 0%, #80D8FF 100%)'
              },
              {
                title: 'Suivi des anciens étudiants',
                description: 'Les établissements peuvent suivre le parcours professionnel de leurs diplômés et mesurer leur impact.',
                icon: '📊',
                color: 'linear-gradient(135deg, #D500F9 0%, #EA80FC 100%)'
              },
              {
                title: 'Groupes de discussion',
                description: 'Échangez avec d\'autres membres de la communauté sur des sujets professionnels et académiques.',
                icon: '💬',
                color: 'linear-gradient(135deg, #FFD600 0%, #FFEA00 100%)'
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: theme.shape.borderRadius * 1.5,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: feature.color,
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
                  },
                  ...animations.fadeIn,
                  animationDuration: '0.8s',
                  animationDelay: `${0.4 + index * 0.1}s`,
                }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '12px', 
                    background: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    ...animations.pulse,
                    animationDuration: '3s',
                    animationDelay: `${index * 0.2}s`,
                  }}>
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </AnimatedSection>
      
      {/* Section d'appel à l'action */}
      <AnimatedSection delay={4}>
        <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
          <Paper sx={{ 
            p: { xs: 4, md: 6 },
            borderRadius: theme.shape.borderRadius * 2,
            background: 'linear-gradient(135deg, #1E88E5 0%, #00B0FF 100%)',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 15px 50px rgba(30, 136, 229, 0.3)',
            ...animations.fadeIn,
            animationDuration: '1s',
          }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ 
              fontWeight: 800,
              mb: 3,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              Prêt à démarrer votre aventure ?
            </Typography>
            
            <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9, maxWidth: '700px', mx: 'auto' }}>
              Rejoignez Campus Connect dès aujourd'hui et accédez à un monde d'opportunités professionnelles au Sénégal.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <AnimatedButton 
                variant="contained" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'white',
                  }
                }}
              >
                S'inscrire gratuitement
              </AnimatedButton>
              
              <AnimatedButton 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Se connecter
              </AnimatedButton>
            </Box>
          </Paper>
        </Container>
      </AnimatedSection>
    </Box>
  );
};

export default Home;
