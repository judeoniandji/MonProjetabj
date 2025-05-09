"""
Routes pour les fonctionnalités d'IA de l'application Campus Connect
"""

from flask import jsonify, request, current_app
from app.ai import bp
from backend.ai.job_recommendation import initialize_engine, get_job_recommendations, record_user_interaction
from app.senegal.data import SENEGAL_JOBS
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialiser le moteur de recommandation avec les offres d'emploi sénégalaises
try:
    initialize_engine(SENEGAL_JOBS)
    logger.info("Moteur de recommandation d'emploi initialisé avec succès")
except Exception as e:
    logger.error(f"Erreur lors de l'initialisation du moteur de recommandation: {e}")

@bp.route('/jobs/recommendations', methods=['POST'])
def get_ai_job_recommendations():
    """
    Obtient des recommandations d'emploi personnalisées basées sur l'IA
    Utilise à la fois le profil de l'utilisateur et son historique d'interactions
    """
    data = request.get_json()
    
    if not data or 'user' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Données utilisateur requises'
        }), 400
    
    user = data['user']
    user_id = data.get('user_id')
    top_n = data.get('limit', 10)
    
    try:
        # Obtenir les recommandations personnalisées
        recommendations = get_job_recommendations(user, user_id, top_n=top_n)
        
        return jsonify({
            'status': 'success',
            'count': len(recommendations),
            'data': recommendations
        })
    except Exception as e:
        logger.error(f"Erreur lors de la génération des recommandations: {e}")
        return jsonify({
            'status': 'error',
            'message': "Une erreur s'est produite lors de la génération des recommandations"
        }), 500

@bp.route('/jobs/interaction', methods=['POST'])
def record_job_interaction():
    """
    Enregistre une interaction utilisateur-emploi pour améliorer les recommandations futures
    Types d'interactions: 'view', 'apply', 'save', 'dismiss'
    """
    data = request.get_json()
    
    if not data or 'user_id' not in data or 'job_id' not in data or 'interaction_type' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Données d\'interaction incomplètes'
        }), 400
    
    user_id = data['user_id']
    job_id = data['job_id']
    interaction_type = data['interaction_type']
    
    # Vérifier que le type d'interaction est valide
    valid_types = ['view', 'apply', 'save', 'dismiss']
    if interaction_type not in valid_types:
        return jsonify({
            'status': 'error',
            'message': f'Type d\'interaction invalide. Valeurs acceptées: {", ".join(valid_types)}'
        }), 400
    
    try:
        # Enregistrer l'interaction
        record_user_interaction(user_id, job_id, interaction_type)
        
        return jsonify({
            'status': 'success',
            'message': 'Interaction enregistrée avec succès'
        })
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement de l'interaction: {e}")
        return jsonify({
            'status': 'error',
            'message': "Une erreur s'est produite lors de l'enregistrement de l'interaction"
        }), 500

@bp.route('/jobs/insights', methods=['GET'])
def get_job_market_insights():
    """
    Fournit des insights sur le marché de l'emploi basés sur l'analyse des données
    et les tendances observées
    """
    try:
        # Dans une implémentation réelle, ces insights seraient générés dynamiquement
        # à partir de l'analyse des données et des interactions utilisateurs
        insights = {
            'trending_skills': [
                {'skill': 'python', 'growth': 15},
                {'skill': 'react', 'growth': 12},
                {'skill': 'data_analysis', 'growth': 10},
                {'skill': 'machine_learning', 'growth': 18},
                {'skill': 'mobile_development', 'growth': 8}
            ],
            'growing_industries': [
                {'industry': 'Fintech', 'growth': 22},
                {'industry': 'Énergie', 'growth': 15},
                {'industry': 'Télécommunications', 'growth': 10},
                {'industry': 'E-commerce', 'growth': 18}
            ],
            'salary_trends': {
                'overall_growth': 5,
                'by_field': {
                    'computer_science': 8,
                    'finance': 6,
                    'marketing': 4,
                    'telecommunications': 7
                }
            },
            'location_demand': [
                {'location': 'Dakar', 'demand': 'Très élevée'},
                {'location': 'Saint-Louis', 'demand': 'Modérée'},
                {'location': 'Thiès', 'demand': 'Élevée'},
                {'location': 'Ziguinchor', 'demand': 'En croissance'}
            ]
        }
        
        return jsonify({
            'status': 'success',
            'data': insights
        })
    except Exception as e:
        logger.error(f"Erreur lors de la génération des insights: {e}")
        return jsonify({
            'status': 'error',
            'message': "Une erreur s'est produite lors de la génération des insights"
        }), 500
