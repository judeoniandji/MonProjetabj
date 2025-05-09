from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from app import db
from app.models.user import User
from app.models.profile import Profile
from app.models.message import Message
from app.models.job import Job
from app.models.application import Application
from app.models.event import Event
from app.models.event_participant import EventParticipant
from app.models.skill import Skill
from app.models.badges import Badge
from app.models.internship import Internship
from app.models.mentoring_session import MentoringSession
import os
import sys
import subprocess
from datetime import datetime

bp = Blueprint('admin_api', __name__)

@bp.route('/reset-database', methods=['POST'])
@login_required
def reset_database():
    """
    Route API pour réinitialiser la base de données.
    Accessible uniquement aux administrateurs.
    """
    # Vérifier si l'utilisateur est un administrateur
    if current_user.user_type != 'admin':
        return jsonify({
            'success': False,
            'message': 'Accès non autorisé. Seuls les administrateurs peuvent réinitialiser la base de données.'
        }), 403
    
    try:
        # Exécuter le script de réinitialisation
        script_path = os.path.join(current_app.root_path, 'db_reset.py')
        
        # Option 1: Exécuter directement dans le même processus
        # Cette méthode est plus simple mais peut causer des problèmes si le script modifie l'état de l'application
        from app.db_reset import reset_database as reset_db_function
        reset_db_function()
        
        return jsonify({
            'success': True,
            'message': 'Base de données réinitialisée avec succès.'
        })
    except Exception as e:
        current_app.logger.error(f"Erreur lors de la réinitialisation de la base de données: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la réinitialisation de la base de données: {str(e)}'
        }), 500

@bp.route('/user-stats', methods=['GET'])
@login_required
def get_user_stats():
    """
    Récupère des statistiques sur les utilisateurs pour le tableau de bord administrateur.
    """
    if current_user.user_type != 'admin':
        return jsonify({
            'success': False,
            'message': 'Accès non autorisé'
        }), 403
    
    try:
        # Compter les utilisateurs par type
        total_users = User.query.count()
        students = User.query.filter_by(user_type='student').count()
        companies = User.query.filter_by(user_type='company').count()
        universities = User.query.filter_by(user_type='school').count()
        admins = User.query.filter_by(user_type='admin').count()
        
        # Compter les utilisateurs créés au cours des 30 derniers jours
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        new_users = User.query.filter(User.created_at >= thirty_days_ago).count()
        
        # Compter les utilisateurs actifs (connectés au cours des 7 derniers jours)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        active_users = User.query.filter(User.last_login >= seven_days_ago).count()
        
        return jsonify({
            'success': True,
            'data': {
                'total_users': total_users,
                'students': students,
                'companies': companies,
                'universities': universities,
                'admins': admins,
                'new_users_last_30_days': new_users,
                'active_users_last_7_days': active_users
            }
        })
    except Exception as e:
        current_app.logger.error(f"Erreur lors de la récupération des statistiques utilisateurs: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la récupération des statistiques: {str(e)}'
        }), 500

@bp.route('/users', methods=['GET'])
@login_required
def get_users():
    """
    Récupère la liste des utilisateurs avec pagination.
    """
    if current_user.user_type != 'admin':
        return jsonify({
            'success': False,
            'message': 'Accès non autorisé'
        }), 403
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        user_type = request.args.get('user_type', None)
        
        query = User.query
        
        # Filtrer par type d'utilisateur si spécifié
        if user_type:
            query = query.filter_by(user_type=user_type)
        
        # Paginer les résultats
        pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page)
        
        users = []
        for user in pagination.items:
            user_data = user.to_dict()
            # Ajouter des informations du profil si disponible
            if user.profile:
                user_data['full_name'] = user.profile.full_name
                user_data['location'] = user.profile.location
            users.append(user_data)
        
        return jsonify({
            'success': True,
            'data': {
                'users': users,
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': page
            }
        })
    except Exception as e:
        current_app.logger.error(f"Erreur lors de la récupération des utilisateurs: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la récupération des utilisateurs: {str(e)}'
        }), 500

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    """
    Supprime un utilisateur et toutes ses données associées.
    """
    if current_user.user_type != 'admin':
        return jsonify({
            'success': False,
            'message': 'Accès non autorisé'
        }), 403
    
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'Utilisateur non trouvé'
            }), 404
        
        # Empêcher la suppression de son propre compte
        if user.id == current_user.id:
            return jsonify({
                'success': False,
                'message': 'Vous ne pouvez pas supprimer votre propre compte'
            }), 400
        
        # Supprimer l'utilisateur (la cascade supprimera les relations)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Utilisateur {user.email} supprimé avec succès'
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Erreur lors de la suppression de l'utilisateur: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la suppression de l\'utilisateur: {str(e)}'
        }), 500
