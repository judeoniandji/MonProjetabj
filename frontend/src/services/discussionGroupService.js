import api from './api';

const discussionGroupService = {
  /**
   * Récupère la liste des groupes de discussion
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} - Promesse avec les données des groupes
   */
  getGroups: async (params = {}) => {
    try {
      const response = await api.get('/api/groups/groups', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des groupes');
    }
  },

  /**
   * Récupère les détails d'un groupe spécifique
   * @param {Number} groupId - ID du groupe
   * @returns {Promise} - Promesse avec les données du groupe
   */
  getGroupById: async (groupId) => {
    try {
      const response = await api.get(`/api/groups/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération du groupe');
    }
  },

  /**
   * Crée un nouveau groupe de discussion
   * @param {Object} groupData - Données du groupe à créer
   * @returns {Promise} - Promesse avec les données du groupe créé
   */
  createGroup: async (groupData) => {
    try {
      const response = await api.post('/api/groups/groups', groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création du groupe');
    }
  },

  /**
   * Met à jour un groupe existant
   * @param {Number} groupId - ID du groupe
   * @param {Object} groupData - Données à mettre à jour
   * @returns {Promise} - Promesse avec les données du groupe mis à jour
   */
  updateGroup: async (groupId, groupData) => {
    try {
      const response = await api.put(`/api/groups/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du groupe');
    }
  },

  /**
   * Supprime un groupe
   * @param {Number} groupId - ID du groupe à supprimer
   * @returns {Promise} - Promesse avec le message de confirmation
   */
  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(`/api/groups/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression du groupe');
    }
  },

  /**
   * Rejoint un groupe
   * @param {Number} groupId - ID du groupe à rejoindre
   * @param {String} accessCode - Code d'accès pour les groupes privés
   * @returns {Promise} - Promesse avec le message de confirmation
   */
  joinGroup: async (groupId, accessCode = null) => {
    try {
      const response = await api.post(`/api/groups/groups/${groupId}/join`, { access_code: accessCode });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la tentative de rejoindre le groupe');
    }
  },

  /**
   * Quitte un groupe
   * @param {Number} groupId - ID du groupe à quitter
   * @returns {Promise} - Promesse avec le message de confirmation
   */
  leaveGroup: async (groupId) => {
    try {
      const response = await api.post(`/api/groups/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la tentative de quitter le groupe');
    }
  },

  /**
   * Récupère les membres d'un groupe
   * @param {Number} groupId - ID du groupe
   * @returns {Promise} - Promesse avec la liste des membres
   */
  getGroupMembers: async (groupId) => {
    try {
      const response = await api.get(`/api/groups/groups/${groupId}/members`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des membres');
    }
  },

  /**
   * Récupère les messages d'un groupe
   * @param {Number} groupId - ID du groupe
   * @param {Object} params - Paramètres de pagination
   * @returns {Promise} - Promesse avec les messages du groupe
   */
  getGroupMessages: async (groupId, params = {}) => {
    try {
      const response = await api.get(`/api/groups/groups/${groupId}/messages`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des messages');
    }
  },

  /**
   * Envoie un message dans un groupe
   * @param {Number} groupId - ID du groupe
   * @param {Object} messageData - Données du message
   * @returns {Promise} - Promesse avec les données du message créé
   */
  sendMessage: async (groupId, messageData) => {
    try {
      const response = await api.post(`/api/groups/groups/${groupId}/messages`, messageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'envoi du message');
    }
  },

  /**
   * Met à jour un message
   * @param {Number} groupId - ID du groupe
   * @param {Number} messageId - ID du message
   * @param {Object} messageData - Données à mettre à jour
   * @returns {Promise} - Promesse avec les données du message mis à jour
   */
  updateMessage: async (groupId, messageId, messageData) => {
    try {
      const response = await api.put(`/api/groups/groups/${groupId}/messages/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du message');
    }
  },

  /**
   * Supprime un message
   * @param {Number} groupId - ID du groupe
   * @param {Number} messageId - ID du message à supprimer
   * @returns {Promise} - Promesse avec le message de confirmation
   */
  deleteMessage: async (groupId, messageId) => {
    try {
      const response = await api.delete(`/api/groups/groups/${groupId}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression du message');
    }
  },

  /**
   * Ajoute une réaction à un message
   * @param {Number} groupId - ID du groupe
   * @param {Number} messageId - ID du message
   * @param {String} reactionType - Type de réaction
   * @returns {Promise} - Promesse avec le message de confirmation
   */
  addReaction: async (groupId, messageId, reactionType) => {
    try {
      const response = await api.post(`/api/groups/groups/${groupId}/messages/${messageId}/reactions`, { reaction_type: reactionType });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'ajout de la réaction');
    }
  },

  /**
   * Supprime une réaction d'un message
   * @param {Number} groupId - ID du groupe
   * @param {Number} messageId - ID du message
   * @returns {Promise} - Promesse avec le message de confirmation
   */
  removeReaction: async (groupId, messageId) => {
    try {
      const response = await api.delete(`/api/groups/groups/${groupId}/messages/${messageId}/reactions`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de la réaction');
    }
  },

  /**
   * Récupère la liste des sujets disponibles
   * @returns {Promise} - Promesse avec la liste des sujets
   */
  getTopics: async () => {
    try {
      const response = await api.get('/api/groups/topics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des sujets');
    }
  }
};

export default discussionGroupService;
