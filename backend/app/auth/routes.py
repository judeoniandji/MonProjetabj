from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.auth import bp
from app.models import User, Profile
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
import re
from sqlalchemy.exc import SQLAlchemyError

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Données JSON manquantes'}), 400

        # Validation des champs requis
        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Le champ {field} est requis'}), 400

        # Validation du format email
        if not re.match(r'^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$', data['email']):
            return jsonify({'error': 'Format d\'email invalide'}), 400

        # Validation du mot de passe
        if len(data['password']) < 8:
            return jsonify({'error': 'Le mot de passe doit contenir au moins 8 caractères'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email déjà utilisé'}), 400

        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()

        profile = Profile(user_id=user.id)
        db.session.add(profile)
        db.session.commit()

        access_token = create_access_token(identity=user.id)

        return jsonify({
        'message': 'Inscription réussie',
        'token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'profile': {
                'full_name': profile.full_name,
                'title': profile.title
            }
        }
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Données JSON manquantes'}), 400

        # Validation des champs requis
        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Le champ {field} est requis'}), 400

        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
            'message': 'Connexion réussie',
            'token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'profile': {
                    'full_name': user.profile.full_name,
                    'title': user.profile.title
                }
            }
        })
    
    return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    return jsonify({
        'user': {
            'id': user.id,
            'email': user.email,
            'profile': {
                'full_name': user.profile.full_name,
                'title': user.profile.title,
                'bio': user.profile.bio,
                'avatar_url': user.profile.avatar_url,
                'skills': user.profile.skills,
                'experiences': user.profile.experiences,
                'education': user.profile.education,
                'badges': user.profile.badges,
                'linkedin_url': user.profile.linkedin_url,
                'github_url': user.profile.github_url,
                'portfolio_url': user.profile.portfolio_url
            }
        }
    })

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Données JSON manquantes'}), 400

        # Validation des URLs
        url_fields = ['linkedin_url', 'github_url', 'portfolio_url']
        for field in url_fields:
            if field in data and data[field]:
                if not re.match(r'^https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', data[field]):
                    return jsonify({'error': f'Format d\'URL invalide pour {field}'}), 400

        # Validation des champs texte
        text_fields = ['full_name', 'title', 'bio']
        for field in text_fields:
            if field in data:
                if not isinstance(data[field], str) or len(data[field].strip()) > 500:
                    return jsonify({'error': f'Format invalide pour {field}'}), 400
                data[field] = data[field].strip()

        # Mise à jour des champs
        if 'full_name' in data:
            user.profile.full_name = data['full_name']
        if 'title' in data:
            user.profile.title = data['title']
        if 'bio' in data:
            user.profile.bio = data['bio']
        if 'skills' in data:
            user.profile.skills = data['skills']
        if 'experiences' in data:
            user.profile.experiences = data['experiences']
        if 'education' in data:
            user.profile.education = data['education']
        if 'linkedin_url' in data:
            user.profile.linkedin_url = data['linkedin_url']
        if 'github_url' in data:
            user.profile.github_url = data['github_url']
        if 'portfolio_url' in data:
            user.profile.portfolio_url = data['portfolio_url']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profil mis à jour avec succès',
        'user': {
            'id': user.id,
            'email': user.email,
            'profile': {
                'full_name': user.profile.full_name,
                'title': user.profile.title,
                'bio': user.profile.bio,
                'avatar_url': user.profile.avatar_url,
                'skills': user.profile.skills,
                'experiences': user.profile.experiences,
                'education': user.profile.education,
                'badges': user.profile.badges,
                'linkedin_url': user.profile.linkedin_url,
                'github_url': user.profile.github_url,
                'portfolio_url': user.profile.portfolio_url
            }
        }
    })