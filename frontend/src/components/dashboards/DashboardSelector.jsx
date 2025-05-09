import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Box, Alert } from '@mui/material';

// Import des différents tableaux de bord
import StudentDashboard from './StudentDashboard';
import CompanyDashboard from './CompanyDashboard';
import MentorDashboard from './MentorDashboard';
import UniversityDashboard from './UniversityDashboard';

/**
 * Composant qui sélectionne le tableau de bord approprié en fonction du type d'utilisateur
 */
const DashboardSelector = () => {
  const { user, loading, error } = useSelector(state => state.auth);

  // Afficher un indicateur de chargement si les données utilisateur sont en cours de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Afficher un message d'erreur si le chargement a échoué
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Impossible de charger les données utilisateur. Veuillez vous reconnecter.
        </Alert>
      </Box>
    );
  }

  // Si l'utilisateur n'est pas connecté ou si le type d'utilisateur n'est pas défini
  if (!user || !user.user_type) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Vous devez être connecté pour accéder à votre tableau de bord.
        </Alert>
      </Box>
    );
  }

  // Sélectionner le tableau de bord en fonction du type d'utilisateur
  switch (user.user_type) {
    case 'student':
      return <StudentDashboard />;
    case 'company':
      return <CompanyDashboard />;
    case 'mentor':
      return <MentorDashboard />;
    case 'university':
    case 'school':
      return <UniversityDashboard />;
    default:
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="info">
            Type d'utilisateur non reconnu. Veuillez contacter l'administrateur.
          </Alert>
        </Box>
      );
  }
};

export default DashboardSelector;
