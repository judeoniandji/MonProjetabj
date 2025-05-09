import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Badge,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import messageService from '../../services/messageService';
import NewConversationDialog from './NewConversationDialog';

const ConversationsList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openNewDialog, setOpenNewDialog] = useState(false);

  // Charger les conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data.conversations);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des conversations:', err);
      setError('Impossible de charger vos conversations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Rafraîchir les conversations toutes les 30 secondes
    const intervalId = setInterval(fetchConversations, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(conversation => 
    conversation.other_user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formater la date du dernier message
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr });
  };

  // Tronquer le texte s'il est trop long
  const truncateText = (text, maxLength = 40) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Gestionnaire pour ouvrir le dialogue de nouvelle conversation
  const handleOpenNewDialog = () => {
    setOpenNewDialog(true);
  };

  // Gestionnaire pour fermer le dialogue de nouvelle conversation
  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };

  // Gestionnaire pour créer une nouvelle conversation
  const handleCreateConversation = (userId) => {
    onSelectConversation(userId);
    setOpenNewDialog(false);
    fetchConversations(); // Rafraîchir la liste des conversations
  };

  if (loading && conversations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Messages</Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Rechercher..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleOpenNewDialog}
            sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      
      {error && (
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography>{error}</Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={fetchConversations} 
            sx={{ mt: 1 }}
          >
            Réessayer
          </Button>
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <React.Fragment key={conversation.id}>
                <ListItem 
                  button
                  selected={selectedConversationId === conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  sx={{ 
                    px: 2, 
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        conversation.unread_count > 0 ? (
                          <CircleIcon 
                            sx={{ 
                              color: 'primary.main', 
                              fontSize: 12,
                              bgcolor: 'white',
                              borderRadius: '50%'
                            }} 
                          />
                        ) : null
                      }
                    >
                      <Avatar 
                        alt={conversation.other_user.name} 
                        src={conversation.other_user.avatar_url || ''}
                        sx={{ bgcolor: conversation.other_user.avatar_url ? 'transparent' : 'primary.main' }}
                      >
                        {!conversation.other_user.avatar_url && conversation.other_user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: conversation.unread_count > 0 ? 'bold' : 'normal',
                            color: conversation.unread_count > 0 ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          {conversation.other_user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatLastMessageTime(conversation.last_message_time)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontWeight: conversation.unread_count > 0 ? 'medium' : 'normal',
                          color: conversation.unread_count > 0 ? 'text.primary' : 'text.secondary'
                        }}
                      >
                        {truncateText(conversation.last_message)}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {searchTerm 
                  ? 'Aucune conversation ne correspond à votre recherche.' 
                  : 'Aucune conversation. Commencez à discuter en cliquant sur le bouton +.'}
              </Typography>
            </Box>
          )}
        </List>
      </Box>
      
      <NewConversationDialog 
        open={openNewDialog} 
        onClose={handleCloseNewDialog}
        onSelectUser={handleCreateConversation}
      />
    </Paper>
  );
};

export default ConversationsList;
