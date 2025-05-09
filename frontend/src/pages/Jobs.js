import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/slices/jobsSlice';

function Jobs() {
  const dispatch = useDispatch();
  const { jobs, loading, error, totalPages, currentPage } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchJobs({
      page: currentPage,
      search,
      jobType,
      location,
    }));
  }, [dispatch, currentPage, search, jobType, location]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Offres d'emploi
      </Typography>

      {/* Filtres */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Rechercher"
              value={search}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Type de contrat</InputLabel>
              <Select
                value={jobType}
                label="Type de contrat"
                onChange={handleJobTypeChange}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="stage">Stage</MenuItem>
                <MenuItem value="alternance">Alternance</MenuItem>
                <MenuItem value="cdd">CDD</MenuItem>
                <MenuItem value="cdi">CDI</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Localisation"
              value={location}
              onChange={handleLocationChange}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Liste des offres */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {job.company}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={job.type}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={job.location}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" paragraph>
                    {job.description}
                  </Typography>
                  {job.salary && (
                    <Typography variant="body2" color="text.secondary">
                      Salaire : {job.salary}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Voir l'offre
                  </Button>
                  <Button size="small" color="primary">
                    Postuler
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={currentPage === 1}
            onClick={() => dispatch(fetchJobs({ page: currentPage - 1 }))}
          >
            Précédent
          </Button>
          <Typography sx={{ mx: 2, py: 1 }}>
            Page {currentPage} sur {totalPages}
          </Typography>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => dispatch(fetchJobs({ page: currentPage + 1 }))}
          >
            Suivant
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default Jobs; 