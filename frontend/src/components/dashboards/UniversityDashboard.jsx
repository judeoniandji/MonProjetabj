import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Tooltip
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  FilterList as FilterListIcon,
  Group as GroupIcon,
  Apartment as ApartmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Composant pour afficher les statistiques
const StatCard = ({ icon, title, value, color }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          bgcolor: `${color}.light`, 
          color: `${color}.main`,
          p: 1,
          borderRadius: 1,
          mr: 2
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" align="center" sx={{ fontWeight: 'bold', mt: 2 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

// Composant pour afficher un programme d'études
const ProgramListItem = ({ program, onEdit, onDelete, onView }) => (
  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell component="th" scope="row">
      <Typography variant="subtitle2">{program.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {program.department} • {program.degree}
      </Typography>
    </TableCell>
    <TableCell>
      <Chip 
        label={program.status === 'active' ? 'Actif' : 'Inactif'} 
        color={program.status === 'active' ? 'success' : 'default'} 
        size="small" 
      />
    </TableCell>
    <TableCell align="center">
      <Badge badgeContent={program.students_count} color="primary">
        <PersonIcon color="action" />
      </Badge>
    </TableCell>
    <TableCell align="center">
      <Badge badgeContent={program.applications_count} color="secondary">
        <SchoolIcon color="action" />
      </Badge>
    </TableCell>
    <TableCell align="right">
      <Tooltip title="Voir les détails">
        <IconButton size="small" onClick={() => onView(program.id)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Modifier">
        <IconButton size="small" onClick={() => onEdit(program.id)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton size="small" onClick={() => onDelete(program.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
);

// Composant pour afficher un partenariat
const PartnershipListItem = ({ partnership, onView }) => (
  <ListItem alignItems="flex-start" sx={{ cursor: 'pointer' }} onClick={() => onView(partnership.id)}>
    <ListItemAvatar>
      <Avatar 
        src={partnership.company.logo} 
        alt={partnership.company.name}
        variant="rounded"
      >
        {!partnership.company.logo && partnership.company.name.charAt(0)}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {partnership.company.name}
          </Typography>
          <Chip 
            label={partnership.status === 'active' ? 'Actif' : 
                  partnership.status === 'pending' ? 'En attente' : 'Expiré'} 
            color={partnership.status === 'active' ? 'success' : 
                  partnership.status === 'pending' ? 'warning' : 'default'} 
            size="small" 
          />
        </Box>
      }
      secondary={
        <>
          <Typography variant="body2" component="span" color="text.primary">
            {partnership.type}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {partnership.start_date && `Début: ${new Date(partnership.start_date).toLocaleDateString()}`}
            {partnership.end_date && ` • Fin: ${new Date(partnership.end_date).toLocaleDateString()}`}
          </Typography>
        </>
      }
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="voir" onClick={(e) => { e.stopPropagation(); onView(partnership.id); }}>
        <ArrowForwardIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

// Composant pour afficher un événement
const EventListItem = ({ event, onView }) => (
  <ListItem alignItems="flex-start" sx={{ cursor: 'pointer' }} onClick={() => onView(event.id)}>
    <ListItemAvatar>
      <Avatar 
        sx={{ 
          bgcolor: event.type === 'conference' ? 'primary.main' : 
                  event.type === 'workshop' ? 'secondary.main' : 
                  event.type === 'job_fair' ? 'success.main' : 'info.main'
        }}
      >
        {event.type === 'conference' ? <GroupIcon /> : 
         event.type === 'workshop' ? <SchoolIcon /> : 
         event.type === 'job_fair' ? <BusinessIcon /> : <EventIcon />}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {event.title}
          </Typography>
          <Chip 
            label={new Date(event.date) > new Date() ? 'À venir' : 'Passé'} 
            color={new Date(event.date) > new Date() ? 'primary' : 'default'} 
            size="small" 
            icon={new Date(event.date) > new Date() ? <ScheduleIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
          />
        </Box>
      }
      secondary={
        <>
          <Typography variant="body2" component="div" color="text.secondary">
            {new Date(event.date).toLocaleDateString()} à {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {event.location} • {event.participants_count} participants
          </Typography>
        </>
      }
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="voir" onClick={(e) => { e.stopPropagation(); onView(event.id); }}>
        <ArrowForwardIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const UniversityDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    students: 0,
    programs: 0,
    partnerships: 0,
    events: 0
  });
  const [programs, setPrograms] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        setStats({
          students: 2500,
          programs: 15,
          partnerships: 8,
          events: 6
        });
        
        setPrograms([
          {
            id: 1,
            title: 'Master en Informatique',
            department: 'Sciences et Technologies',
            degree: 'Master',
            status: 'active',
            students_count: 120,
            applications_count: 45
          },
          {
            id: 2,
            title: 'Licence en Économie',
            department: 'Sciences Économiques',
            degree: 'Licence',
            status: 'active',
            students_count: 180,
            applications_count: 32
          },
          {
            id: 3,
            title: 'Master en Marketing Digital',
            department: 'Commerce et Management',
            degree: 'Master',
            status: 'active',
            students_count: 85,
            applications_count: 28
          },
          {
            id: 4,
            title: 'Doctorat en Physique Quantique',
            department: 'Sciences et Technologies',
            degree: 'Doctorat',
            status: 'inactive',
            students_count: 15,
            applications_count: 5
          }
        ]);
        
        setPartnerships([
          {
            id: 1,
            company: {
              id: 101,
              name: 'TechCorp',
              logo: ''
            },
            type: 'Recrutement et stages',
            status: 'active',
            start_date: '2025-01-15',
            end_date: '2026-01-15'
          },
          {
            id: 2,
            company: {
              id: 102,
              name: 'Global Finance',
              logo: ''
            },
            type: 'Recherche et développement',
            status: 'active',
            start_date: '2024-09-01',
            end_date: '2025-08-31'
          },
          {
            id: 3,
            company: {
              id: 103,
              name: 'EcoSolutions',
              logo: ''
            },
            type: 'Financement de bourses',
            status: 'pending',
            start_date: '2025-06-01',
            end_date: '2026-05-31'
          }
        ]);
        
        setEvents([
          {
            id: 1,
            title: 'Forum des métiers',
            type: 'job_fair',
            date: '2025-05-15T10:00:00',
            location: 'Campus principal',
            participants_count: 350
          },
          {
            id: 2,
            title: 'Conférence sur l\'IA',
            type: 'conference',
            date: '2025-04-20T14:30:00',
            location: 'Amphithéâtre A',
            participants_count: 180
          },
          {
            id: 3,
            title: 'Atelier CV et entretien',
            type: 'workshop',
            date: '2025-03-10T09:00:00',
            location: 'Salle B204',
            participants_count: 45
          }
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Gestionnaire pour créer un nouveau programme
  const handleCreateProgram = () => {
    navigate('/programs/create');
  };
  
  // Gestionnaire pour modifier un programme
  const handleEditProgram = (programId) => {
    navigate(`/programs/edit/${programId}`);
  };
  
  // Gestionnaire pour supprimer un programme
  const handleDeleteProgram = (programId) => {
    // Logique de suppression à implémenter
    console.log(`Supprimer le programme ${programId}`);
  };
  
  // Gestionnaire pour voir un programme
  const handleViewProgram = (programId) => {
    navigate(`/programs/${programId}`);
  };
  
  // Gestionnaire pour voir un partenariat
  const handleViewPartnership = (partnershipId) => {
    navigate(`/partnerships/${partnershipId}`);
  };
  
  // Gestionnaire pour voir un événement
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };
  
  // Gestionnaire pour changer d'onglet
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Bonjour, {user?.name || 'Université'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Bienvenue sur votre tableau de bord. Gérez vos programmes d'études, vos partenariats avec les entreprises et vos événements.
      </Typography>
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PersonIcon />} 
            title="Étudiants" 
            value={stats.students} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<SchoolIcon />} 
            title="Programmes" 
            value={stats.programs} 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<BusinessIcon />} 
            title="Partenariats" 
            value={stats.partnerships} 
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<EventIcon />} 
            title="Événements" 
            value={stats.events} 
            color="success"
          />
        </Grid>
      </Grid>
      
      {/* Contenu principal */}
      <Grid container spacing={3}>
        {/* Colonne de gauche */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 0, mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Programmes" />
              <Tab label="Partenariats" />
              <Tab label="Événements" />
            </Tabs>
            
            <Box sx={{ p: 2 }}>
              {activeTab === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Vos programmes d'études
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      onClick={handleCreateProgram}
                    >
                      Nouveau programme
                    </Button>
                  </Box>
                  
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="table des programmes">
                      <TableHead>
                        <TableRow>
                          <TableCell>Titre</TableCell>
                          <TableCell>Statut</TableCell>
                          <TableCell align="center">Étudiants</TableCell>
                          <TableCell align="center">Candidatures</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {programs.map((program) => (
                          <ProgramListItem 
                            key={program.id} 
                            program={program} 
                            onEdit={handleEditProgram}
                            onDelete={handleDeleteProgram}
                            onView={handleViewProgram}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {programs.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        Vous n'avez pas encore créé de programmes d'études.
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={handleCreateProgram}
                        sx={{ mt: 2 }}
                      >
                        Créer votre premier programme
                      </Button>
                    </Box>
                  )}
                </>
              )}
              
              {activeTab === 1 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Vos partenariats avec les entreprises
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/partnerships/create')}
                    >
                      Nouveau partenariat
                    </Button>
                  </Box>
                  
                  <List sx={{ width: '100%' }}>
                    {partnerships.length > 0 ? (
                      partnerships.map((partnership, index) => (
                        <React.Fragment key={partnership.id}>
                          <PartnershipListItem 
                            partnership={partnership} 
                            onView={handleViewPartnership}
                          />
                          {index < partnerships.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          Vous n'avez pas encore de partenariats avec des entreprises.
                        </Typography>
                        <Button 
                          variant="contained" 
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/partnerships/create')}
                          sx={{ mt: 2 }}
                        >
                          Créer votre premier partenariat
                        </Button>
                      </Box>
                    )}
                  </List>
                </>
              )}
              
              {activeTab === 2 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Vos événements
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/events/create')}
                    >
                      Nouvel événement
                    </Button>
                  </Box>
                  
                  <List sx={{ width: '100%' }}>
                    {events.length > 0 ? (
                      events.map((event, index) => (
                        <React.Fragment key={event.id}>
                          <EventListItem 
                            event={event} 
                            onView={handleViewEvent}
                          />
                          {index < events.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          Vous n'avez pas encore créé d'événements.
                        </Typography>
                        <Button 
                          variant="contained" 
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/events/create')}
                          sx={{ mt: 2 }}
                        >
                          Créer votre premier événement
                        </Button>
                      </Box>
                    )}
                  </List>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Colonne de droite */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Candidatures récentes
            </Typography>
            
            <List>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>M</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Marie Dupont"
                  secondary={
                    <>
                      <Typography variant="body2" component="span" color="text.primary">
                        Master en Informatique
                      </Typography>
                      <Typography variant="body2" component="div" color="text.secondary">
                        Candidature reçue le 28/03/2025
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="voir" onClick={() => navigate('/applications/1')}>
                    <ArrowForwardIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>T</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Thomas Martin"
                  secondary={
                    <>
                      <Typography variant="body2" component="span" color="text.primary">
                        Licence en Économie
                      </Typography>
                      <Typography variant="body2" component="div" color="text.secondary">
                        Candidature reçue le 27/03/2025
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="voir" onClick={() => navigate('/applications/2')}>
                    <ArrowForwardIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>S</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Sophie Leroy"
                  secondary={
                    <>
                      <Typography variant="body2" component="span" color="text.primary">
                        Master en Marketing Digital
                      </Typography>
                      <Typography variant="body2" component="div" color="text.secondary">
                        Candidature reçue le 25/03/2025
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="voir" onClick={() => navigate('/applications/3')}>
                    <ArrowForwardIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/applications')}
                endIcon={<ArrowForwardIcon />}
              >
                Voir toutes les candidatures
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actions rapides
            </Typography>
            
            <List>
              <ListItem button onClick={() => navigate('/events/create')}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Organiser un événement" 
                  secondary="Forum, conférence, atelier..."
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem button onClick={() => navigate('/messages')}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <MessageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Messages" 
                  secondary="Consulter vos conversations"
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem button onClick={() => navigate('/partnerships/create')}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <BusinessIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Créer un partenariat" 
                  secondary="Établir une collaboration avec une entreprise"
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem button onClick={() => navigate('/university/profile')}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <EditIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Modifier votre profil" 
                  secondary="Mettre à jour les informations de votre université"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UniversityDashboard;
