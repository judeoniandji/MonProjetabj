from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
from logging.handlers import RotatingFileHandler
import logging
import os
import traceback
from config import config

# Initialisation des extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Veuillez vous connecter pour accéder à cette page.'
csrf = CSRFProtect()
CORS = CORS

@login_manager.user_loader
def load_user(id):
    try:
        from app.models.user import User
        return User.query.get(int(id))
    except Exception as e:
        logging.error(f"Erreur lors du chargement de l'utilisateur: {e}")
        return None

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Configuration de l'application
    try:
        app.config.from_object(config[config_name])
        config[config_name].init_app(app)
    except Exception as e:
        app.logger.error(f"Erreur lors du chargement de la configuration: {e}")
        # Fallback à la configuration par défaut
        app.config.from_object(config['default'])
        config['default'].init_app(app)

    # Configuration des logs
    configure_logging(app)
    
    # Configuration CORS améliorée
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    
    # Ajouter des en-têtes CORS à toutes les réponses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
        
    app.logger.info("Configuration CORS appliquée avec succès")

    # Initialisation des extensions
    try:
        db.init_app(app)
        migrate.init_app(app, db)
        jwt.init_app(app)
        mail.init_app(app)
        login_manager.init_app(app)
        csrf.init_app(app)
        
        # Exemption CSRF pour les routes API
        csrf.exempt('app.auth.api_login')
        csrf.exempt('app.auth.refresh')
        csrf.exempt('app.auth.api_register')
        csrf.exempt('app.auth.api_register_simple')
        
        app.logger.info("Extensions initialisées avec succès")
    except Exception as e:
        app.logger.error(f"Erreur lors de l'initialisation des extensions: {e}")
        app.logger.error(traceback.format_exc())

    # Création du dossier d'upload s'il n'existe pas
    upload_folder = os.path.join(app.root_path, 'static', 'uploads')
    app.config['UPLOAD_FOLDER'] = upload_folder
    if not os.path.exists(upload_folder):
        try:
            os.makedirs(upload_folder)
            app.logger.info(f"Dossier d'upload créé: {upload_folder}")
        except Exception as e:
            app.logger.error(f"Erreur lors de la création du dossier d'upload: {e}")

    # Configuration des en-têtes de sécurité avec support CORS
    app.config['SECURITY_HEADERS'] = {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': "default-src 'self' http://localhost:3000 http://127.0.0.1:3000; img-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:5000 http://127.0.0.1:5000"
    }

    @app.after_request
    def add_security_headers(response):
        try:
            # Ajout des headers de sécurité
            for key, value in app.config['SECURITY_HEADERS'].items():
                response.headers[key] = value
            return response
        except Exception as e:
            app.logger.error(f"Erreur lors de l'ajout des en-têtes de sécurité: {e}")
            return response

    # Gestionnaire d'erreurs pour les exceptions
    register_error_handlers(app)

    # Enregistrement des blueprints
    try:
        with app.app_context():
            register_blueprints(app)
            
            # Création des tables de la base de données
            try:
                db.create_all()
                app.logger.info("Tables de la base de données créées avec succès")
            except Exception as e:
                app.logger.error(f"Erreur lors de la création des tables: {e}")
                app.logger.error(traceback.format_exc())
    except Exception as e:
        app.logger.error(f"Erreur lors de l'enregistrement des blueprints: {e}")
        app.logger.error(traceback.format_exc())

    return app

def configure_logging(app):
    """Configure le système de journalisation"""
    if not app.debug and not app.testing:
        # Créer le dossier logs s'il n'existe pas
        if not os.path.exists('logs'):
            os.mkdir('logs')
            
        # Configurer le gestionnaire de fichiers
        file_handler = RotatingFileHandler('logs/campusconnect.log', 
                                          maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        
        # Ajouter le gestionnaire à l'application
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('CampusConnect startup')

def register_error_handlers(app):
    """Enregistre les gestionnaires d'erreurs pour l'application"""
    
    @app.errorhandler(404)
    def not_found_error(error):
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Resource not found', 'message': str(error)}), 404
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Erreur 500: {error}")
        app.logger.error(traceback.format_exc())
        db.session.rollback()
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Internal server error', 'message': str(error)}), 500
        return render_template('errors/500.html'), 500

    @app.errorhandler(400)
    def bad_request_error(error):
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Bad request', 'message': str(error)}), 400
        return render_template('errors/400.html'), 400

    @app.errorhandler(401)
    def unauthorized_error(error):
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Unauthorized', 'message': str(error)}), 401
        return redirect(url_for('auth.login'))

    @app.errorhandler(403)
    def forbidden_error(error):
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Forbidden', 'message': str(error)}), 403
        return render_template('errors/403.html'), 403
        
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.error(f"Erreur inattendue: {error}")
        app.logger.error(traceback.format_exc())
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Unexpected error', 'message': str(error)}), 500
        return render_template('errors/500.html'), 500

def register_blueprints(app):
    """Enregistre les blueprints de l'application"""
    try:
        # Import des blueprints
        from app.main import bp as main_bp
        app.register_blueprint(main_bp)
        app.logger.info("Blueprint 'main' enregistré")

        from app.auth import bp as auth_bp
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.logger.info("Blueprint 'auth' enregistré")

        from app.api import bp as api_bp
        app.register_blueprint(api_bp, url_prefix='/api')
        app.logger.info("Blueprint 'api' enregistré")

        from app.dashboard import bp as dashboard_bp
        app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
        app.logger.info("Blueprint 'dashboard' enregistré")
        
        # Enregistrement du blueprint pour les données sénégalaises
        from app.senegal import bp as senegal_bp
        app.register_blueprint(senegal_bp, url_prefix='/api/senegal')
        app.logger.info("Blueprint 'senegal' enregistré")
        
        # Enregistrement du blueprint pour les fonctionnalités d'IA
        from app.ai import bp as ai_bp
        app.register_blueprint(ai_bp, url_prefix='/api/ai')
        app.logger.info("Blueprint 'ai' enregistré")
    except ImportError as e:
        app.logger.error(f"Erreur lors de l'importation des blueprints: {e}")
        app.logger.error(traceback.format_exc())
        raise
