#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import logging
from logging.handlers import RotatingFileHandler

# Configuration du logging
if not os.path.exists('logs'):
    os.mkdir('logs')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        RotatingFileHandler('logs/db_init.log', maxBytes=10240, backupCount=5)
    ]
)
logger = logging.getLogger('init_db')

def init_database():
    """Initialise la base de données SQLite"""
    try:
        logger.info("Initialisation de la base de données SQLite...")
        
        # Importer l'application et la base de données
        from app import create_app, db
        
        # Créer l'application avec la configuration appropriée
        app = create_app('development')
        
        with app.app_context():
            # Créer les tables
            logger.info("Création des tables de la base de données...")
            db.create_all()
            logger.info("Tables créées avec succès!")
            
            # Vérifier si la base de données contient des utilisateurs
            from app.models.user import User
            user_count = User.query.count()
            logger.info(f"Nombre d'utilisateurs dans la base de données: {user_count}")
            
            logger.info("Base de données SQLite initialisée avec succès!")
            return True
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation de la base de données: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

def reset_database():
    """Réinitialise la base de données SQLite (supprime et recrée toutes les tables)"""
    try:
        logger.warning("ATTENTION: Cette opération va supprimer toutes les données de la base de données.")
        confirmation = input("Êtes-vous sûr de vouloir continuer? (oui/non): ")
        
        if confirmation.lower() != 'oui':
            logger.info("Opération annulée.")
            return False
        
        logger.info("Réinitialisation de la base de données SQLite...")
        
        # Importer l'application et la base de données
        from app import create_app, db
        
        # Créer l'application avec la configuration appropriée
        app = create_app('development')
        
        with app.app_context():
            # Supprimer toutes les tables
            logger.info("Suppression des tables...")
            db.drop_all()
            logger.info("Tables supprimées.")
            
            # Recréer les tables
            logger.info("Recréation des tables...")
            db.create_all()
            logger.info("Tables recréées avec succès!")
            
            logger.info("Base de données SQLite réinitialisée avec succès!")
            return True
    except Exception as e:
        logger.error(f"Erreur lors de la réinitialisation de la base de données: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "--reset":
            reset_database()
        else:
            init_database()
    except KeyboardInterrupt:
        logger.info("\nOpération annulée par l'utilisateur.")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Erreur inattendue: {e}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)
