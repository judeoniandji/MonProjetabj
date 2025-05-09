import subprocess
import sys
import os
import time
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# Forcer l'encodage en UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Charger les variables d'environnement
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
try:
    load_dotenv(os.path.join(basedir, '.env'))
except Exception as e:
    print(f"Avertissement: Impossible de charger le fichier .env: {e}")

def run_command(command):
    """Exécute une commande shell et affiche le résultat"""
    print(f"Exécution de: {' '.join(command)}")
    try:
        result = subprocess.run(command, capture_output=True, text=True, encoding='utf-8')
        if result.returncode != 0:
            print(f"Erreur: {result.stderr}")
            return False
        print(result.stdout)
        return True
    except Exception as e:
        print(f"Erreur lors de l'exécution de la commande: {e}")
        return False

def check_postgres():
    """Vérifie si PostgreSQL est installé et en cours d'exécution"""
    try:
        result = subprocess.run(["pg_isready"], capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            print("PostgreSQL est en cours d'exécution.")
            return True
        else:
            print("PostgreSQL n'est pas en cours d'exécution.")
            return False
    except FileNotFoundError:
        print("PostgreSQL ne semble pas être installé ou n'est pas dans le PATH.")
        print("Veuillez installer PostgreSQL et l'ajouter à votre PATH.")
        return False
    except Exception as e:
        print(f"Erreur lors de la vérification de PostgreSQL: {e}")
        return False

def get_connection_params():
    """Récupère les paramètres de connexion depuis les variables d'environnement ou utilise des valeurs par défaut"""
    # Analyser l'URL de la base de données
    db_url = os.environ.get('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/campusconnect')
    
    try:
        # Format attendu: postgresql://user:password@host:port/dbname
        if '://' in db_url:
            # Supprimer le préfixe postgresql://
            db_url = db_url.split('://', 1)[1]
        
        # Séparer les informations d'authentification de l'hôte
        if '@' in db_url:
            auth, host_part = db_url.split('@', 1)
            # Extraire l'utilisateur et le mot de passe
            if ':' in auth:
                user, password = auth.split(':', 1)
            else:
                user, password = auth, ''
        else:
            user, password = 'postgres', 'password'
            host_part = db_url
        
        # Extraire l'hôte, le port et le nom de la base de données
        if '/' in host_part:
            host_port, dbname = host_part.split('/', 1)
            # Extraire l'hôte et le port
            if ':' in host_port:
                host, port = host_port.split(':', 1)
                port = int(port)
            else:
                host, port = host_port, 5432
        else:
            host, port = host_part, 5432
            dbname = 'campusconnect'
        
        return {
            'dbname': dbname,
            'user': user,
            'password': password,
            'host': host,
            'port': port
        }
    except Exception as e:
        print(f"Erreur lors de l'analyse de l'URL de la base de données: {e}")
        print("Utilisation des paramètres par défaut.")
        return {
            'dbname': 'campusconnect',
            'user': 'postgres',
            'password': 'password',
            'host': 'localhost',
            'port': 5432
        }

def create_database():
    """Crée la base de données PostgreSQL si elle n'existe pas déjà"""
    params = get_connection_params()
    dbname = params.pop('dbname')
    
    print(f"Tentative de connexion à PostgreSQL sur {params['host']}:{params['port']} avec l'utilisateur {params['user']}")
    
    try:
        # Se connecter à la base de données postgres par défaut
        conn = psycopg2.connect(dbname='postgres', **params)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Vérifier si la base de données existe déjà
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        exists = cursor.fetchone()
        
        if exists:
            print(f"La base de données '{dbname}' existe déjà.")
        else:
            # Créer la base de données
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(dbname)))
            print(f"Base de données '{dbname}' créée avec succès.")
        
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"Erreur PostgreSQL: {e}")
        return False
    except Exception as e:
        print(f"Erreur inattendue: {e}")
        return False

def test_connection():
    """Teste la connexion à la base de données créée"""
    params = get_connection_params()
    
    try:
        print(f"Test de connexion à la base de données '{params['dbname']}'...")
        conn = psycopg2.connect(**params)
        cursor = conn.cursor()
        cursor.execute('SELECT version();')
        version = cursor.fetchone()
        print(f"Connexion réussie. Version PostgreSQL: {version[0]}")
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"Erreur de connexion à la base de données: {e}")
        return False
    except Exception as e:
        print(f"Erreur inattendue: {e}")
        return False

def main():
    """Fonction principale pour configurer la base de données"""
    print("=== Configuration de la base de données PostgreSQL ===")
    
    # Vérifier PostgreSQL
    if not check_postgres():
        print("Veuillez installer et démarrer PostgreSQL avant de continuer.")
        sys.exit(1)
    
    # Créer la base de données
    if not create_database():
        print("Échec de la configuration de la base de données.")
        sys.exit(1)
    
    # Tester la connexion
    if not test_connection():
        print("La base de données a été créée mais le test de connexion a échoué.")
        print("Vérifiez vos paramètres de connexion dans le fichier .env")
        sys.exit(1)
    
    # Initialiser la base de données avec les migrations
    print("\n=== Initialisation de la base de données avec les migrations ===")
    update_db_path = os.path.join(os.path.dirname(__file__), "update_db.py")
    
    if not os.path.exists(update_db_path):
        print(f"Le script update_db.py n'a pas été trouvé à l'emplacement: {update_db_path}")
        sys.exit(1)
    
    if run_command([sys.executable, update_db_path]):
        print("\n=== Configuration de la base de données terminée avec succès! ===")
    else:
        print("\n=== Échec de l'initialisation de la base de données. ===")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOpération annulée par l'utilisateur.")
        sys.exit(0)
    except Exception as e:
        print(f"Erreur inattendue: {e}")
        sys.exit(1)
