import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  Message as MessageIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function Partners() {
  const [partners, setPartners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [note, setNote] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des partenaires
    const mockPartners = [
      {
        id: 1,
        name: 'TechCorp',
        industry: 'Technologie',
        email: 'contact@techcorp.com',
        phone: '+33 1 23 45 67 89',
        location: 'Paris',
        logo: '/path/to/logo1.jpg',
        status: 'active',
        partnershipLevel: 'premium',
        activeInternships: 5,
        totalInternships: 12,
        students: [
          {
            id: 1,
            name: 'Marie Martin',
            position: 'Développeur Frontend',
            startDate: '2024-03-01',
          },
        ],
        events: [
          {
            id: 1,
            title: 'Forum des Métiers',
            date: '2024-04-15',
            type: 'forum',
          },
        ],
      },
      {
        id: 2,
        name: 'Digital Solutions',
        industry: 'Services Numériques',
        email: 'contact@digitalsolutions.com',
        phone: '+33 1 98 76 54 32',
        location: 'Lyon',
        logo: '/path/to/logo2.jpg',
        status: 'active',
        partnershipLevel: 'standard',
        activeInternships: 3,
        totalInternships: 8,
        students: [
          {
            id: 2,
            name: 'Pierre Dubois',
            position: 'Développeur Backend',
            startDate: '2024-02-15',
          },
        ],
        events: [],
      },
    ];
    setPartners(mockPartners);
  }, []);

  const handleOpenDialog = (partner = null) => {
    if (partner) {
      setSelectedPartner(partner);
      setOpenDialog(true);
    } else {
      setSelectedPartner(null);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPartner(null);
    setNote('');
  };

  const handleMenuClick = (event, partner) => {
    setAnchorEl(event.currentTarget);
    setSelectedPartner(partner);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPartner(null);
  };

  const handleAddNote = () => {
    // TODO: Implémenter l'ajout de note
    handleCloseDialog();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPartnershipLevelChip = (level) => {
    const levelConfig = {
      premium: { color: 'primary', label: 'Premium' },
      standard: { color: 'default', label: 'Standard' },
      basic: { color: 'secondary', label: 'Basic' },
    };

    const config = levelConfig[level] || levelConfig.standard;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Partenaires
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter un partenaire
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Tous les partenaires" />
          <Tab label="Premium" />
          <Tab label="Standard" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {partners.map((partner) => (
          <Grid item xs={12} key={partner.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={partner.logo}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {partner.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {partner.industry}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPartnershipLevelChip(partner.partnershipLevel)}
                    <IconButton onClick={(e) => handleMenuClick(e, partner)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {partner.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {partner.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {partner.location}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Stages
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">
                      {partner.activeInternships} stages actifs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      sur {partner.totalInternships} au total
                    </Typography>
                  </Box>
                </Box>

                {partner.students.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Étudiants en stage
                    </Typography>
                    <List>
                      {partner.students.map((student) => (
                        <ListItem key={student.id}>
                          <ListItemText
                            primary={student.name}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {student.position}
                                </Typography>
                                {' • '}
                                <Typography component="span" variant="body2">
                                  Depuis le {formatDate(student.startDate)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {partner.events.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Événements à venir
                    </Typography>
                    <List>
                      {partner.events.map((event) => (
                        <ListItem key={event.id}>
                          <ListItemText
                            primary={event.title}
                            secondary={formatDate(event.date)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<MessageIcon />}
                >
                  Message
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenDialog(partner)}
                >
                  Ajouter une note
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <MessageIcon sx={{ mr: 1 }} /> Envoyer un message
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDialog(selectedPartner);
          handleMenuClose();
        }}>
          <BusinessIcon sx={{ mr: 1 }} /> Modifier le profil
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'entreprise"
                value={selectedPartner?.name || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Secteur d'activité"
                value={selectedPartner?.industry || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={selectedPartner?.email || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={selectedPartner?.phone || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={selectedPartner?.location || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddNote} variant="contained">
            {selectedPartner ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Partners; 