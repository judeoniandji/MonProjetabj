import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  SupervisorAccount as MentorIcon,
  AdminPanelSettings as AdminIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Navigation = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const userType = user?.user_type || 'student';
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    // Supprimer les données d'authentification du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Mettre à jour le Redux store (dans une implémentation réelle, utiliser une action logout)
    // dispatch(logout());
    handleProfileMenuClose();
    navigate('/login');
  };
  
  // Définir les liens de navigation en fonction du type d'utilisateur
  const getNavLinks = () => {
    const baseLinks = [
      {
        text: 'Tableau de bord',
        icon: <DashboardIcon />,
        path: `/dashboard`
      },
      {
        text: 'Recherche d\'emploi',
        icon: <WorkIcon />,
        path: '/jobs'
      }
    ];
    
    switch (userType) {
      case 'student':
        return [
          ...baseLinks,
          { text: 'Offres', icon: <WorkIcon />, path: '/student/jobs' },
          { text: 'Matchmaking', icon: <WorkIcon />, path: '/jobs/matching' },
          { text: 'Insights IA', icon: <WorkIcon />, path: '/jobs/insights' },
          { text: 'Événements', icon: <EventIcon />, path: '/student/events' },
          { text: 'Messages', icon: <MessageIcon />, path: '/student/messages' },
          { text: 'Profil', icon: <PersonIcon />, path: '/student/profile' }
        ];
      case 'university':
      case 'school':
        return [
          ...baseLinks,
          { text: 'Événements', icon: <EventIcon />, path: '/school/events' },
          { text: 'Partenaires', icon: <BusinessIcon />, path: '/school/partners' },
          { text: 'Messages', icon: <MessageIcon />, path: '/school/messages' },
          { text: 'Profil', icon: <PersonIcon />, path: '/school/profile' }
        ];
      case 'company':
        return [
          ...baseLinks,
          { text: 'Recrutement', icon: <BusinessIcon />, path: '/company/recruitment' },
          { text: 'Offres', icon: <WorkIcon />, path: '/company/jobs' },
          { text: 'Événements', icon: <EventIcon />, path: '/company/events' },
          { text: 'Messages', icon: <MessageIcon />, path: '/company/messages' },
          { text: 'Profil', icon: <PersonIcon />, path: '/company/profile' }
        ];
      case 'mentor':
        return [
          ...baseLinks,
          { text: 'Sessions', icon: <EventIcon />, path: '/mentor/sessions' },
          { text: 'Étudiants', icon: <SchoolIcon />, path: '/mentor/mentees' },
          { text: 'Matchmaking', icon: <WorkIcon />, path: '/jobs/matching' },
          { text: 'Formation', icon: <SchoolIcon />, path: '/mentor/resources' },
          { text: 'Réseau', icon: <BusinessIcon />, path: '/mentor/network' },
          { text: 'Messages', icon: <MessageIcon />, path: '/mentor/messages' },
          { text: 'Profil', icon: <PersonIcon />, path: '/mentor/profile' }
        ];
      case 'admin':
        return [
          ...baseLinks,
          { text: 'Utilisateurs', icon: <PersonIcon />, path: '/admin/users' },
          { text: 'Événements', icon: <EventIcon />, path: '/admin/events' },
          { text: 'Messages', icon: <MessageIcon />, path: '/admin/messages' }
        ];
      default:
        return baseLinks;
    }
  };
  
  // Icône pour le type d'utilisateur
  const getUserTypeIcon = () => {
    switch (userType) {
      case 'student':
        return <PersonIcon />;
      case 'university':
      case 'school':
        return <SchoolIcon />;
      case 'company':
        return <BusinessIcon />;
      case 'mentor':
        return <MentorIcon />;
      case 'admin':
        return <AdminIcon />;
      default:
        return <PersonIcon />;
    }
  };
  
  // Couleur pour le type d'utilisateur
  const getUserTypeColor = () => {
    switch (userType) {
      case 'student':
        return theme.palette.primary.main;
      case 'university':
      case 'school':
        return theme.palette.secondary.main;
      case 'company':
        return theme.palette.success.main;
      case 'mentor':
        return theme.palette.warning.main;
      case 'admin':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Contenu du tiroir de navigation
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 1, 
            bgcolor: getUserTypeColor() 
          }}
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="h6" noWrap component="div">
          {user?.name || 'Utilisateur'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userType === 'student' ? 'Étudiant' : 
           userType === 'university' ? 'Université' : 
           userType === 'school' ? 'École' : 
           userType === 'company' ? 'Entreprise' : 
           userType === 'mentor' ? 'Mentor' : 
           userType === 'admin' ? 'Administrateur' : 'Utilisateur'}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {getNavLinks().map((link) => (
          <ListItem 
            button 
            key={link.text} 
            component={Link} 
            to={link.path}
            selected={location.pathname === link.path}
            onClick={() => isMobile && setDrawerOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: `${getUserTypeColor()}20`,
                color: getUserTypeColor(),
                '&:hover': {
                  backgroundColor: `${getUserTypeColor()}30`,
                },
                '& .MuiListItemIcon-root': {
                  color: getUserTypeColor(),
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <ListItemIcon>
              {link.icon}
            </ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem 
          button 
          component={Link} 
          to={`/${userType}/settings`}
          selected={location.pathname === `/${userType}/settings`}
          onClick={() => isMobile && setDrawerOpen(false)}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </List>
    </Box>
  );
  
  // Menu latéral pour la navigation mobile
  const mobileDrawer = (
    <Drawer
      variant="temporary"
      open={drawerOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Meilleure performance sur mobile
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: 240,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
          borderRight: `1px solid ${theme.palette.grey[200]}`
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Campus Connect
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/home" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItem>
        
        {/* Options de recherche d'emploi uniquement pour les étudiants */}
        {user && user.user_type === 'student' && (
          <>
            <ListItem button component={Link} to="/jobs" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <WorkIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Offres d'emploi" />
            </ListItem>
            
            <ListItem button component={Link} to="/jobs/matching" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <WorkIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Matching" />
            </ListItem>
            
            <ListItem button component={Link} to="/jobs/insights" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <TrendingUpIcon sx={{ color: theme.palette.info.main }} />
              </ListItemIcon>
              <ListItemText primary="Insights IA" />
            </ListItem>
          </>
        )}
        
        {/* Option de recrutement uniquement pour les entreprises */}
        {user && user.user_type === 'company' && (
          <ListItem button component={Link} to="/company/recruitment" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <BusinessIcon sx={{ color: theme.palette.secondary.main }} />
            </ListItemIcon>
            <ListItemText primary="Recrutement" />
          </ListItem>
        )}
        
        <ListItem button component={Link} to="/mentors" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <MentorIcon sx={{ color: theme.palette.success.main }} />
          </ListItemIcon>
          <ListItemText primary="Mentors" />
        </ListItem>
        
        <ListItem button component={Link} to="/events" onClick={handleDrawerToggle}>
          <ListItemIcon>
            <EventIcon sx={{ color: theme.palette.warning.main }} />
          </ListItemIcon>
          <ListItemText primary="Événements" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
  
  // Notifications fictives
  const notifications = [
    {
      id: 1,
      title: 'Nouveau message',
      content: 'Vous avez reçu un nouveau message de Jean Dupont.',
      time: '10:30'
    },
    {
      id: 2,
      title: 'Événement à venir',
      content: 'Rappel : Forum des métiers demain à 10h.',
      time: 'Hier'
    },
    {
      id: 3,
      title: 'Nouvelle offre',
      content: 'Une nouvelle offre correspond à votre profil.',
      time: 'Lun'
    }
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1E88E5 0%, #00B0FF 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          {token && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Campus Connect
            </Link>
          </Typography>
          
          {token ? (
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              ml: 2,
              '& .MuiButton-root': {
                mx: 0.5,
                color: 'white',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  fontWeight: 600,
                }
              }
            }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/home"
                className={location.pathname === '/home' ? 'active' : ''}
              >
                Accueil
              </Button>
              
              {/* Afficher les liens de recherche d'emploi uniquement pour les étudiants */}
              {user && user.user_type === 'student' && (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/jobs"
                    className={location.pathname === '/jobs' ? 'active' : ''}
                  >
                    Offres d'emploi
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/jobs/matching"
                    className={location.pathname === '/jobs/matching' ? 'active' : ''}
                  >
                    Matching
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/jobs/insights"
                    className={location.pathname === '/jobs/insights' ? 'active' : ''}
                  >
                    Insights IA
                  </Button>
                </>
              )}
              
              {/* Option de recrutement uniquement pour les entreprises */}
              {user && user.user_type === 'company' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/company/recruitment"
                  className={location.pathname === '/company/recruitment' ? 'active' : ''}
                >
                  Recrutement
                </Button>
              )}
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/mentors"
                className={location.pathname === '/mentors' ? 'active' : ''}
              >
                Mentors
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/events"
                className={location.pathname === '/events' ? 'active' : ''}
              >
                Événements
              </Button>
            </Box>
          ) : (
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ mr: 1 }}
              >
                Connexion
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                component={Link} 
                to="/register"
              >
                Inscription
              </Button>
            </Box>
          )}
          
          {token ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: getUserTypeColor() 
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Tiroir de navigation */}
      <Drawer
        variant={isMobile ? 'temporary' : 'temporary'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Meilleure performance sur mobile
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Menu latéral pour la navigation mobile */}
      {mobileDrawer}
      
      {/* Menu du profil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            navigate(`/${userType}/profile`);
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profil</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            navigate(`/${userType}/settings`);
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paramètres</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Déconnexion</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Menu des notifications */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            width: 320, 
            maxHeight: 'calc(100vh - 100px)',
            maxWidth: '100%',
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        {notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem 
                key={notification.id} 
                button 
                divider
                onClick={handleNotificationsClose}
              >
                <ListItemText 
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {notification.content}
                      </Typography>
                      <Typography variant="caption" component="div" color="text.secondary">
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={handleNotificationsClose}>
                Voir toutes les notifications
              </Button>
            </Box>
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2">Aucune notification</Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default Navigation;
