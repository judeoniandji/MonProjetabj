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
  Work as WorkIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  FilterList as FilterListIcon
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

// Composant pour afficher une offre d'emploi
const JobListItem = ({ job, onEdit, onDelete, onView }) => (
  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell component="th" scope="row">
      <Typography variant="subtitle2">{job.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {job.location} • {job.type === 'internship' ? 'Stage' : 'Emploi'}
      </Typography>
    </TableCell>
    <TableCell>
      <Chip 
        label={job.status === 'active' ? 'Active' : 'Inactive'} 
        color={job.status === 'active' ? 'success' : 'default'} 
        size="small" 
      />
    </TableCell>
    <TableCell align="center">
      <Badge badgeContent={job.applications_count} color="primary">
        <PersonIcon color="action" />
      </Badge>
    </TableCell>
    <TableCell>
      {new Date(job.created_at).toLocaleDateString()}
    </TableCell>
    <TableCell>
      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Non définie'}
    </TableCell>
    <TableCell align="right">
      <Tooltip title="Voir les candidatures">
        <IconButton size="small" onClick={() => onView(job.id)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Modifier">
        <IconButton size="small" onClick={() => onEdit(job.id)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton size="small" onClick={() => onDelete(job.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
);

// Composant pour afficher un candidat
const CandidateListItem = ({ candidate, onView }) => (
  <ListItem alignItems="flex-start" sx={{ cursor: 'pointer' }} onClick={() => onView(candidate.id)}>
    <ListItemAvatar>
      <Avatar 
        src={candidate.avatar} 
        alt={candidate.name}
      >
        {!candidate.avatar && candidate.name.charAt(0)}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            {candidate.name}
          </Typography>
          <Chip 
            label={candidate.status === 'pending' ? 'En attente' : 
                  candidate.status === 'reviewing' ? 'En cours d\'examen' :
                  candidate.status === 'interview' ? 'Entretien' :
                  candidate.status === 'accepted' ? 'Accepté' : 'Refusé'} 
            color={candidate.status === 'pending' ? 'warning' : 
                  candidate.status === 'reviewing' ? 'info' :
                  candidate.status === 'interview' ? 'primary' :
                  candidate.status === 'accepted' ? 'success' : 'error'} 
            size="small" 
          />
        </Box>
      }
      secondary={
        <>
          <Typography variant="body2" component="span" color="text.primary">
            {candidate.job_title}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            Candidature reçue le {new Date(candidate.applied_date).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {candidate.skills.map((skill, index) => (
              <Chip key={index} label={skill} size="small" variant="outlined" />
            ))}
          </Box>
        </>
      }
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="voir" onClick={() => onView(candidate.id)}>
        <ArrowForwardIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    events: 0,
    messages: 0
  });
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
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
          jobs: 5,
          applications: 23,
          events: 2,
          messages: 7
        });
        
        setJobs([
          {
            id: 1,
            title: 'Développeur Full Stack',
            location: 'Paris',
            type: 'job',
            status: 'active',
            applications_count: 12,
            created_at: '2025-03-15',
            deadline: '2025-05-15'
          },
          {
            id: 2,
            title: 'Stage Marketing Digital',
            location: 'Lyon',
            type: 'internship',
            status: 'active',
            applications_count: 8,
            created_at: '2025-03-20',
            deadline: '2025-04-30'
          },
          {
            id: 3,
            title: 'Data Analyst',
            location: 'Toulouse',
            type: 'job',
            status: 'inactive',
            applications_count: 3,
            created_at: '2025-02-10',
            deadline: '2025-03-10'
          }
        ]);
        
        setCandidates([
          {
            id: 1,
            name: 'Jean Dupont',
            avatar: '',
            job_title: 'Développeur Full Stack',
            applied_date: '2025-03-25',
            status: 'reviewing',
            skills: ['JavaScript', 'React', 'Node.js']
          },
          {
            id: 2,
            name: 'Marie Martin',
            avatar: '',
            job_title: 'Développeur Full Stack',
            applied_date: '2025-03-23',
            status: 'interview',
            skills: ['JavaScript', 'Angular', 'Java']
          },
          {
            id: 3,
            name: 'Thomas Bernard',
            avatar: '',
            job_title: 'Stage Marketing Digital',
            applied_date: '2025-03-22',
            status: 'pending',
            skills: ['Marketing Digital', 'Réseaux Sociaux', 'SEO']
          },
          {
            id: 4,
            name: 'Sophie Leroy',
            avatar: '',
            job_title: 'Stage Marketing Digital',
            applied_date: '2025-03-21',
            status: 'accepted',
            skills: ['Marketing Digital', 'Google Analytics', 'Content Marketing']
          },
          {
            id: 5,
            name: 'Lucas Petit',
            avatar: '',
            job_title: 'Data Analyst',
            applied_date: '2025-03-05',
            status: 'rejected',
            skills: ['Python', 'SQL', 'Tableau']
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
  
  // Gestionnaire pour créer une nouvelle offre
  const handleCreateJob = () => {
    navigate('/jobs/create');
  };
  
  // Gestionnaire pour modifier une offre
  const handleEditJob = (jobId) => {
    navigate(`/jobs/edit/${jobId}`);
  };
  
  // Gestionnaire pour supprimer une offre
  const handleDeleteJob = (jobId) => {
    // Logique de suppression à implémenter
    console.log(`Supprimer l'offre ${jobId}`);
  };
  
  // Gestionnaire pour voir les candidatures d'une offre
  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}/applications`);
  };
  
  // Gestionnaire pour voir un candidat
  const handleViewCandidate = (candidateId) => {
    navigate(`/applications/${candidateId}`);
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
        Bonjour, {user?.name || 'Entreprise'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Bienvenue sur votre tableau de bord. Gérez vos offres d'emploi et de stage, consultez les candidatures et organisez vos événements.
      </Typography>
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<WorkIcon />} 
            title="Offres actives" 
            value={stats.jobs} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PersonIcon />} 
            title="Candidatures" 
            value={stats.applications} 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<EventIcon />} 
            title="Événements" 
            value={stats.events} 
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<MessageIcon />} 
            title="Messages" 
            value={stats.messages} 
            color="success"
          />
        </Grid>
      </Grid>
      
      {/* Contenu principal */}
      <Grid container spacing={3}>
        {/* Colonne de gauche */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 0, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                Vos offres d'emploi et de stage
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleCreateJob}
              >
                Nouvelle offre
              </Button>
            </Box>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="table des offres">
                <TableHead>
                  <TableRow>
                    <TableCell>Titre</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="center">Candidatures</TableCell>
                    <TableCell>Date de création</TableCell>
                    <TableCell>Date limite</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <JobListItem 
                      key={job.id} 
                      job={job} 
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                      onView={handleViewJob}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {jobs.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Vous n'avez pas encore créé d'offres d'emploi ou de stage.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleCreateJob}
                  sx={{ mt: 2 }}
                >
                  Créer votre première offre
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Colonne de droite */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Candidatures récentes
              </Typography>
              <IconButton size="small">
                <FilterListIcon />
              </IconButton>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {candidates.slice(0, 3).map((candidate, index) => (
                <React.Fragment key={candidate.id}>
                  <CandidateListItem 
                    candidate={candidate} 
                    onView={handleViewCandidate}
                  />
                  {index < 2 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
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
                  secondary="Forum, webinaire, session de recrutement..."
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
              
              <ListItem button onClick={() => navigate('/company/profile')}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <EditIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Modifier votre profil" 
                  secondary="Mettre à jour les informations de votre entreprise"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyDashboard;
