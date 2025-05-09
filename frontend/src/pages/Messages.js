import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, sendMessage } from '../store/slices/messagesSlice';

function Messages() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      dispatch(sendMessage({ conversationId: selectedConversation.id, content: newMessage }));
      setNewMessage('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ height: 'calc(100vh - 200px)' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Liste des conversations */}
          <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Conversations
            </Typography>
            <List>
              {messages.map((conversation) => (
                <React.Fragment key={conversation.id}>
                  <ListItem
                    button
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <ListItemAvatar>
                      <Avatar>{conversation.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.name}
                      secondary={conversation.lastMessage}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Zone de messages */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">{selectedConversation.name}</Typography>
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {selectedConversation.messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.senderId === user?.id ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: message.senderId === user?.id ? 'primary.light' : 'grey.100',
                          color: message.senderId === user?.id ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Envoyer
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Sélectionnez une conversation pour commencer
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Messages; 