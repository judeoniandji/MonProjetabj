/**
 * Service API pour les données sénégalaises (universités, entreprises, offres d'emploi)
 */
import axios from 'axios';

const API_URL = '/api/senegal';

/**
 * Récupère la liste des universités sénégalaises
 */
export const getSenegalUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}/universities`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des universités:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'une université sénégalaise spécifique
 * @param {string} universityId - Identifiant de l'université
 */
export const getSenegalUniversity = async (universityId) => {
  try {
    const response = await axios.get(`${API_URL}/universities/${universityId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'université ${universityId}:`, error);
    throw error;
  }
};

/**
 * Récupère la liste des entreprises sénégalaises
 * @param {string} industry - Filtre optionnel par industrie
 */
export const getSenegalCompanies = async (industry = '') => {
  try {
    const params = industry ? { industry } : {};
    const response = await axios.get(`${API_URL}/companies`, { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'une entreprise sénégalaise spécifique
 * @param {string} companyId - Identifiant de l'entreprise
 */
export const getSenegalCompany = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'entreprise ${companyId}:`, error);
    throw error;
  }
};

/**
 * Récupère la liste des offres d'emploi au Sénégal avec filtres optionnels
 * @param {Object} filters - Filtres pour les offres d'emploi
 */
export const getSenegalJobs = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/jobs`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'une offre d'emploi spécifique
 * @param {string} jobId - Identifiant de l'offre d'emploi
 */
export const getSenegalJob = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'offre d'emploi ${jobId}:`, error);
    throw error;
  }
};

/**
 * Recherche des offres d'emploi par mot-clé
 * @param {string} query - Terme de recherche
 */
export const searchSenegalJobs = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/search`, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'offres d\'emploi:', error);
    throw error;
  }
};

/**
 * Récupère des statistiques sur le marché de l'emploi au Sénégal
 */
export const getSenegalJobStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/job-stats`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'emploi:', error);
    throw error;
  }
};

/**
 * Récupère la liste des industries présentes au Sénégal
 */
export const getSenegalIndustries = async () => {
  try {
    const response = await axios.get(`${API_URL}/industries`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des industries:', error);
    throw error;
  }
};

/**
 * Récupère la liste des programmes d'études disponibles au Sénégal
 */
export const getSenegalStudyPrograms = async () => {
  try {
    const response = await axios.get(`${API_URL}/study-programs`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes d\'études:', error);
    throw error;
  }
};
