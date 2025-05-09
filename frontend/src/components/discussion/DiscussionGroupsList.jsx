import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Button, 
  TextField, 
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  FilterList as FilterIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import discussionGroupService from '../../services/discussionGroupService';
import CreateGroupForm from './CreateGroupForm';

const DiscussionGroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  const navigate = useNavigate();

  // Charger les groupes
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const params = { 
        page, 
        per_page: 12,
        search: searchTerm || undefined,
        topic: selectedTopic || undefined
      };
      
      const data = await discussionGroupService.getGroups(params);
      setGroups(data.groups);
      setTotalPages(data.pages);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des groupes:', err);
      setError('Impossible de charger les groupes de discussion. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les sujets disponibles
  const fetchTopics = async () => {
    try {
      const data = await discussionGroupService.getTopics();
      setTopics(data.topics);
    } catch (err) {
      console.error('Erreur lors du chargement des sujets:', err);
    }
  };

  // Effet initial pour charger les données
  useEffect(() => {
    fetchGroups();
    fetchTopics();
  }, [page, searchTerm, selectedTopic]);

  // Gestionnaire de changement de page
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Gestionnaire de recherche
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }
  };

  // Gestionnaire de changement de sujet
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setPage(1); // Réinitialiser à la première page lors d'un changement de filtre
  };

  // Gestionnaire de clic sur un groupe
  const handleGroupClick = (groupId) => {
    navigate(`/discussion-groups/${groupId}`);
  };

  // Gestionnaire pour ouvrir le formulaire de création
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  // Gestionnaire pour fermer le formulaire de création
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // Gestionnaire pour la création d'un groupe
  const handleCreateGroup = async (groupData) => {
    try {
      await discussionGroupService.createGroup(groupData);
      setNotification({
        open: true,
        message: 'Groupe créé avec succès!',
        severity: 'success'
      });
      handleCloseCreateDialog();
      fetchGroups(); // Rafraîchir la liste des groupes
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Erreur lors de la création du groupe',
        severity: 'error'
      });
    }
  };

  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Groupes de discussion
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Créer un groupe
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher un groupe..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: '200px' }}>
          <InputLabel id="topic-select-label">Sujet</InputLabel>
          <Select
            labelId="topic-select-label"
            id="topic-select"
            value={selectedTopic}
            onChange={handleTopicChange}
            label="Sujet"
            displayEmpty
          >
            <MenuItem value="">Tous les sujets</MenuItem>
            {topics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Liste des groupes */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : groups.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="textSecondary">
            Aucun groupe trouvé
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Essayez de modifier vos filtres ou créez un nouveau groupe
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea onClick={() => handleGroupClick(group.id)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={group.banner_image_url || 'https://source.unsplash.com/random/300x200/?community'}
                    alt={group.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {group.name}
                      </Typography>
                      {group.is_private ? (
                        <LockIcon fontSize="small" color="action" />
                      ) : (
                        <PublicIcon fontSize="small" color="action" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {group.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={group.topic} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {group.members_count}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}

      {/* Dialogue de création de groupe */}
      <Dialog 
        open={openCreateDialog} 
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Créer un nouveau groupe de discussion</DialogTitle>
        <DialogContent>
          <CreateGroupForm 
            onSubmit={handleCreateGroup} 
            onCancel={handleCloseCreateDialog}
            topics={topics}
          />
        </DialogContent>
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscussionGroupsList;
