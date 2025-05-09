import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  IconButton,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Snackbar
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  PushPin as PushPinIcon,
  Attachment as AttachmentIcon,
  ThumbUp as ThumbUpIcon,
  Favorite as FavoriteIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import discussionGroupService from '../../services/discussionGroupService';
import GroupMembersList from './GroupMembersList';

// Composant pour afficher un message individuel
const MessageItem = ({ message, currentUserId, isAdmin, onEdit, onDelete, onReaction, onPin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  
  const isOwnMessage = message.sender_id === currentUserId;
  const messageDate = new Date(message.created_at);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    onEdit(message);
    handleMenuClose();
  };
  
  const handleDelete = () => {
    onDelete(message.id);
    handleMenuClose();
  };
  
  const handlePin = () => {
    onPin(message.id, !message.is_pinned);
    handleMenuClose();
  };
  
  const handleReaction = (type) => {
    onReaction(message.id, type);
    setShowReactions(false);
  };
  
  // Formater les réactions pour l'affichage
  const formatReactions = () => {
    if (!message.reactions) return null;
    
    return Object.entries(message.reactions).map(([type, count]) => {
      let icon;
      switch (type) {
        case 'like':
          icon = <ThumbUpIcon fontSize="small" />;
          break;
        case 'love':
          icon = <FavoriteIcon fontSize="small" color="error" />;
          break;
        default:
          icon = <EmojiIcon fontSize="small" />;
      }
      
      return (
        <Chip
          key={type}
          icon={icon}
          label={count}
          size="small"
          variant="outlined"
          sx={{ mr: 0.5, mb: 0.5 }}
          onClick={() => handleReaction(type)}
        />
      );
    });
  };
  
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        flexDirection: 'column',
        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        py: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, width: '100%', justifyContent: isOwnMessage ? 'flex-end' : 'flex-start' }}>
        {!isOwnMessage && (
          <ListItemAvatar sx={{ minWidth: 40 }}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </ListItemAvatar>
        )}
        <Typography variant="subtitle2" color="textSecondary">
          {isOwnMessage ? 'Vous' : message.sender_name}
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
          {messageDate.toLocaleTimeString()} - {messageDate.toLocaleDateString()}
        </Typography>
        {message.is_pinned && (
          <Tooltip title="Message épinglé">
            <PushPinIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
          </Tooltip>
        )}
        {(isOwnMessage || isAdmin) && (
          <>
            <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isOwnMessage && (
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Modifier
                </MenuItem>
              )}
              {(isOwnMessage || isAdmin) && (
                <MenuItem onClick={handleDelete}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Supprimer
                </MenuItem>
              )}
              {isAdmin && (
                <MenuItem onClick={handlePin}>
                  <PushPinIcon fontSize="small" sx={{ mr: 1 }} />
                  {message.is_pinned ? 'Désépingler' : 'Épingler'}
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Box>
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 2,
          bgcolor: isOwnMessage ? 'primary.light' : 'grey.100',
          color: isOwnMessage ? 'white' : 'inherit',
          position: 'relative'
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
        {message.attachment_url && (
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<AttachmentIcon />}
              label="Pièce jointe"
              component="a"
              href={message.attachment_url}
              target="_blank"
              clickable
              size="small"
            />
          </Box>
        )}
        {message.edited_at && (
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            (modifié)
          </Typography>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', mt: 0.5, flexWrap: 'wrap' }}>
        {formatReactions()}
        <IconButton size="small" onClick={() => setShowReactions(!showReactions)}>
          <EmojiIcon fontSize="small" />
        </IconButton>
        {showReactions && (
          <Paper sx={{ display: 'flex', ml: 1, p: 0.5 }}>
            <IconButton size="small" onClick={() => handleReaction('like')}>
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('love')} color="error">
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('laugh')}>
              <EmojiIcon fontSize="small" />
            </IconButton>
          </Paper>
        )}
      </Box>
    </ListItem>
  );
};

const DiscussionGroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);
  const messagesEndRef = useRef(null);
  
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null });
  
  // Vérifier si l'utilisateur est admin du groupe
  const isAdmin = group?.created_by_id === currentUser?.id || 
                  members.some(m => m.id === currentUser?.id && m.is_admin);
  
  // Charger les données du groupe
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      
      // Charger les détails du groupe
      const groupData = await discussionGroupService.getGroupById(groupId);
      setGroup(groupData);
      
      // Charger les messages du groupe
      const messagesData = await discussionGroupService.getGroupMessages(groupId);
      setMessages(messagesData.messages);
      
      // Charger les membres du groupe
      const membersData = await discussionGroupService.getGroupMembers(groupId);
      setMembers(membersData.members);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données du groupe:', err);
      setError('Impossible de charger les données du groupe. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Effet initial pour charger les données
  useEffect(() => {
    fetchGroupData();
  }, [groupId]);
  
  // Faire défiler automatiquement vers le bas lors de nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Gestionnaire de changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Gestionnaire d'envoi de message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      if (editingMessage) {
        // Mettre à jour un message existant
        await discussionGroupService.updateMessage(groupId, editingMessage.id, {
          content: newMessage
        });
        
        setNotification({
          open: true,
          message: 'Message mis à jour avec succès',
          severity: 'success'
        });
        
        setEditingMessage(null);
      } else {
        // Envoyer un nouveau message
        await discussionGroupService.sendMessage(groupId, {
          content: newMessage
        });
      }
      
      setNewMessage('');
      fetchGroupData(); // Rafraîchir les messages
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Erreur lors de l\'envoi du message',
        severity: 'error'
      });
    }
  };
  
  // Gestionnaire pour éditer un message
  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  };
  
  // Gestionnaire pour supprimer un message
  const handleDeleteMessage = (messageId) => {
    setConfirmDialog({
      open: true,
      title: 'Supprimer le message',
      message: 'Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.',
      action: async () => {
        try {
          await discussionGroupService.deleteMessage(groupId, messageId);
          
          setNotification({
            open: true,
            message: 'Message supprimé avec succès',
            severity: 'success'
          });
          
          fetchGroupData(); // Rafraîchir les messages
        } catch (err) {
          setNotification({
            open: true,
            message: err.message || 'Erreur lors de la suppression du message',
            severity: 'error'
          });
        }
      }
    });
  };
  
  // Gestionnaire pour épingler un message
  const handlePinMessage = async (messageId, isPinned) => {
    try {
      await discussionGroupService.updateMessage(groupId, messageId, {
        is_pinned: isPinned
      });
      
      setNotification({
        open: true,
        message: isPinned ? 'Message épinglé avec succès' : 'Message désépinglé avec succès',
        severity: 'success'
      });
      
      fetchGroupData(); // Rafraîchir les messages
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Erreur lors de la modification du message',
        severity: 'error'
      });
    }
  };
  
  // Gestionnaire pour ajouter une réaction
  const handleReaction = async (messageId, reactionType) => {
    try {
      await discussionGroupService.addReaction(groupId, messageId, reactionType);
      fetchGroupData(); // Rafraîchir les messages
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Erreur lors de l\'ajout de la réaction',
        severity: 'error'
      });
    }
  };
  
  // Gestionnaire pour quitter le groupe
  const handleLeaveGroup = () => {
    setConfirmDialog({
      open: true,
      title: 'Quitter le groupe',
      message: 'Êtes-vous sûr de vouloir quitter ce groupe ?',
      action: async () => {
        try {
          await discussionGroupService.leaveGroup(groupId);
          
          setNotification({
            open: true,
            message: 'Vous avez quitté le groupe avec succès',
            severity: 'success'
          });
          
          navigate('/discussion-groups');
        } catch (err) {
          setNotification({
            open: true,
            message: err.message || 'Erreur lors de la tentative de quitter le groupe',
            severity: 'error'
          });
        }
      }
    });
  };
  
  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Fermer le dialogue de confirmation
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };
  
  // Confirmer l'action dans le dialogue
  const handleConfirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    handleCloseConfirmDialog();
  };
  
  // Annuler l'édition d'un message
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/discussion-groups')}
          sx={{ mt: 2 }}
        >
          Retour aux groupes
        </Button>
      </Box>
    );
  }
  
  if (!group) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Groupe non trouvé</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/discussion-groups')}
          sx={{ mt: 2 }}
        >
          Retour aux groupes
        </Button>
      </Box>
    );
  }
  
  // Messages épinglés
  const pinnedMessages = messages.filter(m => m.is_pinned);
  
  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête du groupe */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/discussion-groups')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {group.name}
          </Typography>
          <Chip 
            label={group.topic} 
            color="primary" 
            size="small" 
            sx={{ ml: 2 }} 
          />
          {group.is_private && (
            <Chip
              icon={<InfoIcon />}
              label="Groupe privé"
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLeaveGroup}
        >
          Quitter le groupe
        </Button>
      </Box>
      
      {/* Description du groupe */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          {group.description || 'Aucune description disponible pour ce groupe.'}
        </Typography>
      </Paper>
      
      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="group tabs">
          <Tab label="Discussion" id="tab-0" />
          <Tab 
            label={
              <Badge badgeContent={members.length} color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ mr: 1 }} />
                  Membres
                </Box>
              </Badge>
            } 
            id="tab-1" 
          />
        </Tabs>
      </Box>
      
      {/* Contenu des onglets */}
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(70vh - 200px)' }}>
            {/* Messages épinglés */}
            {pinnedMessages.length > 0 && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PushPinIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Messages épinglés ({pinnedMessages.length})
                  </Typography>
                </Box>
                <List dense>
                  {pinnedMessages.map(message => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.sender_name}
                        secondary={message.content}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            
            {/* Liste des messages */}
            <Paper 
              sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                mb: 2, 
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {messages.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucun message dans ce groupe. Soyez le premier à écrire !
                  </Typography>
                </Box>
              ) : (
                <List sx={{ width: '100%' }}>
                  {messages.map(message => (
                    <React.Fragment key={message.id}>
                      <MessageItem
                        message={message}
                        currentUserId={currentUser?.id}
                        isAdmin={isAdmin}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        onReaction={handleReaction}
                        onPin={handlePinMessage}
                      />
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              )}
            </Paper>
            
            {/* Formulaire d'envoi de message */}
            <Paper sx={{ p: 2 }}>
              <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center' }}>
                {editingMessage && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      Modification du message:
                    </Typography>
                    <Button size="small" onClick={handleCancelEdit}>
                      Annuler
                    </Button>
                  </Box>
                )}
                <TextField
                  fullWidth
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  multiline
                  maxRows={4}
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  disabled={!newMessage.trim()}
                >
                  {editingMessage ? 'Modifier' : 'Envoyer'}
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <GroupMembersList 
            members={members} 
            groupId={groupId} 
            isAdmin={isAdmin}
            onMembersUpdated={fetchGroupData}
          />
        )}
      </Box>
      
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
      
      {/* Dialogue de confirmation */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Annuler</Button>
          <Button onClick={handleConfirmAction} color="error" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiscussionGroupDetail;
