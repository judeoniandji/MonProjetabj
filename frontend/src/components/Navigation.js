import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Work as WorkIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Notifications from './Notifications';

function Navigation() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          CampusConnect
        </Typography>

        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={() => navigate('/jobs')}
                title="Offres d'emploi"
              >
                <WorkIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => navigate('/events')}
                title="Événements"
              >
                <EventIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => navigate('/messages')}
                title="Messages"
              >
                <MessageIcon />
              </IconButton>
              <Notifications />
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar
                  src={user.avatar_url}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.name[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigate('/profile')}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Mon profil
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/settings')}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  Paramètres
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/logout')}>
                  Déconnexion
                </MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Connexion
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/register')}
            >
              Inscription
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;