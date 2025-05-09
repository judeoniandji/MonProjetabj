import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import discussionGroupService from '../../services/discussionGroupService';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

// Style pour le papier du formulaire
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #1E88E5, #00B0FF, #00C853)',
  }
}));

// Style pour le titre du groupe
const GroupTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 'bold',
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -5,
    left: 0,
    width: '40%',
    height: '3px',
    background: theme.palette.secondary.main,
    borderRadius: '2px',
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
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
    boxShadow: '0 7px 14px rgba(0, 0, 0, 0.15)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
  }
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      boxShadow: '0 6px 16px rgba(30, 136, 229, 0.15)',
    }
  }
}));

const JoinGroupForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [group, setGroup] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Charger les informations du groupe
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        setLoading(true);
        const groupData = await discussionGroupService.getGroupById(groupId);
        setGroup(groupData);
        setError(null);
        
        // Si le groupe n'est pas privé, rejoindre automatiquement
        if (!groupData.is_private) {
          handleJoinGroup();
        }
      } catch (err) {
        console.error('Erreur lors du chargement des informations du groupe:', err);
        setError('Impossible de charger les informations du groupe. Veuillez vérifier le lien et réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    if (groupId) {
      fetchGroupInfo();
    }
  }, [groupId]);
  
  // Gestionnaire pour rejoindre le groupe
  const handleJoinGroup = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setJoining(true);
      await discussionGroupService.joinGroup(groupId, group?.is_private ? accessCode : null);
      setSuccess(true);
      setError(null);
      
      // Rediriger vers la page du groupe après 2 secondes
      setTimeout(() => {
        navigate(`/discussion-groups/${groupId}`);
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la tentative de rejoindre le groupe:', err);
      setError(err.response?.data?.message || 'Impossible de rejoindre le groupe. Veuillez vérifier le code d\'accès et réessayer.');
    } finally {
      setJoining(false);
    }
  };
  
  // Gestionnaire pour le changement de code d'accès
  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress color="primary" size={60} thickness={4} />
      </Box>
    );
  }
  
  if (error && !group) {
    return (
      <Box sx={{ p: 3, maxWidth: '600px', mx: 'auto' }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
            '& .MuiAlert-icon': { color: theme.palette.error.main }
          }}
        >
          {error}
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <AnimatedButton 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/discussion-groups')}
            sx={{ 
              background: 'linear-gradient(45deg, #1E88E5 30%, #00B0FF 90%)',
              boxShadow: '0 3px 10px rgba(30, 136, 229, 0.3)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 5px 15px rgba(30, 136, 229, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Retour aux groupes
          </AnimatedButton>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, maxWidth: '600px', mx: 'auto' }}>
      <StyledPaper>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: theme.palette.primary.dark,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <GroupIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 32 }} />
          Rejoindre le groupe
        </Typography>
        
        {group && (
          <>
            <GroupTitle variant="h5" gutterBottom>
              {group.name}
            </GroupTitle>
            
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                color: theme.palette.text.secondary,
                backgroundColor: 'rgba(0, 176, 255, 0.05)',
                p: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${theme.palette.info.main}`
              }}
            >
              {group.description}
            </Typography>
            
            <Box sx={{ 
              my: 2, 
              p: 1.5, 
              borderRadius: 2,
              backgroundColor: 'rgba(30, 136, 229, 0.05)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 'medium',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Créé par: <span style={{ fontWeight: 'bold', marginLeft: '4px', color: theme.palette.secondary.main }}>{group.creator_name}</span>
              </Typography>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 'medium',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <GroupIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                Membres: <span style={{ fontWeight: 'bold', marginLeft: '4px', color: theme.palette.primary.main }}>{group.member_count}</span>
              </Typography>
            </Box>
            
            <Divider sx={{ 
              my: 2,
              borderColor: 'rgba(0, 0, 0, 0.08)',
              '&::before, &::after': {
                borderColor: 'rgba(0, 0, 0, 0.08)',
              }
            }} />
            
            {success ? (
              <Alert 
                severity="success"
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 200, 83, 0.2)',
                  background: 'linear-gradient(45deg, rgba(0, 200, 83, 0.05) 0%, rgba(105, 240, 174, 0.1) 100%)',
                  '& .MuiAlert-icon': { color: theme.palette.success.main }
                }}
              >
                Vous avez rejoint le groupe avec succès! Redirection en cours...
              </Alert>
            ) : group.is_private ? (
              <form onSubmit={handleJoinGroup}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 109, 0, 0.05)',
                }}>
                  <LockIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body1">
                    Ce groupe est privé. Veuillez entrer le code d'accès pour le rejoindre.
                  </Typography>
                </Box>
                
                <AnimatedTextField
                  fullWidth
                  label="Code d'accès"
                  variant="outlined"
                  value={accessCode}
                  onChange={handleAccessCodeChange}
                  margin="normal"
                  required
                  error={!!error}
                  helperText={error}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.secondary.main,
                        borderWidth: 2
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.secondary.main,
                    }
                  }}
                />
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <AnimatedButton 
                    variant="outlined" 
                    onClick={() => navigate('/discussion-groups')}
                    sx={{
                      borderColor: theme.palette.grey[300],
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        borderColor: theme.palette.grey[400],
                        backgroundColor: 'rgba(0, 0, 0, 0.03)'
                      }
                    }}
                  >
                    Annuler
                  </AnimatedButton>
                  <AnimatedButton 
                    type="submit" 
                    variant="contained" 
                    color="secondary"
                    disabled={joining || !accessCode}
                    sx={{ 
                      background: joining ? '' : 'linear-gradient(45deg, #FF6D00 30%, #FF9E40 90%)',
                      boxShadow: '0 3px 10px rgba(255, 109, 0, 0.3)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(255, 109, 0, 0.4)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {joining ? <CircularProgress size={24} /> : 'Rejoindre'}
                  </AnimatedButton>
                </Box>
              </form>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(0, 200, 83, 0.05)',
                }}>
                  <PublicIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                  <Typography variant="body1">
                    Ce groupe est public et peut être rejoint sans code d'accès.
                  </Typography>
                </Box>
                
                <AnimatedButton 
                  variant="contained" 
                  color="primary"
                  onClick={handleJoinGroup}
                  disabled={joining}
                  sx={{ 
                    background: joining ? '' : 'linear-gradient(45deg, #00C853 30%, #69F0AE 90%)',
                    boxShadow: '0 3px 10px rgba(0, 200, 83, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 5px 15px rgba(0, 200, 83, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {joining ? <CircularProgress size={24} /> : 'Rejoindre le groupe'}
                </AnimatedButton>
              </Box>
            )}
          </>
        )}
      </StyledPaper>
    </Box>
  );
};

export default JoinGroupForm;
