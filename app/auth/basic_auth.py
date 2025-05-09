from flask import request, jsonify, current_app, g
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, create_refresh_token

# Initialiser l'authentification HTTP Basic
basic_auth = HTTPBasicAuth()

@basic_auth.verify_password
def verify_password(username, password):
    """Vérifier les identifiants de l'utilisateur"""
    user = User.query.filter_by(email=username).first()
    if user and check_password_hash(user.password_hash, password):
        g.current_user = user
        return user
    return None

@basic_auth.error_handler
def auth_error():
    """Gérer les erreurs d'authentification"""
    return jsonify({
        'error': 'Authentification échouée',
        'message': 'Email ou mot de passe incorrect'
    }), 401

def token_auth_required(f):
    """Décorateur pour les routes qui nécessitent un token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'error': 'Authentification requise',
                'message': 'Token JWT manquant ou invalide'
            }), 401
            
        # Logique de vérification du token JWT ici
        # Cette partie serait normalement gérée par flask_jwt_extended
        
        return f(*args, **kwargs)
    return decorated

def generate_auth_tokens(user):
    """Générer des tokens d'authentification pour un utilisateur"""
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'user_type': user.user_type,
            'name': user.profile.full_name if user.profile else None
        }
    }
