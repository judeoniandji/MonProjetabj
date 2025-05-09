import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import {
  Chat as ChatIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ConversationsList from '../components/messaging/ConversationsList';
import ConversationView from '../components/messaging/ConversationView';
import NewConversationDialog from '../components/messaging/NewConversationDialog';

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  
  // Gestion de la réactivité pour les appareils mobiles
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showConversationOnMobile, setShowConversationOnMobile] = useState(false);
  
  // Gestionnaire pour sélectionner une conversation
  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    if (isMobile) {
      setShowConversationOnMobile(true);
    }
  };
  
  // Gestionnaire pour revenir à la liste des conversations sur mobile
  const handleBackToList = () => {
    setShowConversationOnMobile(false);
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
    handleSelectConversation(userId);
    setOpenNewDialog(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: { xs: 'calc(100vh - 180px)', md: '70vh' }, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Liste des conversations (masquée sur mobile quand une conversation est ouverte) */}
          {(!isMobile || !showConversationOnMobile) && (
            <Grid item xs={12} md={4} sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
              <ConversationsList 
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation}
              />
            </Grid>
          )}
          
          {/* Vue de la conversation (ou message de bienvenue si aucune conversation sélectionnée) */}
          {(!isMobile || showConversationOnMobile) && (
            <Grid item xs={12} md={8} sx={{ height: '100%' }}>
              {selectedConversation ? (
                <ConversationView 
                  conversationId={selectedConversation}
                  onBack={handleBackToList}
                  isMobile={isMobile}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    textAlign: 'center'
                  }}
                >
                  <ChatIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.7 }} />
                  <Typography variant="h5" gutterBottom>
                    Bienvenue dans votre messagerie
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '500px', mb: 3 }}>
                    Sélectionnez une conversation dans la liste ou démarrez une nouvelle conversation pour commencer à discuter.
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Bouton flottant pour nouvelle conversation (visible uniquement sur mobile) */}
      {isMobile && !showConversationOnMobile && (
        <Fab 
          color="primary" 
          aria-label="nouvelle conversation"
          onClick={handleOpenNewDialog}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <ChatIcon />
        </Fab>
      )}
      
      {/* Dialogue pour créer une nouvelle conversation */}
      <NewConversationDialog 
        open={openNewDialog} 
        onClose={handleCloseNewDialog}
        onSelectUser={handleCreateConversation}
      />
    </Container>
  );
};

export default Messages;
