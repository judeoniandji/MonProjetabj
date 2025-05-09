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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

function JobOffers() {
  const [offers, setOffers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'stage',
    location: '',
    description: '',
    requirements: '',
    benefits: '',
    status: 'active',
  });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implémenter la récupération des offres
    const mockOffers = [
      {
        id: 1,
        title: 'Développeur Full Stack',
        type: 'cdi',
        location: 'Paris',
        description: 'Nous recherchons un développeur full stack expérimenté...',
        requirements: 'React, Node.js, Python',
        benefits: 'Télétravail, mutuelle, tickets restaurant',
        status: 'active',
        applications: 12,
        views: 156,
      },
      {
        id: 2,
        title: 'Stage Développeur Frontend',
        type: 'stage',
        location: 'Lyon',
        description: 'Stage de 6 mois en développement frontend...',
        requirements: 'React, TypeScript',
        benefits: 'Stage rémunéré, télétravail possible',
        status: 'active',
        applications: 8,
        views: 89,
      },
    ];
    setOffers(mockOffers);
  }, []);

  const handleOpenDialog = (offer = null) => {
    if (offer) {
      setFormData(offer);
      setSelectedOffer(offer);
    } else {
      setFormData({
        title: '',
        type: 'stage',
        location: '',
        description: '',
        requirements: '',
        benefits: '',
        status: 'active',
      });
      setSelectedOffer(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOffer(null);
    setFormData({
      title: '',
      type: 'stage',
      location: '',
      description: '',
      requirements: '',
      benefits: '',
      status: 'active',
    });
  };

  const handleSubmit = () => {
    // TODO: Implémenter la création/modification d'offre
    handleCloseDialog();
  };

  const handleMenuClick = (event, offer) => {
    setAnchorEl(event.currentTarget);
    setSelectedOffer(offer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOffer(null);
  };

  const handleDelete = () => {
    // TODO: Implémenter la suppression d'offre
    handleMenuClose();
  };

  const getTypeChip = (type) => {
    const typeConfig = {
      stage: { color: 'primary', label: 'Stage' },
      alternance: { color: 'secondary', label: 'Alternance' },
      cdi: { color: 'success', label: 'CDI' },
      cdd: { color: 'warning', label: 'CDD' },
    };

    const config = typeConfig[type] || typeConfig.stage;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: 'success', label: 'Active' },
      draft: { color: 'default', label: 'Brouillon' },
      closed: { color: 'error', label: 'Fermée' },
    };

    const config = statusConfig[status] || statusConfig.active;
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
          Offres d'emploi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Publier une offre
        </Button>
      </Box>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} key={offer.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {offer.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      {getTypeChip(offer.type)}
                      {getStatusChip(offer.status)}
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {offer.location}
                    </Typography>
                  </Box>
                  <IconButton onClick={(e) => handleMenuClick(e, offer)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" paragraph>
                  {offer.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {offer.applications} candidatures
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {offer.views} vues
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {offer.requirements.split(',').map((req) => (
                    <Chip
                      key={req}
                      label={req.trim()}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(offer)}
                >
                  Modifier
                </Button>
                <Button
                  size="small"
                  color="primary"
                >
                  Voir les candidatures
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
        <MenuItem onClick={() => {
          handleOpenDialog(selectedOffer);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} /> Modifier
        </MenuItem>
        <MenuItem onClick={() => {
          handleDelete();
          handleMenuClose();
        }}>
          <DeleteIcon sx={{ mr: 1 }} /> Supprimer
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedOffer ? 'Modifier l\'offre' : 'Publier une offre'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du poste"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type de contrat</InputLabel>
                <Select
                  value={formData.type}
                  label="Type de contrat"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="stage">Stage</MenuItem>
                  <MenuItem value="alternance">Alternance</MenuItem>
                  <MenuItem value="cdi">CDI</MenuItem>
                  <MenuItem value="cdd">CDD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Localisation"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description du poste"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prérequis"
                multiline
                rows={2}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Avantages"
                multiline
                rows={2}
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedOffer ? 'Modifier' : 'Publier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default JobOffers; 