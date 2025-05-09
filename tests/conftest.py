import pytest
import os
import tempfile
from app import create_app, db
from app.models import User, Profile
from config import TestingConfig

@pytest.fixture
def app():
    """Créer et configurer une instance Flask pour les tests."""
    # Créer une base de données temporaire
    db_fd, db_path = tempfile.mkstemp()
    
    # Configurer l'application en mode test
    app = create_app('testing')
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'TESTING': True,
        'WTF_CSRF_ENABLED': False  # Désactiver CSRF pour les tests
    })
    
    # Créer le contexte d'application
    with app.app_context():
        # Créer les tables
        db.create_all()
        
        # Ajouter des données de test
        _setup_test_data()
        
        yield app
    
    # Nettoyer après les tests
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """Un client de test pour l'application."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Un runner de ligne de commande pour l'application."""
    return app.test_cli_runner()

@pytest.fixture
def auth(client):
    """Classe d'aide pour l'authentification dans les tests."""
    class AuthActions:
        def __init__(self, client):
            self._client = client
            
        def login(self, email='test@example.com', password='Test1234!'):
            return self._client.post(
                '/api/auth/login',
                json={'email': email, 'password': password}
            )
            
        def logout(self):
            return self._client.post('/api/auth/logout')
    
    return AuthActions(client)

def _setup_test_data():
    """Ajouter des données de test à la base de données."""
    # Créer un utilisateur de test
    user = User(email='test@example.com', user_type='student')
    user.set_password('Test1234!')
    
    # Créer un profil pour l'utilisateur
    profile = Profile(full_name='Test User', user=user)
    
    # Ajouter à la base de données
    db.session.add(user)
    db.session.add(profile)
    
    # Créer un utilisateur admin
    admin = User(email='admin@example.com', user_type='admin')
    admin.set_password('Admin1234!')
    
    # Créer un profil pour l'admin
    admin_profile = Profile(full_name='Admin User', user=admin)
    
    # Ajouter à la base de données
    db.session.add(admin)
    db.session.add(admin_profile)
    
    # Créer un utilisateur entreprise
    company = User(email='company@example.com', user_type='company')
    company.set_password('Company1234!')
    
    # Créer un profil pour l'entreprise
    company_profile = Profile(full_name='Test Company', user=company)
    
    # Ajouter à la base de données
    db.session.add(company)
    db.session.add(company_profile)
    
    # Valider les changements
    db.session.commit()
