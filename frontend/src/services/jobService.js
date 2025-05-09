import axios from 'axios';

const API_URL = '/api';

/**
 * Service pour gérer les offres d'emploi et de stage
 */
const jobService = {
  /**
   * Récupère les offres d'emploi avec filtres
   * @param {Object} filters - Filtres pour la recherche
   * @returns {Promise} - Promesse contenant les offres d'emploi
   */
  getJobs: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajouter les filtres à la requête
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            filters[key].forEach(value => {
              queryParams.append(key, value);
            });
          } else {
            queryParams.append(key, filters[key]);
          }
        }
      });
      
      const response = await axios.get(`${API_URL}/jobs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres d\'emploi:', error);
      throw error;
    }
  },
  
  /**
   * Récupère une offre d'emploi par son ID
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} - Promesse contenant l'offre d'emploi
   */
  getJobById: async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'offre d'emploi ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Crée une nouvelle offre d'emploi
   * @param {Object} jobData - Données de l'offre d'emploi
   * @returns {Promise} - Promesse contenant l'offre d'emploi créée
   */
  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/jobs`, jobData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour une offre d'emploi existante
   * @param {string} jobId - ID de l'offre d'emploi
   * @param {Object} jobData - Données mises à jour de l'offre d'emploi
   * @returns {Promise} - Promesse contenant l'offre d'emploi mise à jour
   */
  updateJob: async (jobId, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'offre d'emploi ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Supprime une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} - Promesse contenant le résultat de la suppression
   */
  deleteJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'offre d'emploi ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Postuler à une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @param {Object} applicationData - Données de la candidature
   * @returns {Promise} - Promesse contenant le résultat de la candidature
   */
  applyToJob: async (jobId, applicationData) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la candidature à l'offre d'emploi ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère les candidatures pour une offre d'emploi (pour les entreprises)
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} - Promesse contenant les candidatures
   */
  getJobApplications: async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des candidatures pour l'offre d'emploi ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère les candidatures d'un étudiant
   * @returns {Promise} - Promesse contenant les candidatures de l'étudiant
   */
  getStudentApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/applications/student`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures de l\'étudiant:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les offres d'emploi recommandées pour l'utilisateur connecté
   * @returns {Promise} - Promesse contenant les offres d'emploi recommandées
   */
  getRecommendedJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/recommended`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres d\'emploi recommandées:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les statistiques sur les offres d'emploi (pour les entreprises)
   * @returns {Promise} - Promesse contenant les statistiques
   */
  getJobStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques sur les offres d\'emploi:', error);
      throw error;
    }
  },
  
  /**
   * Sauvegarde une offre d'emploi (pour les étudiants)
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} - Promesse contenant le résultat de la sauvegarde
   */
  saveJob: async (jobId) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de l'offre d'emploi ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère les offres d'emploi sauvegardées (pour les étudiants)
   * @returns {Promise} - Promesse contenant les offres d'emploi sauvegardées
   */
  getSavedJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/saved`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres d\'emploi sauvegardées:', error);
      throw error;
    }
  },
  
  /**
   * Supprime une offre d'emploi sauvegardée (pour les étudiants)
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} - Promesse contenant le résultat de la suppression
   */
  unsaveJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'offre d'emploi sauvegardée ${jobId}:`, error);
      throw error;
    }
  }
};

export default jobService;
