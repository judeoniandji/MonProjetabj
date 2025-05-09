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
  Badge,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Message as MessageIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  VideoCall as VideoCallIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Importer les composants de mentorat
import MentorshipRequests from '../mentorship/MentorshipRequests';
import SessionsList from '../mentorship/SessionsList';
import ActiveMentorships from '../mentorship/ActiveMentorships';
import MentorshipDashboard from '../mentorship/MentorshipDashboard';

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

// Composant pour afficher une session de mentorat
const MentoringSessionItem = ({ session, onView }) => {
  // Formater la date et l'heure
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  const { date, time } = formatDateTime(session.scheduled_at);
  
  // Déterminer si la session est à venir, en cours ou passée
  const now = new Date();
  const sessionDate = new Date(session.scheduled_at);
  const sessionEndDate = new Date(sessionDate.getTime() + session.duration * 60000);
  
  let status = 'upcoming';
  if (now > sessionEndDate) {
    status = 'past';
  } else if (now >= sessionDate && now <= sessionEndDate) {
    status = 'current';
  }
  
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar 
          src={session.student.avatar} 
          alt={session.student.name}
        >
          {!session.student.avatar && session.student.name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              {session.title}
            </Typography>
            <Chip 
              label={status === 'upcoming' ? 'À venir' : status === 'current' ? 'En cours' : 'Terminée'} 
              color={status === 'upcoming' ? 'info' : status === 'current' ? 'success' : 'default'} 
              size="small" 
              icon={status === 'upcoming' ? <ScheduleIcon fontSize="small" /> : status === 'current' ? <VideoCallIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
            />
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2" component="span" color="text.primary">
              {session.student.name}
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary">
              {date} à {time} • {session.duration} minutes
            </Typography>
            {session.topic && (
              <Chip 
                label={session.topic} 
                size="small" 
                variant="outlined" 
                sx={{ mt: 1 }}
              />
            )}
          </>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title={status === 'current' ? 'Rejoindre la session' : 'Voir les détails'}>
          <IconButton edge="end" aria-label="voir" onClick={() => onView(session.id, status)}>
            {status === 'current' ? <VideoCallIcon /> : <ArrowForwardIcon />}
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// Composant pour afficher un étudiant mentoré
const MenteeItem = ({ mentee, onView }) => {
  // Calculer le pourcentage de progression
  const progressPercentage = mentee.progress || 0;
  
  return (
    <ListItem alignItems="flex-start" button onClick={() => onView(mentee.id)}>
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            mentee.online ? (
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  border: '2px solid white'
                }}
              />
            ) : null
          }
        >
          <Avatar 
            src={mentee.avatar} 
            alt={mentee.name}
          >
            {!mentee.avatar && mentee.name.charAt(0)}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1">
            {mentee.name}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" component="div" color="text.secondary">
              {mentee.school} • {mentee.field}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 0.5 }}>
              <Typography variant="body2" component="span" color="text.secondary" sx={{ mr: 1, minWidth: '35px' }}>
                {progressPercentage}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Prochaine session: {mentee.next_session ? new Date(mentee.next_session).toLocaleDateString() : 'Non planifiée'}
              </Typography>
            </Box>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="voir" onClick={(e) => { e.stopPropagation(); onView(mentee.id); }}>
          <ArrowForwardIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// Composant pour afficher une ressource
const ResourceItem = ({ resource, onView }) => (
  <ListItem button onClick={() => onView(resource.id)}>
    <ListItemAvatar>
      <Avatar sx={{ bgcolor: 'primary.main' }}>
        <AssignmentIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={resource.title}
      secondary={
        <>
          <Typography variant="body2" color="text.secondary">
            {resource.type} • Partagé {resource.shared_count} fois
          </Typography>
          <Box sx={{ display: 'flex', mt: 0.5 }}>
            {[...Array(5)].map((_, i) => (
              i < Math.floor(resource.rating) ? 
                <StarIcon key={i} fontSize="small" color="warning" /> : 
                <StarBorderIcon key={i} fontSize="small" color="warning" />
            ))}
          </Box>
        </>
      }
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="voir" onClick={(e) => { e.stopPropagation(); onView(resource.id); }}>
        <VisibilityIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Rendu du tableau de bord
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* En-tête du tableau de bord */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Bienvenue, {user?.name || 'Mentor'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate('/mentor/profile')}
            >
              Modifier mon profil
            </Button>
          </Box>
          <Divider />
        </Grid>
        
        {/* Intégration du tableau de bord de mentorat */}
        <Grid item xs={12}>
          <MentorshipDashboard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MentorDashboard;
