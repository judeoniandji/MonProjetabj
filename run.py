import os
import sys
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

try:
    from app import create_app
except ImportError as e:
    print(f"Erreur critique lors de l'importation de l'application: {e}")
    print("Vérifiez que toutes les dépendances sont installées et que la structure du projet est correcte.")
    sys.exit(1)

# Déterminer l'environnement (développement par défaut)
env = os.environ.get('FLASK_ENV', 'development')

try:
    app = create_app(env)
except Exception as e:
    print(f"Erreur lors de la création de l'application: {e}")
    print("Vérifiez votre configuration et les variables d'environnement.")
    sys.exit(1)

if __name__ == '__main__':
    try:
        # En mode développement, activer le rechargement automatique et le débogage
        debug = env == 'development'
        port = int(os.environ.get('PORT', 5000))
        
        print(f"Démarrage de l'application en mode {env} sur http://localhost:{port}")
        app.run(host='0.0.0.0', port=port, debug=debug)
    except Exception as e:
        print(f"Erreur lors du démarrage de l'application: {e}")
        sys.exit(1)
