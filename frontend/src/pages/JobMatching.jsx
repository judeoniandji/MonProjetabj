import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import JobMatchingComponent from '../components/jobs/JobMatchingComponent';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Page de mise en relation avec les offres d'emploi
 * Affiche le composant de matchmaking pour les offres d'emploi
 */
const JobMatching = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link component={RouterLink} to="/" color="inherit">
            Accueil
          </Link>
          <Link component={RouterLink} to="/jobs" color="inherit">
            Emplois
          </Link>
          <Typography color="text.primary">Matchmaking</Typography>
        </Breadcrumbs>
      </Box>
      
      <JobMatchingComponent />
    </Container>
  );
};

export default JobMatching;
