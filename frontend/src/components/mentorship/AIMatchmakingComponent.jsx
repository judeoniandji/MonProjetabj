import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Chip, 
  CircularProgress, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MatchIcon from '@mui/icons-material/Handshake';
import FilterListIcon from '@mui/icons-material/FilterList';
import { STUDY_FIELDS, TECHNICAL_SKILLS } from '../../constants/formOptions';

// Style pour les cartes de profil
const ProfileCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const MatchScore = styled(Box)(({ theme, score }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: score > 80 ? theme.palette.success.main : 
                  score > 60 ? theme.palette.warning.main : 
                  theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

/**
 * Composant pour le matchmaking IA entre mentors et étudiants
 */
const AIMatchmakingComponent = () => {
  // État pour les mentors suggérés
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // État pour les filtres
  const [filters, setFilters] = useState({
    minMatchScore: 50,
    fieldOfStudy: '',
    skillFocus: []
  });
  
  // État pour le contrôle de l'UI
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Charger l'utilisateur actuel depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Simuler le chargement des correspondances suggérées
  useEffect(() => {
    if (currentUser) {
      fetchSuggestedMatches();
    }
  }, [currentUser, filters]);

  // Fonction pour récupérer les correspondances suggérées
  const fetchSuggestedMatches = () => {
    setLoading(true);
    setError('');
    
    // Simuler un appel API avec un délai
    setTimeout(() => {
      try {
        // Dans une implémentation réelle, ceci serait un appel API
        // qui enverrait les données de profil de l'utilisateur et recevrait des correspondances
        const mockMatches = generateMockMatches();
        
        // Filtrer les correspondances en fonction des critères
        const filteredMatches = mockMatches.filter(match => {
          // Filtre par score minimum
          if (match.matchScore < filters.minMatchScore) {
            return false;
          }
          
          // Filtre par domaine d'études
          if (filters.fieldOfStudy && match.fieldOfStudy?.id !== filters.fieldOfStudy) {
            return false;
          }
          
          // Filtre par compétences
          if (filters.skillFocus.length > 0) {
            const hasRequiredSkill = match.skills.some(skill => 
              filters.skillFocus.includes(skill.id)
            );
            if (!hasRequiredSkill) {
              return false;
            }
          }
          
          return true;
        });
        
        setSuggestedMatches(filteredMatches);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des correspondances suggérées');
        setLoading(false);
      }
    }, 1500);
  };

  // Fonction pour générer des correspondances fictives
  const generateMockMatches = () => {
    // Dans une implémentation réelle, ces données viendraient de l'API
    const userType = currentUser.userType;
    
    if (userType === 'student') {
      // Générer des mentors suggérés pour un étudiant
      return [
        {
          id: 1,
          name: 'Jean Dupont',
          userType: 'mentor',
          expertise: STUDY_FIELDS.find(field => field.id === 'computer_science'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'javascript'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'react'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'node_js')
          ],
          experience: '10 ans d\'expérience en développement web',
          availabilityHours: 'Lundi et Mercredi, 18h-20h',
          matchScore: 85,
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'computer_science')
        },
        {
          id: 2,
          name: 'Marie Martin',
          userType: 'mentor',
          expertise: STUDY_FIELDS.find(field => field.id === 'data_science'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'python'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'machine_learning'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'data_analysis')
          ],
          experience: '8 ans d\'expérience en science des données',
          availabilityHours: 'Mardi et Jeudi, 19h-21h',
          matchScore: 75,
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'data_science')
        },
        {
          id: 3,
          name: 'Pierre Leroy',
          userType: 'mentor',
          expertise: STUDY_FIELDS.find(field => field.id === 'software_engineering'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'java'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'spring'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'microservices')
          ],
          experience: '12 ans d\'expérience en architecture logicielle',
          availabilityHours: 'Vendredi, 17h-20h',
          matchScore: 65,
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'software_engineering')
        },
        {
          id: 4,
          name: 'Sophie Bernard',
          userType: 'mentor',
          expertise: STUDY_FIELDS.find(field => field.id === 'ux_design'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'ui_design'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'user_research'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'figma')
          ],
          experience: '7 ans d\'expérience en conception UX/UI',
          availabilityHours: 'Samedi, 10h-12h',
          matchScore: 55,
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'ux_design')
        }
      ];
    } else if (userType === 'mentor') {
      // Générer des étudiants suggérés pour un mentor
      return [
        {
          id: 1,
          name: 'Lucas Petit',
          userType: 'student',
          school: { name: 'Université Paris-Saclay' },
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'computer_science'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'javascript'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'html_css')
          ],
          interests: [
            STUDY_FIELDS.find(field => field.id === 'web_development'),
            STUDY_FIELDS.find(field => field.id === 'mobile_development')
          ],
          careerGoals: 'Devenir développeur full-stack',
          matchScore: 90
        },
        {
          id: 2,
          name: 'Emma Durand',
          userType: 'student',
          school: { name: 'École Polytechnique' },
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'data_science'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'python'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'r_programming')
          ],
          interests: [
            STUDY_FIELDS.find(field => field.id === 'artificial_intelligence'),
            STUDY_FIELDS.find(field => field.id === 'big_data')
          ],
          careerGoals: 'Travailler dans la recherche en IA',
          matchScore: 80
        },
        {
          id: 3,
          name: 'Thomas Moreau',
          userType: 'student',
          school: { name: 'EPITA' },
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'software_engineering'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'java'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'c_plus_plus')
          ],
          interests: [
            STUDY_FIELDS.find(field => field.id === 'game_development'),
            STUDY_FIELDS.find(field => field.id === 'cybersecurity')
          ],
          careerGoals: 'Développer des jeux vidéo',
          matchScore: 70
        },
        {
          id: 4,
          name: 'Camille Roux',
          userType: 'student',
          school: { name: 'Gobelins' },
          fieldOfStudy: STUDY_FIELDS.find(field => field.id === 'ux_design'),
          skills: [
            TECHNICAL_SKILLS.find(skill => skill.id === 'ui_design'),
            TECHNICAL_SKILLS.find(skill => skill.id === 'figma')
          ],
          interests: [
            STUDY_FIELDS.find(field => field.id === 'graphic_design'),
            STUDY_FIELDS.find(field => field.id === 'motion_design')
          ],
          careerGoals: 'Travailler comme UX Designer dans une startup',
          matchScore: 60
        }
      ];
    }
    
    return [];
  };

  // Gérer les changements dans les filtres
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Gérer la demande de mentorat
  const handleRequestMatch = (matchId) => {
    // Dans une implémentation réelle, ceci enverrait une requête à l'API
    alert(`Demande envoyée à l'utilisateur #${matchId}`);
  };

  // Rendu des filtres
  const renderFilters = () => {
    return (
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Affiner les correspondances
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Score de correspondance minimum</Typography>
            <Slider
              value={filters.minMatchScore}
              onChange={(e, newValue) => handleFilterChange('minMatchScore', newValue)}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={0}
              max={100}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Domaine d'études</InputLabel>
              <Select
                value={filters.fieldOfStudy}
                onChange={(e) => handleFilterChange('fieldOfStudy', e.target.value)}
                label="Domaine d'études"
              >
                <MenuItem value="">Tous les domaines</MenuItem>
                {STUDY_FIELDS.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Compétences clés</InputLabel>
              <Select
                multiple
                value={filters.skillFocus}
                onChange={(e) => handleFilterChange('skillFocus', e.target.value)}
                label="Compétences clés"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const skill = TECHNICAL_SKILLS.find(s => s.id === value);
                      return <Chip key={value} label={skill ? skill.name : value} />;
                    })}
                  </Box>
                )}
              >
                {TECHNICAL_SKILLS.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => fetchSuggestedMatches()}
          >
            Appliquer les filtres
          </Button>
        </Box>
      </Paper>
    );
  };

  // Rendu des cartes de profil pour les correspondances
  const renderMatchCards = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (suggestedMatches.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucune correspondance trouvée avec les critères actuels. Essayez d'ajuster vos filtres.
        </Alert>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {suggestedMatches.map((match) => (
          <Grid item xs={12} sm={6} md={4} key={match.id}>
            <ProfileCard>
              <MatchScore score={match.matchScore}>
                {match.matchScore}%
              </MatchScore>
              
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {match.name}
                </Typography>
                
                {match.userType === 'mentor' ? (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Expertise:</strong> {match.expertise?.name || 'Non spécifiée'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Expérience:</strong> {match.experience || 'Non spécifiée'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Disponibilité:</strong> {match.availabilityHours || 'Non spécifiée'}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>École:</strong> {match.school?.name || 'Non spécifiée'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Domaine d'études:</strong> {match.fieldOfStudy?.name || 'Non spécifié'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Objectifs:</strong> {match.careerGoals || 'Non spécifiés'}
                    </Typography>
                  </>
                )}
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography variant="body2" gutterBottom>
                  <strong>Compétences:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                  {match.skills.map((skill, index) => (
                    <SkillChip 
                      key={index} 
                      label={skill?.name || 'Compétence'} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                {match.interests && (
                  <>
                    <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
                      <strong>Centres d'intérêt:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                      {match.interests.map((interest, index) => (
                        <SkillChip 
                          key={index} 
                          label={interest?.name || 'Intérêt'} 
                          size="small" 
                          variant="outlined"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleRequestMatch(match.id)}
                >
                  {currentUser?.userType === 'student' ? 'Demander ce mentor' : 'Proposer mentorat'}
                </Button>
              </CardContent>
            </ProfileCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Si aucun utilisateur n'est connecté
  if (!currentUser) {
    return (
      <Alert severity="warning">
        Veuillez vous connecter pour accéder au matchmaking IA.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <MatchIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Matchmaking IA
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Notre algorithme d'intelligence artificielle analyse les profils et suggère des correspondances 
        optimales entre mentors et étudiants en fonction des domaines d'expertise, des compétences 
        techniques et des objectifs de carrière.
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>
      </Box>
      
      {showFilters && renderFilters()}
      
      {renderMatchCards()}
    </Box>
  );
};

export default AIMatchmakingComponent;
