import os
import sys
from datetime import timedelta
from dotenv import load_dotenv

# Chemin de base du projet
basedir = os.path.abspath(os.path.dirname(__file__))

# Charger les variables d'environnement
try:
    load_dotenv(os.path.join(basedir, '.env'))
except Exception as e:
    print(f"Avertissement: Impossible de charger le fichier .env: {e}")
    print("Les valeurs par défaut seront utilisées pour la configuration.")

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    if os.environ.get('FLASK_ENV') == 'production' and SECRET_KEY == 'dev-key-please-change-in-production':
        print("AVERTISSEMENT: Vous utilisez une clé secrète par défaut en production!")
        print("Définissez SECRET_KEY dans votre fichier .env pour la sécurité.")
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(basedir, 'app', 'static', 'uploads')
    
    # Password Security
    PASSWORD_MIN_LENGTH = 8
    PASSWORD_COMPLEXITY = True
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    if os.environ.get('FLASK_ENV') == 'production' and JWT_SECRET_KEY == 'jwt-secret-key':
        print("AVERTISSEMENT: Vous utilisez une clé JWT par défaut en production!")
        print("Définissez JWT_SECRET_KEY dans votre fichier .env pour la sécurité.")
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Mail
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.googlemail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', '587'))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@example.com')
    
    # Vérification des paramètres d'email en production
    @classmethod
    def validate_mail_config(cls):
        if os.environ.get('FLASK_ENV') == 'production':
            if not cls.MAIL_USERNAME or not cls.MAIL_PASSWORD:
                print("AVERTISSEMENT: Configuration email incomplète en production!")
                print("Les emails ne fonctionneront pas correctement.")
    
    # OAuth 2.0
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    GOOGLE_DISCOVERY_URL = 'https://accounts.google.com/.well-known/openid-configuration'
    
    # Security - Ajusté pour le développement
    SESSION_COOKIE_SECURE = os.environ.get('FLASK_ENV') == 'production'  # Seulement en production
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # Rate Limiting
    RATELIMIT_DEFAULT = "100 per minute"
    RATELIMIT_STORAGE_URL = "memory://"
    
    # Application specific
    JOBS_PER_PAGE = 12
    EVENTS_PER_PAGE = 9
    MESSAGES_PER_PAGE = 20
    SEARCH_RESULTS_PER_PAGE = 10

    @classmethod
    def init_app(cls, app):
        """Initialisation supplémentaire de l'application"""
        # Vérifier la configuration de l'email
        cls.validate_mail_config()
        
        # Créer le dossier d'upload s'il n'existe pas
        if not os.path.exists(cls.UPLOAD_FOLDER):
            try:
                os.makedirs(cls.UPLOAD_FOLDER)
                print(f"Dossier d'upload créé: {cls.UPLOAD_FOLDER}")
            except Exception as e:
                print(f"Erreur lors de la création du dossier d'upload: {e}")
                print(f"Les uploads de fichiers pourraient ne pas fonctionner.")

class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = False  # Pas besoin de HTTPS en développement
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        print("Application démarrée en mode DÉVELOPPEMENT")
        print("AVERTISSEMENT: Ne pas utiliser en production!")
    
class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True  # Nécessite HTTPS en production
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Vérifications de sécurité supplémentaires pour la production
        if cls.SECRET_KEY == 'dev-key-please-change-in-production':
            print("ERREUR CRITIQUE: Clé secrète par défaut utilisée en production!")
            print("Définissez SECRET_KEY dans votre fichier .env avant de continuer.")
            sys.exit(1)
            
        if cls.JWT_SECRET_KEY == 'jwt-secret-key':
            print("ERREUR CRITIQUE: Clé JWT par défaut utilisée en production!")
            print("Définissez JWT_SECRET_KEY dans votre fichier .env avant de continuer.")
            sys.exit(1)
            
        print("Application démarrée en mode PRODUCTION")
    
# Configuration par défaut basée sur l'environnement
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
