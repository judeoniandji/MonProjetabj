from flask import jsonify, request, render_template, redirect, url_for, flash, current_app, g
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_login import login_user, logout_user, current_user, login_required
from app.auth import bp
from app.models.user import User
from app.models.profile import Profile
from app import db, mail
from werkzeug.security import generate_password_hash
from flask_mail import Message
from datetime import datetime, timedelta
import secrets
from oauthlib.oauth2 import WebApplicationClient
import requests
import json
import random
import string

def get_google_provider_cfg():
    return requests.get(current_app.config['GOOGLE_DISCOVERY_URL']).json()

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
        
    if request.method == 'POST':
        data = request.form
        
        # Validation minimale des données
        if not data.get('email') or not data.get('password'):
            flash('Email et mot de passe sont requis', 'error')
            return redirect(url_for('auth.register'))
        
        # Vérification de l'email
        if User.query.filter_by(email=data['email']).first():
            flash('Email déjà enregistré', 'error')
            return redirect(url_for('auth.register'))
        
        try:
            user = User(
                email=data['email'],
                user_type=data.get('user_type', 'student')
            )
            user.set_password(data['password'])
            
            profile = Profile(
                full_name=data.get('full_name', 'Utilisateur'),
                user=user
            )
            
            db.session.add(user)
            db.session.add(profile)
            db.session.commit()
            
            login_user(user)
            return redirect(url_for('main.index'))
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Erreur lors de l\'inscription: {str(e)}')
            flash('Une erreur est survenue lors de l\'inscription', 'error')
            return redirect(url_for('auth.register'))
    
    return render_template('auth/register.html')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
        
    if request.method == 'POST':
        # Validation des données
        if not all(key in request.form for key in ['email', 'password']):
            flash('Email et mot de passe requis', 'error')
            return redirect(url_for('auth.login'))
            
        try:
            user = User.query.filter_by(email=request.form['email']).first()
            if user and user.check_password(request.form['password']):
                # Vérification du next parameter pour éviter les redirections malveillantes
                next_page = request.args.get('next')
                if next_page and not next_page.startswith('/'):
                    next_page = None
                    
                login_user(user)
                return redirect(next_page or url_for('main.index'))
                
            flash('Email ou mot de passe invalide', 'error')
            current_app.logger.warning(f'Tentative de connexion échouée pour l\'email: {request.form["email"]}')
            
        except Exception as e:
            current_app.logger.error(f'Erreur lors de la connexion: {str(e)}')
            flash('Une erreur est survenue lors de la connexion', 'error')
            
    return render_template('auth/login.html')

@bp.route('/login/google')
def google_login():
    google_client = WebApplicationClient(current_app.config['GOOGLE_CLIENT_ID'])
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    
    request_uri = google_client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for('auth.google_callback', _external=True),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@bp.route('/login/google/callback')
def google_callback():
    code = request.args.get('code')
    google_client = WebApplicationClient(current_app.config['GOOGLE_CLIENT_ID'])
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    
    token_url, headers, body = google_client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=url_for('auth.google_callback', _external=True),
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(current_app.config['GOOGLE_CLIENT_ID'], current_app.config['GOOGLE_CLIENT_SECRET']),
    )

    google_client.parse_request_body_response(json.dumps(token_response.json()))
    
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = google_client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)
    
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        users_name = userinfo_response.json()["name"]
        
        user = User.query.filter_by(email=users_email).first()
        if not user:
            user = User(
                email=users_email,
                user_type='student'  # Default type for OAuth users
            )
            profile = Profile(
                full_name=users_name,
                user=user
            )
            db.session.add(user)
            db.session.add(profile)
            db.session.commit()
        
        login_user(user)
        return redirect(url_for('main.index'))
    else:
        flash("Google authentication failed", "error")
        return redirect(url_for('auth.login'))

@bp.route('/login/linkedin')
def linkedin_login():
    return redirect(url_for('auth.login'))  # Temporarily disabled

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    if request.method == 'POST':
        email = request.form['email']
        user = User.query.filter_by(email=email).first()
        if user:
            token = secrets.token_urlsafe(32)
            user.reset_token = token
            user.reset_token_expiry = datetime.utcnow() + timedelta(hours=24)
            db.session.commit()
            
            reset_url = url_for('auth.reset_password', token=token, _external=True)
            msg = Message('Password Reset Request',
                        sender='noreply@campusconnect.com',
                        recipients=[user.email])
            msg.body = f'''To reset your password, visit the following link:
{reset_url}

If you did not make this request then simply ignore this email and no changes will be made.
'''
            mail.send(msg)
            flash('Check your email for the instructions to reset your password', 'info')
            return redirect(url_for('auth.login'))
        flash('Email address not found', 'error')
    return render_template('auth/reset_password_request.html')

@bp.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    user = User.query.filter_by(reset_token=token).first()
    if user is None or (user.reset_token_expiry and user.reset_token_expiry < datetime.utcnow()):
        flash('Invalid or expired reset token', 'error')
        return redirect(url_for('auth.login'))
    
    if request.method == 'POST':
        user.set_password(request.form['password'])
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()
        flash('Your password has been reset.', 'success')
        return redirect(url_for('auth.login'))
    
    return render_template('auth/reset_password.html')

from app.auth.basic_auth import basic_auth, generate_auth_tokens

@bp.route('/api/auth/login', methods=['POST'])
@basic_auth.login_required
def api_auth_login():
    """Route d'API pour la connexion avec HTTP Basic Auth"""
    # L'utilisateur est déjà authentifié par le décorateur basic_auth.login_required
    user = g.current_user
    
    # Générer des tokens JWT pour l'authentification ultérieure
    tokens = generate_auth_tokens(user)
    
    # Journaliser la connexion
    current_app.logger.info(f'Connexion réussie pour l\'utilisateur: {user.email}')
    
    return jsonify(tokens), 200

@bp.route('/api/auth/register', methods=['POST'])
def api_auth_register():
    """Route d'API pour l'inscription avec authentification HTTP Basic"""
    data = request.get_json()
    
    # Validation des données
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({
            'error': 'Données invalides',
            'message': 'Email, mot de passe et nom sont requis'
        }), 400
    
    # Vérification de l'email
    if User.query.filter_by(email=data['email']).first():
        return jsonify({
            'error': 'Email déjà utilisé',
            'message': 'Un compte avec cet email existe déjà'
        }), 409
    
    try:
        # Création de l'utilisateur
        user = User(
            email=data['email'],
            user_type=data.get('userType', 'student')
        )
        user.set_password(data['password'])
        
        # Création du profil
        profile = Profile(
            full_name=data['name'],
            user=user
        )
        
        # Ajout des champs spécifiques au profil selon le type d'utilisateur
        if data.get('userType') == 'student':
            profile.school = data.get('school')
            profile.field_of_study = data.get('fieldOfStudy')
            profile.skills = data.get('skills', [])
            profile.interests = data.get('interests', [])
            profile.career_goals = data.get('careerGoals')
        elif data.get('userType') == 'university':
            profile.university_name = data.get('universityName')
            profile.location = data.get('location')
            profile.programs = data.get('programs', [])
        elif data.get('userType') == 'company':
            profile.company_name = data.get('companyName')
            profile.industry = data.get('industry')
            profile.job_sectors = data.get('jobSectors', [])
        elif data.get('userType') == 'mentor':
            profile.expertise = data.get('expertise')
            profile.mentor_skills = data.get('mentorSkills', [])
            profile.mentor_experience = data.get('mentorExperience')
            profile.availability_hours = data.get('availabilityHours')
        
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
        
        # Générer des tokens JWT pour l'authentification ultérieure
        tokens = generate_auth_tokens(user)
        
        # Journaliser l'inscription
        current_app.logger.info(f'Inscription réussie pour l\'utilisateur: {user.email}')
        
        return jsonify(tokens), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Erreur lors de l\'inscription: {str(e)}')
        return jsonify({
            'error': 'Erreur serveur',
            'message': 'Une erreur est survenue lors de l\'inscription'
        }), 500

@bp.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def api_auth_get_profile():
    """Récupérer le profil de l'utilisateur connecté"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({
            'error': 'Utilisateur non trouvé',
            'message': 'L\'utilisateur n\'existe pas'
        }), 404
    
    profile = user.profile
    
    # Construire la réponse selon le type d'utilisateur
    response = {
        'id': user.id,
        'email': user.email,
        'user_type': user.user_type,
        'name': profile.full_name if profile else None,
    }
    
    # Ajouter les champs spécifiques selon le type d'utilisateur
    if user.user_type == 'student' and profile:
        response.update({
            'school': profile.school,
            'field_of_study': profile.field_of_study,
            'skills': profile.skills,
            'interests': profile.interests,
            'career_goals': profile.career_goals
        })
    elif user.user_type == 'university' and profile:
        response.update({
            'university_name': profile.university_name,
            'location': profile.location,
            'programs': profile.programs
        })
    elif user.user_type == 'company' and profile:
        response.update({
            'company_name': profile.company_name,
            'industry': profile.industry,
            'job_sectors': profile.job_sectors
        })
    elif user.user_type == 'mentor' and profile:
        response.update({
            'expertise': profile.expertise,
            'mentor_skills': profile.mentor_skills,
            'mentor_experience': profile.mentor_experience,
            'availability_hours': profile.availability_hours
        })
    
    return jsonify(response), 200

@bp.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def api_auth_update_profile():
    """Mettre à jour le profil de l'utilisateur connecté"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({
            'error': 'Utilisateur non trouvé',
            'message': 'L\'utilisateur n\'existe pas'
        }), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({
            'error': 'Données invalides',
            'message': 'Aucune donnée fournie'
        }), 400
    
    try:
        profile = user.profile
        
        if not profile:
            profile = Profile(user=user)
            db.session.add(profile)
        
        # Mettre à jour les champs de base
        if data.get('name'):
            profile.full_name = data['name']
        
        # Mettre à jour les champs spécifiques selon le type d'utilisateur
        if user.user_type == 'student':
            if 'school' in data:
                profile.school = data['school']
            if 'fieldOfStudy' in data:
                profile.field_of_study = data['fieldOfStudy']
            if 'skills' in data:
                profile.skills = data['skills']
            if 'interests' in data:
                profile.interests = data['interests']
            if 'careerGoals' in data:
                profile.career_goals = data['careerGoals']
        elif user.user_type == 'university':
            if 'universityName' in data:
                profile.university_name = data['universityName']
            if 'location' in data:
                profile.location = data['location']
            if 'programs' in data:
                profile.programs = data['programs']
        elif user.user_type == 'company':
            if 'companyName' in data:
                profile.company_name = data['companyName']
            if 'industry' in data:
                profile.industry = data['industry']
            if 'jobSectors' in data:
                profile.job_sectors = data['jobSectors']
        elif user.user_type == 'mentor':
            if 'expertise' in data:
                profile.expertise = data['expertise']
            if 'mentorSkills' in data:
                profile.mentor_skills = data['mentorSkills']
            if 'mentorExperience' in data:
                profile.mentor_experience = data['mentorExperience']
            if 'availabilityHours' in data:
                profile.availability_hours = data['availabilityHours']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profil mis à jour avec succès'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Erreur lors de la mise à jour du profil: {str(e)}')
        return jsonify({
            'error': 'Erreur serveur',
            'message': 'Une erreur est survenue lors de la mise à jour du profil'
        }), 500

@bp.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def api_auth_logout():
    """Déconnecter l'utilisateur"""
    # La déconnexion est gérée côté client en supprimant les tokens
    # Ici, nous pourrions ajouter le token à une liste noire si nécessaire
    
    return jsonify({
        'message': 'Déconnexion réussie'
    }), 200
