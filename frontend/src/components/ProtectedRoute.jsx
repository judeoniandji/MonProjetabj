import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { setUser } from '../redux/authSlice';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * et vérifier les autorisations basées sur les rôles
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Récupérer l'utilisateur depuis le localStorage si nécessaire
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user && token) {
          const localUser = localStorage.getItem('user');
          if (localUser) {
            try {
              // Mettre à jour le store Redux avec l'utilisateur du localStorage
              const parsedUser = JSON.parse(localUser);
              dispatch(setUser(parsedUser));
              console.log('Utilisateur récupéré du localStorage et mis à jour dans Redux:', parsedUser);
            } catch (error) {
              console.error('Erreur lors de la récupération de l\'utilisateur:', error);
              setAuthError('Erreur d\'authentification. Veuillez vous reconnecter.');
            }
          } else {
            // Si pas d'utilisateur dans le localStorage mais un token existe
            setAuthError('Session expirée. Veuillez vous reconnecter.');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setAuthError('Erreur d\'authentification. Veuillez vous reconnecter.');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [user, token, dispatch]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading || !authChecked) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Vérification de l'authentification...
        </Typography>
      </Box>
    );
  }

  // Afficher une erreur d'authentification si nécessaire
  if (authError) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
          {authError}
        </Alert>
        <Navigate to="/login" state={{ from: location, error: authError }} replace />
      </Box>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location, message: "Vous devez être connecté pour accéder à cette page." }} replace />;
  }

  // Si des rôles sont spécifiés, vérifier si l'utilisateur a le rôle requis
  if (allowedRoles.length > 0 && user) {
    // Gérer le cas où user_type est 'university' mais la route attend 'school'
    const userType = user.user_type || '';
    const hasRequiredRole = allowedRoles.some(role => {
      if (role === 'school' && userType === 'university') {
        return true;
      }
      return role === userType;
    });

    if (!hasRequiredRole) {
      // Rediriger vers une page d'accès refusé ou la page d'accueil
      return <Navigate to="/" state={{ error: "Vous n'avez pas les autorisations nécessaires pour accéder à cette page." }} replace />;
    }
  }

  // Si tout est OK, afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
