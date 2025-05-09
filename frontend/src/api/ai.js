/**
 * Service API pour les fonctionnalités d'IA de l'application
 */
import axios from 'axios';

const API_URL = '/api/ai';

/**
 * Obtient des recommandations d'emploi personnalisées basées sur l'IA
 * @param {Object} user - Profil de l'utilisateur
 * @param {string} userId - ID de l'utilisateur (optionnel)
 * @param {number} limit - Nombre maximum de recommandations à retourner
 */
export const getAIJobRecommendations = async (user, userId = null, limit = 10) => {
  try {
    const response = await axios.post(`${API_URL}/jobs/recommendations`, {
      user,
      user_id: userId,
      limit
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations d\'emploi:', error);
    throw error;
  }
};

/**
 * Enregistre une interaction utilisateur-emploi pour améliorer les recommandations futures
 * @param {string} userId - ID de l'utilisateur
 * @param {string} jobId - ID de l'offre d'emploi
 * @param {string} interactionType - Type d'interaction ('view', 'apply', 'save', 'dismiss')
 */
export const recordJobInteraction = async (userId, jobId, interactionType) => {
  try {
    const response = await axios.post(`${API_URL}/jobs/interaction`, {
      user_id: userId,
      job_id: jobId,
      interaction_type: interactionType
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'interaction:', error);
    throw error;
  }
};

/**
 * Obtient des insights sur le marché de l'emploi basés sur l'analyse des données
 */
export const getJobMarketInsights = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/insights`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des insights du marché de l\'emploi:', error);
    throw error;
  }
};
