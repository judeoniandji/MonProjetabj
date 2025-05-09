import axios from 'axios';

const API_URL = '/api';

const messageService = {
  // Récupérer toutes les conversations de l'utilisateur
  getConversations: async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      throw error.response?.data || { message: 'Erreur serveur' };
    }
  },

  // Récupérer les messages d'une conversation
  getConversationMessages: async (conversationId, page = 1, perPage = 20) => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations/${conversationId}`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error.response?.data || { message: 'Erreur serveur' };
    }
  },

  // Envoyer un message à un utilisateur
  sendMessage: async (recipientId, content, attachments = []) => {
    try {
      const formData = new FormData();
      formData.append('recipient_id', recipientId);
      formData.append('content', content);
      
      // Ajouter les pièces jointes si présentes
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const response = await axios.post(`${API_URL}/messages/send`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error.response?.data || { message: 'Erreur serveur' };
    }
  },

  // Marquer un message comme lu
  markAsRead: async (messageId) => {
    try {
      const response = await axios.put(`${API_URL}/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error);
      throw error.response?.data || { message: 'Erreur serveur' };
    }
  },

  // Supprimer un message
  deleteMessage: async (messageId) => {
    try {
      const response = await axios.delete(`${API_URL}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      throw error.response?.data || { message: 'Erreur serveur' };
    }
  },

  // Rechercher des utilisateurs pour démarrer une conversation
  searchUsers: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error.response?.data || { message: 'Erreur serveur' };
    }
  }
};

export default messageService;
