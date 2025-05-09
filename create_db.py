#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import sqlite3
import logging

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('create_db')

def create_sqlite_db():
    """Crée une base de données SQLite vide"""
    try:
        # Obtenir le chemin de la base de données depuis la configuration
        from config import DevelopmentConfig
        db_path = DevelopmentConfig.SQLALCHEMY_DATABASE_URI
        
        # Extraire le chemin du fichier de la chaîne de connexion SQLite
        if db_path.startswith('sqlite:///'):
            db_file = db_path[10:]  # Supprimer 'sqlite:///'
        else:
            logger.error(f"Format de chaîne de connexion non pris en charge: {db_path}")
            return False
        
        # Créer le répertoire si nécessaire
        db_dir = os.path.dirname(db_file)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)
            logger.info(f"Répertoire créé: {db_dir}")
        
        # Vérifier si le fichier existe déjà
        if os.path.exists(db_file):
            logger.info(f"La base de données existe déjà: {db_file}")
            return True
        
        # Créer une base de données SQLite vide
        conn = sqlite3.connect(db_file)
        conn.close()
        logger.info(f"Base de données SQLite créée avec succès: {db_file}")
        
        return True
    except Exception as e:
        logger.error(f"Erreur lors de la création de la base de données: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

def initialize_flask_db():
    """Initialise la base de données avec Flask-SQLAlchemy"""
    try:
        # Créer l'application Flask
        from app import create_app, db
        app = create_app('development')
        
        with app.app_context():
            # Créer les tables
            logger.info("Création des tables...")
            db.create_all()
            logger.info("Tables créées avec succès!")
        
        return True
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation de la base de données Flask: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    try:
        # Créer la base de données SQLite
        if create_sqlite_db():
            # Initialiser la base de données avec Flask-SQLAlchemy
            if initialize_flask_db():
                logger.info("Base de données initialisée avec succès!")
            else:
                logger.error("Échec de l'initialisation de la base de données Flask.")
        else:
            logger.error("Échec de la création de la base de données SQLite.")
    except Exception as e:
        logger.error(f"Erreur inattendue: {e}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)
