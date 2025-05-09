from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.auth import bp
from app.models.user import User
from app import db
import re
from datetime import datetime, timedelta
import secrets

# API routes for password reset
@bp.route('/reset_password_request', methods=['POST'])
def api_reset_password_request():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'error': 'Email requis'}), 400
        
        # Validation du format email
        if not re.match(r'^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$', data['email']):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        if user:
            # Génération du token
            token = secrets.token_urlsafe(32)
            user.reset_password_token = token
            user.reset_password_expires = datetime.utcnow() + timedelta(hours=24)
            db.session.commit()
            
            # Ici, vous devriez envoyer un email avec le lien de réinitialisation
            # send_password_reset_email(user, token)
            
        # Pour des raisons de sécurité, nous retournons toujours un succès
        # même si l'email n'existe pas dans la base de données
        return jsonify({'message': 'Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/reset_password/<token>', methods=['POST'])
def api_reset_password(token):
    try:
        data = request.get_json()
        if not data or 'password' not in data:
            return jsonify({'error': 'Mot de passe requis'}), 400
        
        # Validation du mot de passe
        if len(data['password']) < 8:
            return jsonify({'error': 'Le mot de passe doit contenir au moins 8 caractères'}), 400
        
        user = User.query.filter_by(reset_password_token=token).first()
        if not user or user.reset_password_expires < datetime.utcnow():
            return jsonify({'error': 'Le lien de réinitialisation est invalide ou a expiré'}), 400
        
        # Mise à jour du mot de passe
        user.password_hash = generate_password_hash(data['password'])
        user.reset_password_token = None
        user.reset_password_expires = None
        db.session.commit()
        
        return jsonify({'message': 'Votre mot de passe a été réinitialisé avec succès'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500