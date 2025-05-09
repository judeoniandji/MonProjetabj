import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Events = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // Simuler le chargement des événements
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Forum des métiers du numérique',
          organizer: 'Université Paris-Saclay',
          location: 'Campus de Saclay',
          date: '2025-04-15',
          time: '10:00 - 18:00',
          description: 'Forum annuel des métiers du numérique avec la participation de grandes entreprises du secteur.',
          type: 'Forum',
          image: 'https://source.unsplash.com/random/800x600/?conference'
        },
        {
          id: 2,
          title: 'Atelier CV et Lettre de motivation',
          organizer: 'Campus Connect',
          location: 'En ligne',
          date: '2025-04-20',
          time: '14:00 - 16:00',
          description: 'Apprenez à rédiger un CV et une lettre de motivation efficaces pour augmenter vos chances de décrocher un entretien.',
          type: 'Atelier',
          image: 'https://source.unsplash.com/random/800x600/?workshop'
        },
        {
          id: 3,
          title: 'Conférence Intelligence Artificielle',
          organizer: 'Institut Polytechnique',
          location: 'Amphithéâtre Poincaré',
          date: '2025-05-05',
          time: '18:30 - 20:30',
          description: 'Les dernières avancées en intelligence artificielle et leurs applications dans l\'industrie.',
          type: 'Conférence',
          image: 'https://source.unsplash.com/random/800x600/?artificial-intelligence'
        },
        {
          id: 4,
          title: 'Hackathon Développement Durable',
          organizer: 'GreenTech',
          location: 'Incubateur Station F',
          date: '2025-05-15',
          time: '09:00 - 23:00',
          description: 'Développez des solutions innovantes pour répondre aux défis environnementaux actuels.',
          type: 'Hackathon',
          image: 'https://source.unsplash.com/random/800x600/?hackathon'
        },
        {
          id: 5,
          title: 'Salon de l\'emploi Tech',
          organizer: 'TechJobs',
          location: 'Palais des Congrès',
          date: '2025-06-10',
          time: '10:00 - 18:00',
          description: 'Plus de 100 entreprises tech à la recherche de nouveaux talents.',
          type: 'Salon',
          image: 'https://source.unsplash.com/random/800x600/?job-fair'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrer les événements en fonction du terme de recherche et de l'onglet sélectionné
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrer par type d'événement selon l'onglet sélectionné
    if (tabValue === 0) return matchesSearch; // Tous les événements
    if (tabValue === 1) return matchesSearch && event.type === 'Forum';
    if (tabValue === 2) return matchesSearch && event.type === 'Atelier';
    if (tabValue === 3) return matchesSearch && event.type === 'Conférence';
    if (tabValue === 4) return matchesSearch && event.type === 'Hackathon';
    if (tabValue === 5) return matchesSearch && event.type === 'Salon';
    
    return matchesSearch;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Événements et rencontres
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par titre, organisateur, lieu ou type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <Button variant="contained" color="primary" sx={{ minWidth: '120px' }}>
            Rechercher
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tous" />
          <Tab label="Forums" />
          <Tab label="Ateliers" />
          <Tab label="Conférences" />
          <Tab label="Hackathons" />
          <Tab label="Salons" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {filteredEvents.length} événements disponibles
          </Typography>
          
          <Grid container spacing={3}>
            {filteredEvents.map(event => (
              <Grid item xs={12} md={6} key={event.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.image}
                    alt={event.title}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Chip 
                        label={event.type} 
                        color="primary" 
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.organizer}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.time}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" paragraph>
                      {event.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {event.participants} participants inscrits
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Voir les détails
                    </Button>
                    <Button size="small" variant="contained" color="primary">
                      S'inscrire
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {filteredEvents.length === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                Aucun événement ne correspond à votre recherche
              </Typography>
              <Typography variant="body1">
                Essayez d'autres termes de recherche ou consultez tous les événements disponibles.
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Events;
