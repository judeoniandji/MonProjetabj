import pytest
import json
from app.models import User
from app import db

def test_register_route(client):
    """Test la route d'inscription."""
    # Données d'inscription valides
    data = {
        'email': 'newuser@example.com',
        'password': 'NewUser1234!',
        'confirm_password': 'NewUser1234!',
        'user_type': 'student'
    }
    
    response = client.post(
        '/api/auth/register',
        json=data,
        auth=('newuser@example.com', 'NewUser1234!')
    )
    
    # Vérifier la réponse
    assert response.status_code == 201
    response_data = json.loads(response.data)
    assert 'access_token' in response_data
    assert 'user' in response_data
    
    # Vérifier que l'utilisateur a été créé dans la base de données
    user = User.query.filter_by(email='newuser@example.com').first()
    assert user is not None
    assert user.email == 'newuser@example.com'
    assert user.user_type == 'student'

def test_login_route(client, auth):
    """Test la route de connexion."""
    # Tentative de connexion avec des identifiants valides
    response = auth.login()
    
    # Vérifier la réponse
    assert response.status_code == 200
    response_data = json.loads(response.data)
    assert response_data['success'] is True
    
    # Vérifier que les cookies sont présents
    cookies = [cookie.name for cookie in client.cookie_jar]
    assert 'access_token_cookie' in cookies
    assert 'refresh_token_cookie' in cookies
    
    # Tentative de connexion avec des identifiants invalides
    response = auth.login(email='wrong@example.com', password='WrongPassword')
    assert response.status_code == 401

def test_logout_route(client, auth):
    """Test la route de déconnexion."""
    # D'abord se connecter
    auth.login()
    
    # Puis se déconnecter
    response = auth.logout()
    
    # Vérifier la réponse
    assert response.status_code == 200
    response_data = json.loads(response.data)
    assert response_data['success'] is True
    
    # Vérifier que les cookies ont été supprimés
    cookies = [cookie.name for cookie in client.cookie_jar]
    assert 'access_token_cookie' not in cookies
    assert 'refresh_token_cookie' not in cookies

def test_register_with_user_type(client):
    """Test la route d'inscription avec différents types d'utilisateurs."""
    # Données d'inscription valides pour un étudiant
    data = {
        'name': 'Student User',
        'email': 'student@example.com',
        'password': 'SecurePass123!',
        'userType': 'student',
        'school': 'Test University',
        'fieldOfStudy': 'Computer Science'
    }
    
    response = client.post(
        '/api/auth/register',
        json=data
    )
    
    # Vérifier la réponse
    assert response.status_code == 201
    response_data = json.loads(response.data)
    assert 'access_token' in response_data
    assert 'user' in response_data
    
    # Vérifier que l'utilisateur a été créé dans la base de données
    user = User.query.filter_by(email='student@example.com').first()
    assert user is not None
    assert user.email == 'student@example.com'
    assert user.user_type == 'student'
