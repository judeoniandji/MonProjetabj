import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import messageService from '../../services/messageService';

const NewConversationDialog = ({ open, onClose, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Rechercher des utilisateurs
  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setUsers([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await messageService.searchUsers(searchTerm);
      setUsers(data.users);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', err);
      setError('Impossible de rechercher des utilisateurs. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Effectuer la recherche lorsque le terme de recherche change
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers();
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);
  
  // Réinitialiser l'état lorsque le dialogue est fermé
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setUsers([]);
      setError(null);
    }
  }, [open]);
  
  // Gestionnaire pour sélectionner un utilisateur
  const handleSelectUser = (userId) => {
    onSelectUser(userId);
  };
  
  // Gestionnaire pour effacer la recherche
  const handleClearSearch = () => {
    setSearchTerm('');
    setUsers([]);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Nouvelle conversation
      </DialogTitle>
      
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          placeholder="Rechercher un utilisateur..."
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ color: 'error.main', my: 2 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        {!loading && users.length > 0 && (
          <List sx={{ mt: 2 }}>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem 
                  button 
                  onClick={() => handleSelectUser(user.id)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={user.name} 
                      src={user.avatar_url || ''}
                      sx={{ bgcolor: user.avatar_url ? 'transparent' : 'primary.main' }}
                    >
                      {!user.avatar_url && user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {user.user_type === 'student' ? 'Étudiant' : 
                         user.user_type === 'university' ? 'Université' :
                         user.user_type === 'company' ? 'Entreprise' :
                         user.user_type === 'mentor' ? 'Mentor' : 'Utilisateur'}
                        {user.email && ` • ${user.email}`}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" variant="inset" />
              </React.Fragment>
            ))}
          </List>
        )}
        
        {!loading && searchTerm && users.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography color="text.secondary">
              Aucun utilisateur trouvé pour "{searchTerm}".
            </Typography>
          </Box>
        )}
        
        {!searchTerm && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography color="text.secondary">
              Recherchez un utilisateur pour démarrer une conversation.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewConversationDialog;
