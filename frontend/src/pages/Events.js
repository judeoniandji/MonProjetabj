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
import { fetchEvents } from '../store/slices/eventsSlice';

function Events() {
  const dispatch = useDispatch();
  const { events, loading, error, totalPages, currentPage } = useSelector((state) => state.events);
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('');
  const [format, setFormat] = useState('');

  useEffect(() => {
    dispatch(fetchEvents({
      page: currentPage,
      search,
      type: eventType,
      format,
    }));
  }, [dispatch, currentPage, search, eventType, format]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
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
        Événements
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
              <InputLabel>Type d'événement</InputLabel>
              <Select
                value={eventType}
                label="Type d'événement"
                onChange={handleEventTypeChange}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="workshop">Workshop</MenuItem>
                <MenuItem value="conference">Conférence</MenuItem>
                <MenuItem value="hackathon">Hackathon</MenuItem>
                <MenuItem value="networking">Networking</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={format}
                label="Format"
                onChange={handleFormatChange}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="online">En ligne</MenuItem>
                <MenuItem value="in-person">En présentiel</MenuItem>
                <MenuItem value="hybrid">Hybride</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Liste des événements */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {event.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.format === 'online' ? 'En ligne' : event.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Organisé par {event.organizer.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={event.type} color="primary" size="small" />
                    <Chip label={event.format} size="small" />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Voir l'événement
                  </Button>
                  <Button size="small" color="primary">
                    S'inscrire
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
            onClick={() => dispatch(fetchEvents({ page: currentPage - 1 }))}
          >
            Précédent
          </Button>
          <Typography sx={{ mx: 2, py: 1 }}>
            Page {currentPage} sur {totalPages}
          </Typography>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => dispatch(fetchEvents({ page: currentPage + 1 }))}
          >
            Suivant
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default Events; 