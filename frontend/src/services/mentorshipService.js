import axios from 'axios';

const API_URL = '/api';

/**
 * Service pour gérer les fonctionnalités liées au mentorat
 */
const mentorshipService = {
  /**
   * Récupère la liste des mentors disponibles avec filtres optionnels
   * @param {Object} filters - Filtres pour la recherche (domaine, disponibilité, etc.)
   * @returns {Promise} - Promesse contenant les résultats de la recherche
   */
  getMentors: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajouter les filtres à la requête
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(val => queryParams.append(key, val));
          } else {
            queryParams.append(key, value);
          }
        }
      });
      
      const response = await axios.get(`${API_URL}/mentors?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des mentors:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les détails d'un mentor spécifique
   * @param {string} mentorId - Identifiant du mentor
   * @returns {Promise} - Promesse contenant les détails du mentor
   */
  getMentorById: async (mentorId) => {
    try {
      const response = await axios.get(`${API_URL}/mentors/${mentorId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du mentor ${mentorId}:`, error);
      throw error;
    }
  },
  
  /**
   * Envoie une demande de mentorat à un mentor
   * @param {string} mentorId - Identifiant du mentor
   * @param {Object} requestData - Données de la demande (objectifs, message, etc.)
   * @returns {Promise} - Promesse contenant la réponse à la demande
   */
  sendMentorshipRequest: async (mentorId, requestData) => {
    try {
      const response = await axios.post(`${API_URL}/mentorship/requests`, {
        mentor_id: mentorId,
        ...requestData
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande de mentorat:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les demandes de mentorat reçues (pour les mentors)
   * @returns {Promise} - Promesse contenant la liste des demandes
   */
  getMentorshipRequests: async () => {
    try {
      const response = await axios.get(`${API_URL}/mentorship/requests/received`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de mentorat:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les demandes de mentorat envoyées (pour les étudiants)
   * @returns {Promise} - Promesse contenant la liste des demandes
   */
  getSentMentorshipRequests: async () => {
    try {
      const response = await axios.get(`${API_URL}/mentorship/requests/sent`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de mentorat envoyées:', error);
      throw error;
    }
  },
  
  /**
   * Répond à une demande de mentorat (accepter ou refuser)
   * @param {string} requestId - Identifiant de la demande
   * @param {string} status - Statut de la réponse ('accepted' ou 'rejected')
   * @param {string} message - Message optionnel accompagnant la réponse
   * @returns {Promise} - Promesse contenant la réponse mise à jour
   */
  respondToMentorshipRequest: async (requestId, status, message = '') => {
    try {
      const response = await axios.put(`${API_URL}/mentorship/requests/${requestId}`, {
        status,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réponse à la demande de mentorat:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les relations de mentorat actives
   * @returns {Promise} - Promesse contenant la liste des relations de mentorat
   */
  getActiveMentorships: async () => {
    try {
      const response = await axios.get(`${API_URL}/mentorship/active`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des relations de mentorat actives:', error);
      throw error;
    }
  },
  
  /**
   * Planifie une session de mentorat
   * @param {string} mentorshipId - Identifiant de la relation de mentorat
   * @param {Object} sessionData - Données de la session (date, durée, sujet, etc.)
   * @returns {Promise} - Promesse contenant la session créée
   */
  scheduleSession: async (mentorshipId, sessionData) => {
    try {
      const response = await axios.post(`${API_URL}/mentorship/${mentorshipId}/sessions`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la planification de la session de mentorat:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les sessions de mentorat planifiées
   * @param {string} mentorshipId - Identifiant de la relation de mentorat (optionnel)
   * @returns {Promise} - Promesse contenant la liste des sessions
   */
  getMentoringSessions: async (mentorshipId = null) => {
    try {
      const url = mentorshipId 
        ? `${API_URL}/mentorship/${mentorshipId}/sessions` 
        : `${API_URL}/mentorship/sessions`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions de mentorat:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour le statut d'une session de mentorat
   * @param {string} sessionId - Identifiant de la session
   * @param {string} status - Nouveau statut ('completed', 'cancelled', 'rescheduled')
   * @param {Object} additionalData - Données supplémentaires (notes, nouvelle date si reportée, etc.)
   * @returns {Promise} - Promesse contenant la session mise à jour
   */
  updateSessionStatus: async (sessionId, status, additionalData = {}) => {
    try {
      const response = await axios.put(`${API_URL}/mentorship/sessions/${sessionId}`, {
        status,
        ...additionalData
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la session:', error);
      throw error;
    }
  },
  
  /**
   * Ajoute des notes à une session de mentorat
   * @param {string} sessionId - Identifiant de la session
   * @param {string} notes - Notes de la session
   * @returns {Promise} - Promesse contenant la session mise à jour
   */
  addSessionNotes: async (sessionId, notes) => {
    try {
      const response = await axios.post(`${API_URL}/mentorship/sessions/${sessionId}/notes`, { notes });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des notes à la session:', error);
      throw error;
    }
  },
  
  /**
   * Évalue une session de mentorat
   * @param {string} sessionId - Identifiant de la session
   * @param {Object} feedbackData - Données d'évaluation (note, commentaires, etc.)
   * @returns {Promise} - Promesse contenant l'évaluation créée
   */
  provideFeedback: async (sessionId, feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/mentorship/sessions/${sessionId}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'évaluation de la session:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les statistiques de mentorat (pour les mentors et les étudiants)
   * @returns {Promise} - Promesse contenant les statistiques
   */
  getMentorshipStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/mentorship/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de mentorat:', error);
      throw error;
    }
  }
};

export default mentorshipService;
