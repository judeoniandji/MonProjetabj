import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as EmojiIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import messageService from '../../services/messageService';

const ConversationView = ({ conversationId, onBack, isMobile }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const currentUser = useSelector(state => state.auth.user);
  
  // Charger les messages
  const fetchMessages = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const data = await messageService.getConversationMessages(conversationId, pageNum);
      
      if (append) {
        setMessages(prev => [...data.messages.reverse(), ...prev]);
      } else {
        setMessages(data.messages.reverse());
        setConversation(data.conversation);
      }
      
      setHasMore(data.messages.length === 20); // Supposons que nous récupérons 20 messages par page
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      setError('Impossible de charger les messages. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // Charger les messages initiaux
  useEffect(() => {
    if (conversationId) {
      fetchMessages(1, false);
      setPage(1);
    }
  }, [conversationId]);
  
  // Marquer les messages comme lus
  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        const unreadMessages = messages.filter(
          msg => !msg.is_read && msg.sender_id !== currentUser.id
        );
        
        for (const msg of unreadMessages) {
          await messageService.markAsRead(msg.id);
        }
      } catch (err) {
        console.error('Erreur lors du marquage des messages comme lus:', err);
      }
    };
    
    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages, currentUser]);
  
  // Faire défiler jusqu'au dernier message
  useEffect(() => {
    if (messagesEndRef.current && page === 1) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, page]);
  
  // Gestionnaire de défilement pour charger plus de messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      
      if (scrollTop === 0 && hasMore && !loadingMore) {
        loadMoreMessages();
      }
    }
  };
  
  // Charger plus de messages
  const loadMoreMessages = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, true);
    }
  };
  
  // Envoyer un nouveau message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setSending(true);
      
      // Créer un message temporaire optimiste
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: newMessage,
        sender_id: currentUser.id,
        recipient_id: conversation.other_user.id,
        created_at: new Date().toISOString(),
        is_read: false,
        is_sending: true
      };
      
      // Ajouter le message temporaire à la liste
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Faire défiler jusqu'au nouveau message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      // Envoyer le message au serveur
      const response = await messageService.sendMessage(
        conversation.other_user.id,
        tempMessage.content
      );
      
      // Remplacer le message temporaire par le message réel
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? { ...response.message, is_sending: false } : msg
        )
      );
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      
      // Marquer le message comme échoué
      setMessages(prev => 
        prev.map(msg => 
          msg.id === `temp-${Date.now()}` ? { ...msg, is_sending: false, is_error: true } : msg
        )
      );
      
      // Afficher une erreur
      setError('Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };
  
  // Formater la date du message
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return format(date, 'HH:mm');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };
  
  // Grouper les messages par date
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    
    msgs.forEach(msg => {
      const date = new Date(msg.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  // Obtenir la date formatée pour l'en-tête
  const getFormattedDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    }
  };
  
  if (loading && messages.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête de la conversation */}
      {conversation && (
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {isMobile && (
            <IconButton onClick={onBack} edge="start">
              <ArrowBackIcon />
            </IconButton>
          )}
          
          <Avatar 
            alt={conversation.other_user.name} 
            src={conversation.other_user.avatar_url || ''}
            sx={{ width: 40, height: 40 }}
          >
            {!conversation.other_user.avatar_url && conversation.other_user.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ ml: 1, flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {conversation.other_user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conversation.other_user.user_type === 'student' ? 'Étudiant' : 
               conversation.other_user.user_type === 'university' ? 'Université' :
               conversation.other_user.user_type === 'company' ? 'Entreprise' :
               conversation.other_user.user_type === 'mentor' ? 'Mentor' : 'Utilisateur'}
            </Typography>
          </Box>
          
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      )}
      
      {/* Zone des messages */}
      <Box 
        ref={messagesContainerRef}
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
        onScroll={handleScroll}
      >
        {/* Bouton pour charger plus de messages */}
        {hasMore && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button 
              variant="text" 
              size="small" 
              onClick={loadMoreMessages}
              disabled={loadingMore}
            >
              {loadingMore ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
              Charger les messages précédents
            </Button>
          </Box>
        )}
        
        {/* Affichage des messages groupés par date */}
        {groupMessagesByDate(messages).map((group, groupIndex) => (
          <Box key={group.date} sx={{ mb: 2 }}>
            {/* En-tête de date */}
            <Box 
              sx={{ 
                textAlign: 'center', 
                mb: 2,
                position: 'relative'
              }}
            >
              <Divider>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    px: 2, 
                    py: 0.5, 
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    borderRadius: 1
                  }}
                >
                  {getFormattedDateHeader(group.date)}
                </Typography>
              </Divider>
            </Box>
            
            {/* Messages de la journée */}
            {group.messages.map((message, index) => {
              const isCurrentUser = message.sender_id === currentUser.id;
              const showAvatar = !isCurrentUser && (
                index === 0 || 
                group.messages[index - 1].sender_id !== message.sender_id
              );
              
              return (
                <Box 
                  key={message.id} 
                  sx={{ 
                    display: 'flex',
                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    mb: 1,
                    alignItems: 'flex-end'
                  }}
                >
                  {/* Avatar (seulement pour les messages reçus) */}
                  {!isCurrentUser && (
                    <Box sx={{ mr: 1, width: 36, height: 36, visibility: showAvatar ? 'visible' : 'hidden' }}>
                      {showAvatar && (
                        <Avatar 
                          alt={conversation?.other_user.name} 
                          src={conversation?.other_user.avatar_url || ''}
                          sx={{ width: 36, height: 36 }}
                        >
                          {!conversation?.other_user.avatar_url && conversation?.other_user.name.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </Box>
                  )}
                  
                  {/* Contenu du message */}
                  <Box 
                    sx={{ 
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
                      color: isCurrentUser ? 'white' : 'text.primary',
                      position: 'relative',
                      ...(isCurrentUser ? { ml: 1 } : { mr: 1 }),
                      ...(message.is_error ? { 
                        bgcolor: 'error.light',
                        color: 'white'
                      } : {})
                    }}
                  >
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5,
                        color: isCurrentUser ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                        fontSize: '0.7rem'
                      }}
                    >
                      {formatMessageTime(message.created_at)}
                      {message.is_sending && ' • Envoi en cours...'}
                      {message.is_error && ' • Erreur d\'envoi'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
        
        {/* Élément de référence pour le défilement automatique */}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Zone de saisie du message */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <IconButton color="primary">
          <AttachFileIcon />
        </IconButton>
        
        <TextField
          fullWidth
          placeholder="Écrivez votre message..."
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          multiline
          maxRows={4}
          sx={{ flexGrow: 1 }}
        />
        
        <IconButton color="primary">
          <EmojiIcon />
        </IconButton>
        
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={!newMessage.trim() || sending}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' }
          }}
        >
          {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ConversationView;
