import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState([
    {
      id: 1,
      type: 'job',
      title: 'Nouvelle offre d\'emploi',
      message: 'Une nouvelle offre de stage en développement web a été publiée',
      date: '2024-03-20T10:30:00',
      read: false,
    },
    {
      id: 2,
      type: 'event',
      title: 'Rappel d\'événement',
      message: 'Le workshop React commence dans 1 heure',
      date: '2024-03-20T09:00:00',
      read: false,
    },
    {
      id: 3,
      type: 'message',
      title: 'Nouveau message',
      message: 'Jean Dupont vous a envoyé un message',
      date: '2024-03-19T15:45:00',
      read: true,
    },
    {
      id: 4,
      type: 'application',
      title: 'Candidature acceptée',
      message: 'Votre candidature pour le poste de développeur a été acceptée',
      date: '2024-03-18T14:20:00',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    switch (notification.type) {
      case 'job':
        navigate('/jobs');
        break;
      case 'event':
        navigate('/events');
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'application':
        navigate('/applications');
        break;
      default:
        break;
    }
    handleClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job':
        return <WorkIcon />;
      case 'event':
        return <EventIcon />;
      case 'message':
        return <MessageIcon />;
      case 'application':
        return <CheckCircleIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        title="Notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 'calc(100vh - 100px)',
            width: 320,
            maxWidth: '100%',
            overflow: 'auto',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" color="primary">
              Tout marquer comme lu
            </Button>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="Aucune notification" />
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <MenuItem
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      {notification.message}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(notification.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </>
                  }
                />
              </MenuItem>
              <Divider />
            </React.Fragment>
          ))
        )}
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Button size="small" color="primary">
            Voir toutes les notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default Notifications; 