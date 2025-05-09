import api from './config';

export const adminService = {
    /**
     * Réinitialise la base de données
     * Cette fonction est réservée aux administrateurs
     */
    resetDatabase: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vous devez être connecté pour effectuer cette action');
            }

            const response = await api.post('/api/admin/reset-database', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000 // Augmenter le timeout car cette opération peut prendre du temps
            });

            return response.data;
        } catch (error) {
            console.error('Reset database error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la réinitialisation de la base de données');
        }
    },

    /**
     * Récupère les statistiques des utilisateurs
     */
    getUserStats: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vous devez être connecté pour effectuer cette action');
            }

            const response = await api.get('/api/admin/user-stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Get user stats error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques');
        }
    },

    /**
     * Récupère la liste des utilisateurs avec pagination
     */
    getUsers: async (page = 1, perPage = 10, userType = null) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vous devez être connecté pour effectuer cette action');
            }

            let url = `/api/admin/users?page=${page}&per_page=${perPage}`;
            if (userType) {
                url += `&user_type=${userType}`;
            }

            const response = await api.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Get users error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la récupération des utilisateurs');
        }
    },

    /**
     * Supprime un utilisateur
     */
    deleteUser: async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vous devez être connecté pour effectuer cette action');
            }

            const response = await api.delete(`/api/admin/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Delete user error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'utilisateur');
        }
    }
};

export default adminService;
