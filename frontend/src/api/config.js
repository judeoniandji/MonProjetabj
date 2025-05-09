import axios from 'axios';

// Définition de l'URL de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Permet d'envoyer et recevoir des cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
    (config) => {
        // Nous n'avons plus besoin d'ajouter le token manuellement
        // car il sera envoyé automatiquement via les cookies
        console.log('API Request:', {
            url: `${config.baseURL}${config.url}`,
            method: config.method,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            data: response.data,
            url: `${response.config.baseURL}${response.config.url}`
        });
        return response;
    },
    async (error) => {
        console.error('API Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL',
            message: error.message
        });

        if (error.response) {
            // Erreur avec réponse du serveur
            const { status } = error.response;
            
            if (status === 401 && !error.config._retry) {
                error.config._retry = true;
                try {
                    // Le refresh token est maintenant envoyé automatiquement via les cookies
                    const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
                        withCredentials: true
                    });
                    
                    // Pas besoin de stocker le token, il est maintenant dans un cookie HttpOnly
                    return api(error.config);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Rediriger vers la page de connexion
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
