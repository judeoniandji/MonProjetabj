import api from './config';

export const jobService = {
    // Obtenir la liste des jobs avec pagination et filtres
    getJobs: async (page = 1, filters = {}) => {
        const params = new URLSearchParams({
            page,
            ...filters
        });
        const response = await api.get(`/jobs?${params}`);
        return response.data;
    },

    // Obtenir un job spécifique
    getJob: async (jobId) => {
        const response = await api.get(`/jobs/${jobId}`);
        return response.data;
    },

    // Créer un nouveau job (entreprises seulement)
    createJob: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },

    // Mettre à jour un job existant
    updateJob: async (jobId, jobData) => {
        const response = await api.put(`/jobs/${jobId}`, jobData);
        return response.data;
    },

    // Supprimer un job
    deleteJob: async (jobId) => {
        const response = await api.delete(`/jobs/${jobId}`);
        return response.data;
    },

    // Postuler à un job
    applyForJob: async (jobId, applicationData) => {
        const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
        return response.data;
    },

    // Obtenir les candidatures pour un job (entreprises seulement)
    getJobApplications: async (jobId, page = 1) => {
        const response = await api.get(`/jobs/${jobId}/applications?page=${page}`);
        return response.data;
    },

    // Rechercher des jobs
    searchJobs: async (query, page = 1) => {
        const params = new URLSearchParams({
            search: query,
            page
        });
        const response = await api.get(`/jobs/search?${params}`);
        return response.data;
    },

    // Obtenir les statistiques des jobs (entreprises seulement)
    getJobStats: async () => {
        const response = await api.get('/jobs/stats');
        return response.data;
    },

    // Obtenir les jobs recommandés pour un utilisateur
    getRecommendedJobs: async () => {
        const response = await api.get('/jobs/recommended');
        return response.data;
    }
};
