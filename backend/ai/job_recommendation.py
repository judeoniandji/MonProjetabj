"""
Module d'IA pour les recommandations d'emploi avancées
Utilise des techniques de traitement du langage naturel et d'apprentissage automatique
pour améliorer les correspondances entre utilisateurs et offres d'emploi
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import SnowballStemmer
import re
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Téléchargement des ressources NLTK nécessaires (à exécuter une seule fois)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

# Initialisation du stemmer français
stemmer = SnowballStemmer('french')
french_stopwords = set(stopwords.words('french'))

class JobRecommendationEngine:
    """Moteur de recommandation d'emploi basé sur l'IA"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words=list(french_stopwords),
            ngram_range=(1, 2)
        )
        self.job_vectors = None
        self.jobs = []
        self.user_profiles = {}
        self.collaborative_matrix = {}
        
    def preprocess_text(self, text):
        """Prétraite le texte pour l'analyse"""
        if not text:
            return ""
            
        # Conversion en minuscules et suppression des caractères spéciaux
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        
        # Tokenisation
        tokens = word_tokenize(text, language='french')
        
        # Suppression des stopwords et stemming
        tokens = [stemmer.stem(token) for token in tokens if token not in french_stopwords]
        
        return ' '.join(tokens)
    
    def create_job_profile(self, job):
        """Crée un profil textuel pour une offre d'emploi"""
        job_text = f"{job['title']} {job['description']} "
        
        # Ajouter les compétences requises
        if 'required_skills' in job and job['required_skills']:
            skills_text = ' '.join(job['required_skills'])
            job_text += f" {skills_text}"
        
        # Ajouter le domaine d'études
        if 'field_of_study' in job and job['field_of_study']:
            job_text += f" {job['field_of_study']}"
            
        # Ajouter l'industrie de l'entreprise si disponible
        if 'company_industry' in job and job['company_industry']:
            job_text += f" {job['company_industry']}"
            
        return self.preprocess_text(job_text)
    
    def create_user_profile(self, user):
        """Crée un profil textuel pour un utilisateur"""
        # Construire le profil de l'utilisateur à partir de ses informations
        user_text = ""
        
        # Ajouter le domaine d'études
        if 'field_of_study' in user and user['field_of_study']:
            user_text += f" {user['field_of_study']}"
        
        # Ajouter les compétences
        if 'skills' in user and user['skills']:
            skills = user['skills'] if isinstance(user['skills'], list) else [user['skills']]
            skills_text = ' '.join(skills)
            user_text += f" {skills_text}"
            
        # Ajouter les intérêts
        if 'interests' in user and user['interests']:
            interests = user['interests'] if isinstance(user['interests'], list) else [user['interests']]
            interests_text = ' '.join(interests)
            user_text += f" {interests_text}"
            
        # Ajouter l'expérience professionnelle
        if 'experience' in user and user['experience']:
            experience = user['experience'] if isinstance(user['experience'], list) else [user['experience']]
            experience_text = ' '.join(experience)
            user_text += f" {experience_text}"
            
        # Ajouter la localisation préférée
        if 'location' in user and user['location']:
            user_text += f" {user['location']}"
            
        return self.preprocess_text(user_text)
    
    def fit(self, jobs):
        """Entraîne le modèle avec les offres d'emploi disponibles"""
        self.jobs = jobs
        
        # Créer des profils textuels pour chaque offre d'emploi
        job_profiles = [self.create_job_profile(job) for job in jobs]
        
        # Vectoriser les profils d'offres d'emploi
        try:
            self.job_vectors = self.vectorizer.fit_transform(job_profiles)
            logger.info(f"Modèle entraîné avec succès sur {len(jobs)} offres d'emploi")
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement du modèle: {e}")
            raise
    
    def get_content_based_recommendations(self, user, top_n=10):
        """Obtient des recommandations basées sur le contenu pour un utilisateur"""
        if self.job_vectors is None:
            logger.error("Le modèle n'a pas été entraîné. Appelez fit() d'abord.")
            return []
        
        # Créer un profil textuel pour l'utilisateur
        user_profile = self.create_user_profile(user)
        
        # Vectoriser le profil utilisateur
        user_vector = self.vectorizer.transform([user_profile])
        
        # Calculer la similarité cosinus entre l'utilisateur et toutes les offres d'emploi
        similarities = cosine_similarity(user_vector, self.job_vectors).flatten()
        
        # Obtenir les indices des offres les plus similaires
        top_indices = similarities.argsort()[-top_n:][::-1]
        
        # Récupérer les offres recommandées avec leurs scores
        recommendations = []
        for idx in top_indices:
            job = self.jobs[idx]
            similarity_score = similarities[idx]
            
            # Convertir le score en pourcentage
            match_score = int(similarity_score * 100)
            
            # Ajouter le score de correspondance à l'offre
            job_with_score = job.copy()
            job_with_score['ai_match_score'] = match_score
            
            recommendations.append(job_with_score)
            
        return recommendations
    
    def update_user_interaction(self, user_id, job_id, interaction_type, weight=1.0):
        """
        Met à jour la matrice d'interactions utilisateur-emploi
        interaction_type: 'view', 'apply', 'save', 'dismiss'
        weight: poids de l'interaction (plus élevé pour les actions plus significatives)
        """
        if user_id not in self.collaborative_matrix:
            self.collaborative_matrix[user_id] = {}
            
        # Définir des poids différents selon le type d'interaction
        interaction_weights = {
            'view': 0.5,
            'apply': 2.0,
            'save': 1.0,
            'dismiss': -1.0
        }
        
        actual_weight = interaction_weights.get(interaction_type, weight)
        
        # Mettre à jour ou ajouter l'interaction
        if job_id in self.collaborative_matrix[user_id]:
            self.collaborative_matrix[user_id][job_id] += actual_weight
        else:
            self.collaborative_matrix[user_id][job_id] = actual_weight
    
    def get_collaborative_recommendations(self, user_id, top_n=10):
        """
        Obtient des recommandations basées sur le filtrage collaboratif
        Recommande des emplois que des utilisateurs similaires ont aimés
        """
        if user_id not in self.collaborative_matrix or not self.collaborative_matrix[user_id]:
            logger.info(f"Pas d'historique d'interactions pour l'utilisateur {user_id}")
            return []
            
        # Trouver des utilisateurs similaires
        user_similarities = {}
        target_interactions = self.collaborative_matrix[user_id]
        
        for other_id, other_interactions in self.collaborative_matrix.items():
            if other_id == user_id:
                continue
                
            # Calculer la similarité entre les utilisateurs
            similarity = self._calculate_user_similarity(target_interactions, other_interactions)
            if similarity > 0:
                user_similarities[other_id] = similarity
        
        # Si aucun utilisateur similaire n'est trouvé
        if not user_similarities:
            logger.info(f"Aucun utilisateur similaire trouvé pour {user_id}")
            return []
            
        # Calculer les scores de recommandation pour chaque emploi
        job_scores = {}
        for other_id, similarity in user_similarities.items():
            other_interactions = self.collaborative_matrix[other_id]
            
            for job_id, score in other_interactions.items():
                # Ignorer les emplois que l'utilisateur a déjà interagi avec
                if job_id in target_interactions:
                    continue
                    
                # Pondérer le score par la similarité de l'utilisateur
                weighted_score = score * similarity
                
                if job_id in job_scores:
                    job_scores[job_id] += weighted_score
                else:
                    job_scores[job_id] = weighted_score
        
        # Trier les emplois par score et prendre les top_n
        top_job_ids = sorted(job_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
        
        # Récupérer les offres complètes
        recommendations = []
        for job_id, score in top_job_ids:
            # Trouver l'offre correspondante
            job = next((j for j in self.jobs if j['id'] == job_id), None)
            if job:
                job_copy = job.copy()
                # Normaliser le score entre 0 et 100
                normalized_score = min(100, max(0, int(score * 50 + 50)))
                job_copy['ai_match_score'] = normalized_score
                recommendations.append(job_copy)
                
        return recommendations
    
    def _calculate_user_similarity(self, user1_interactions, user2_interactions):
        """Calcule la similarité entre deux utilisateurs basée sur leurs interactions"""
        # Trouver les emplois que les deux utilisateurs ont évalués
        common_jobs = set(user1_interactions.keys()) & set(user2_interactions.keys())
        
        if not common_jobs:
            return 0
            
        # Calculer la corrélation de Pearson
        sum_xx = sum_yy = sum_xy = 0
        for job_id in common_jobs:
            x = user1_interactions[job_id]
            y = user2_interactions[job_id]
            
            sum_xx += x * x
            sum_yy += y * y
            sum_xy += x * y
            
        # Éviter la division par zéro
        if sum_xx == 0 or sum_yy == 0:
            return 0
            
        return sum_xy / (np.sqrt(sum_xx) * np.sqrt(sum_yy))
    
    def get_hybrid_recommendations(self, user, user_id=None, content_weight=0.7, top_n=10):
        """
        Combine les recommandations basées sur le contenu et le filtrage collaboratif
        pour obtenir des recommandations hybrides
        """
        # Obtenir les recommandations basées sur le contenu
        content_recs = self.get_content_based_recommendations(user, top_n=top_n*2)
        
        # Si l'ID utilisateur est fourni, obtenir les recommandations collaboratives
        collab_recs = []
        if user_id and user_id in self.collaborative_matrix:
            collab_recs = self.get_collaborative_recommendations(user_id, top_n=top_n*2)
        
        # Si nous n'avons pas de recommandations collaboratives, utiliser uniquement le contenu
        if not collab_recs:
            return content_recs[:top_n]
            
        # Fusionner les recommandations
        job_scores = {}
        
        # Ajouter les scores basés sur le contenu
        for job in content_recs:
            job_scores[job['id']] = {
                'job': job,
                'content_score': job['ai_match_score'],
                'collab_score': 0
            }
            
        # Ajouter les scores collaboratifs
        for job in collab_recs:
            if job['id'] in job_scores:
                job_scores[job['id']]['collab_score'] = job['ai_match_score']
            else:
                job_scores[job['id']] = {
                    'job': job,
                    'content_score': 0,
                    'collab_score': job['ai_match_score']
                }
        
        # Calculer les scores hybrides
        hybrid_recommendations = []
        for job_id, scores in job_scores.items():
            job = scores['job'].copy()
            
            # Calculer le score hybride pondéré
            hybrid_score = (scores['content_score'] * content_weight + 
                           scores['collab_score'] * (1 - content_weight))
            
            job['ai_match_score'] = int(hybrid_score)
            job['content_score'] = scores['content_score']
            job['collab_score'] = scores['collab_score']
            
            hybrid_recommendations.append(job)
            
        # Trier par score hybride et prendre les top_n
        hybrid_recommendations.sort(key=lambda x: x['ai_match_score'], reverse=True)
        
        return hybrid_recommendations[:top_n]


# Créer une instance singleton du moteur de recommandation
recommendation_engine = JobRecommendationEngine()

def initialize_engine(jobs):
    """Initialise le moteur de recommandation avec les offres d'emploi"""
    global recommendation_engine
    recommendation_engine.fit(jobs)
    return recommendation_engine

def get_job_recommendations(user, user_id=None, top_n=10):
    """
    Fonction utilitaire pour obtenir des recommandations d'emploi pour un utilisateur
    Utilise l'approche hybride par défaut
    """
    global recommendation_engine
    return recommendation_engine.get_hybrid_recommendations(user, user_id, top_n=top_n)

def record_user_interaction(user_id, job_id, interaction_type):
    """Enregistre une interaction utilisateur-emploi pour améliorer les recommandations futures"""
    global recommendation_engine
    recommendation_engine.update_user_interaction(user_id, job_id, interaction_type)
    return True
