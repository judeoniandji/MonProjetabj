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
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Jobs = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);

  // Simuler le chargement des offres d'emploi
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setJobs([
        {
          id: 1,
          title: 'Développeur Full Stack',
          company: 'TechCorp',
          location: 'Paris',
          type: 'CDI',
          description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe.',
          skills: ['React', 'Node.js', 'MongoDB', 'Express'],
          date: '2025-03-20'
        },
        {
          id: 2,
          title: 'Data Scientist',
          company: 'DataAnalytics',
          location: 'Lyon',
          type: 'CDI',
          description: 'Poste de Data Scientist pour travailler sur des projets d\'IA et de machine learning.',
          skills: ['Python', 'TensorFlow', 'SQL', 'Data Visualization'],
          date: '2025-03-19'
        },
        {
          id: 3,
          title: 'UX/UI Designer',
          company: 'DesignStudio',
          location: 'Bordeaux',
          type: 'Freelance',
          description: 'Nous cherchons un designer UX/UI pour améliorer l\'expérience utilisateur de nos applications.',
          skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
          date: '2025-03-18'
        },
        {
          id: 4,
          title: 'Développeur Mobile',
          company: 'MobileApps',
          location: 'Marseille',
          type: 'Stage',
          description: 'Stage de développement d\'applications mobiles pour iOS et Android.',
          skills: ['Swift', 'Kotlin', 'Flutter', 'React Native'],
          date: '2025-03-17'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrer les offres d'emploi en fonction du terme de recherche
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Offres d'emploi et stages
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par titre, entreprise, lieu ou compétence"
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
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {filteredJobs.length} offres disponibles
          </Typography>
          
          <Grid container spacing={3}>
            {filteredJobs.map(job => (
              <Grid item xs={12} key={job.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Chip 
                          label={`Publié le ${new Date(job.date).toLocaleDateString()}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" paragraph>
                      {job.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {job.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Voir les détails
                    </Button>
                    <Button size="small" variant="contained" color="primary">
                      Postuler
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {filteredJobs.length === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                Aucune offre ne correspond à votre recherche
              </Typography>
              <Typography variant="body1">
                Essayez d'autres termes de recherche ou consultez toutes les offres disponibles.
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Jobs;
