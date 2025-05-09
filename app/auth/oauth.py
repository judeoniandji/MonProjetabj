from flask import current_app, url_for, request, jsonify
from requests_oauthlib import OAuth2Session
from app.auth import bp
from app.models import User, Profile
from app import db
from flask_jwt_extended import create_access_token, create_refresh_token

def get_google_oauth():
    google = OAuth2Session(
        current_app.config['OAUTH_CREDENTIALS']['google']['client_id'],
        scope=['openid', 'email', 'profile'],
        redirect_uri=url_for('auth.google_callback', _external=True)
    )
    return google

def get_facebook_oauth():
    facebook = OAuth2Session(
        current_app.config['OAUTH_CREDENTIALS']['facebook']['client_id'],
        scope=['email', 'public_profile'],
        redirect_uri=url_for('auth.facebook_callback', _external=True)
    )
    return facebook

def get_linkedin_oauth():
    linkedin = OAuth2Session(
        current_app.config['OAUTH_CREDENTIALS']['linkedin']['client_id'],
        scope=['r_liteprofile', 'r_emailaddress'],
        redirect_uri=url_for('auth.linkedin_callback', _external=True)
    )
    return linkedin

@bp.route('/login/google')
def google_login():
    google = get_google_oauth()
    authorization_url, state = google.authorization_url(
        'https://accounts.google.com/o/oauth2/auth',
        access_type='offline',
        prompt='select_account'
    )
    return jsonify({'authorization_url': authorization_url})

@bp.route('/login/google/callback')
def google_callback():
    google = get_google_oauth()
    token = google.fetch_token(
        'https://accounts.google.com/o/oauth2/token',
        client_secret=current_app.config['OAUTH_CREDENTIALS']['google']['client_secret'],
        authorization_response=request.url
    )
    
    resp = google.get('https://www.googleapis.com/oauth2/v1/userinfo')
    user_info = resp.json()
    
    user = User.query.filter_by(email=user_info['email']).first()
    if not user:
        user = User(
            email=user_info['email'],
            user_type='student'  # Default type for OAuth users
        )
        profile = Profile(
            full_name=user_info.get('name', ''),
            user=user
        )
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_type': user.user_type
    })

@bp.route('/login/facebook')
def facebook_login():
    facebook = get_facebook_oauth()
    authorization_url, state = facebook.authorization_url(
        'https://www.facebook.com/v12.0/dialog/oauth'
    )
    return jsonify({'authorization_url': authorization_url})

@bp.route('/login/facebook/callback')
def facebook_callback():
    facebook = get_facebook_oauth()
    token = facebook.fetch_token(
        'https://graph.facebook.com/v12.0/oauth/access_token',
        client_secret=current_app.config['OAUTH_CREDENTIALS']['facebook']['client_secret'],
        authorization_response=request.url
    )
    
    # Get user profile information
    resp = facebook.get('https://graph.facebook.com/me?fields=id,name,email')
    user_info = resp.json()
    
    email = user_info.get('email')
    if not email:
        return jsonify({'error': 'Email not provided by Facebook'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            user_type='student'  # Default type for Facebook users
        )
        profile = Profile(
            full_name=user_info.get('name', ''),
            user=user
        )
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_type': user.user_type
    })

@bp.route('/login/linkedin')
def linkedin_login():
    linkedin = get_linkedin_oauth()
    authorization_url, state = linkedin.authorization_url(
        'https://www.linkedin.com/oauth/v2/authorization'
    )
    return jsonify({'authorization_url': authorization_url})

@bp.route('/login/linkedin/callback')
def linkedin_callback():
    linkedin = get_linkedin_oauth()
    token = linkedin.fetch_token(
        'https://www.linkedin.com/oauth/v2/accessToken',
        client_secret=current_app.config['OAUTH_CREDENTIALS']['linkedin']['client_secret'],
        authorization_response=request.url
    )
    
    # Get user profile information
    resp = linkedin.get('https://api.linkedin.com/v2/me')
    profile_data = resp.json()
    
    # Get email address
    email_resp = linkedin.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))')
    email_data = email_resp.json()
    email = email_data['elements'][0]['handle~']['emailAddress']
    
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            user_type='professional'  # Default type for LinkedIn users
        )
        profile = Profile(
            full_name=f"{profile_data.get('localizedFirstName', '')} {profile_data.get('localizedLastName', '')}",
            user=user
        )
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_type': user.user_type
    })

# API endpoints pour l'authentification sociale côté frontend
@bp.route('/api/auth/social/google', methods=['POST'])
def api_google_auth():
    data = request.get_json()
    if not data or 'token' not in data:
        return jsonify({'error': 'Token Google manquant'}), 400
    
    # Dans une implémentation réelle, nous vérifierions le token avec Google
    # Pour cette démonstration, nous simulons simplement une authentification réussie
    
    email = data.get('email', 'user@gmail.com')
    name = data.get('name', 'Utilisateur Google')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            user_type='student'
        )
        profile = Profile(
            full_name=name,
            user=user
        )
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'user_type': user.user_type,
            'name': user.profile.full_name if user.profile else name
        }
    })

@bp.route('/api/auth/social/facebook', methods=['POST'])
def api_facebook_auth():
    data = request.get_json()
    if not data or 'token' not in data:
        return jsonify({'error': 'Token Facebook manquant'}), 400
    
    # Dans une implémentation réelle, nous vérifierions le token avec Facebook
    # Pour cette démonstration, nous simulons simplement une authentification réussie
    
    email = data.get('email', 'user@facebook.com')
    name = data.get('name', 'Utilisateur Facebook')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            user_type='student'
        )
        profile = Profile(
            full_name=name,
            user=user
        )
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'user_type': user.user_type,
            'name': user.profile.full_name if user.profile else name
        }
    })
