from app import create_app, db
from flask_migrate import upgrade, migrate, init, stamp
import os
import sys
import traceback
import logging

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('update_db')

def init_db():
    """Initialise la base de données avec les migrations Flask-Migrate"""
    logger.info("Initialisation de la base de données...")
    
    try:
        # Créer l'application avec la configuration appropriée
        app = create_app('development')
        
        with app.app_context():
            # Vérifier si le répertoire de migrations existe
            migrations_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'migrations')
            
            if not os.path.exists(migrations_dir):
                logger.info("Initialisation du répertoire de migrations...")
                try:
                    init()
                    stamp()
                    logger.info("Répertoire de migrations créé.")
                except Exception as e:
                    logger.error(f"Erreur lors de l'initialisation des migrations: {e}")
                    logger.error(traceback.format_exc())
                    raise
            
            # Créer les tables si elles n'existent pas
            try:
                db.create_all()
                logger.info("Tables créées.")
            except Exception as e:
                logger.error(f"Erreur lors de la création des tables: {e}")
                logger.error(traceback.format_exc())
                raise
            
            # Générer et appliquer les migrations
            logger.info("Application des migrations...")
            try:
                migrate()
                upgrade()
                logger.info("Migrations appliquées avec succès.")
            except Exception as e:
                logger.error(f"Erreur lors de l'application des migrations: {e}")
                logger.error(traceback.format_exc())
                raise
            
            logger.info("Base de données initialisée avec succès!")
    except Exception as e:
        logger.error(f"Erreur critique lors de l'initialisation de la base de données: {e}")
        logger.error(traceback.format_exc())
        sys.exit(1)

def reset_db():
    """Réinitialise complètement la base de données (ATTENTION: supprime toutes les données)"""
    try:
        app = create_app('development')
        
        with app.app_context():
            logger.warning("ATTENTION: Cette opération va supprimer toutes les données de la base de données.")
            confirmation = input("Êtes-vous sûr de vouloir continuer? (oui/non): ")
            
            if confirmation.lower() == 'oui':
                logger.info("Suppression de toutes les tables...")
                try:
                    db.drop_all()
                    logger.info("Toutes les tables ont été supprimées.")
                except Exception as e:
                    logger.error(f"Erreur lors de la suppression des tables: {e}")
                    logger.error(traceback.format_exc())
                    raise
                
                logger.info("Recréation des tables...")
                try:
                    db.create_all()
                    logger.info("Tables recréées avec succès.")
                except Exception as e:
                    logger.error(f"Erreur lors de la recréation des tables: {e}")
                    logger.error(traceback.format_exc())
                    raise
                
                # Réinitialiser les migrations
                migrations_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'migrations')
                if os.path.exists(migrations_dir):
                    logger.info("Réinitialisation des migrations...")
                    try:
                        stamp()
                        logger.info("Migrations réinitialisées.")
                    except Exception as e:
                        logger.error(f"Erreur lors de la réinitialisation des migrations: {e}")
                        logger.error(traceback.format_exc())
                
                logger.info("Base de données réinitialisée avec succès!")
            else:
                logger.info("Opération annulée.")
    except Exception as e:
        logger.error(f"Erreur critique lors de la réinitialisation de la base de données: {e}")
        logger.error(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "--reset":
            reset_db()
        else:
            init_db()
    except KeyboardInterrupt:
        logger.info("Opération annulée par l'utilisateur.")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Erreur inattendue: {e}")
        logger.error(traceback.format_exc())
        sys.exit(1)
