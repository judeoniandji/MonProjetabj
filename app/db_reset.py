import os
import sys
from datetime import datetime

# Ajouter le répertoire parent au chemin pour pouvoir importer l'application
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models.user import User
from app.models.profile import Profile
from werkzeug.security import generate_password_hash

def reset_database():
    """
    Réinitialise complètement la base de données en supprimant toutes les tables
    et en les recréant.
    """
    app = create_app()
    with app.app_context():
        print("Suppression de toutes les tables...")
        db.drop_all()
        print("Recréation des tables...")
        db.create_all()
        print("Base de données réinitialisée avec succès.")
        
        # Création d'un utilisateur administrateur par défaut
        create_default_admin()
        
        print("Script terminé.")

def create_default_admin():
    """
    Crée un utilisateur administrateur par défaut après la réinitialisation
    de la base de données.
    """
    admin_email = 'admin@example.com'
    admin_password = 'Admin123!'
    
    # Vérifier si l'admin existe déjà
    admin = User.query.filter_by(email=admin_email).first()
    if admin:
        print(f"L'administrateur {admin_email} existe déjà.")
        return
    
    try:
        # Créer l'utilisateur admin
        admin = User(
            email=admin_email,
            user_type='admin',
            is_active=True,
            email_verified=True,
            created_at=datetime.utcnow()
        )
        admin.set_password(admin_password)
        
        # Créer le profil admin
        admin_profile = Profile(
            full_name='Administrateur',
            user=admin,
            bio='Administrateur système'
        )
        
        db.session.add(admin)
        db.session.add(admin_profile)
        db.session.commit()
        
        print(f"Administrateur créé avec succès: {admin_email} (mot de passe: {admin_password})")
    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la création de l'administrateur: {str(e)}")

def create_test_users():
    """
    Crée des utilisateurs de test pour chaque type d'utilisateur
    """
    test_users = [
        {
            'email': 'etudiant@example.com',
            'password': 'Etudiant123!',
            'user_type': 'student',
            'profile': {
                'full_name': 'Jean Dupont',
                'bio': 'Étudiant en informatique',
                'location': 'Paris',
                'school': 'Université Paris Tech',
                'field_of_study': 'Informatique'
            }
        },
        {
            'email': 'universite@example.com',
            'password': 'Universite123!',
            'user_type': 'school',
            'profile': {
                'full_name': 'Université Paris Tech',
                'bio': 'Grande école d\'ingénieurs',
                'location': 'Paris',
                'university_name': 'Université Paris Tech'
            }
        },
        {
            'email': 'entreprise@example.com',
            'password': 'Entreprise123!',
            'user_type': 'company',
            'profile': {
                'full_name': 'TechCorp',
                'bio': 'Entreprise de développement logiciel',
                'location': 'Lyon',
                'company_name': 'TechCorp',
                'industry': 'Informatique'
            }
        }
    ]
    
    try:
        for user_data in test_users:
            # Vérifier si l'utilisateur existe déjà
            existing_user = User.query.filter_by(email=user_data['email']).first()
            if existing_user:
                print(f"L'utilisateur {user_data['email']} existe déjà.")
                continue
            
            # Créer l'utilisateur
            user = User(
                email=user_data['email'],
                user_type=user_data['user_type'],
                is_active=True,
                email_verified=True,
                created_at=datetime.utcnow()
            )
            user.set_password(user_data['password'])
            
            # Créer le profil
            profile_data = user_data['profile']
            profile = Profile(
                full_name=profile_data['full_name'],
                bio=profile_data.get('bio', ''),
                location=profile_data.get('location', ''),
                user=user
            )
            
            # Ajouter des attributs spécifiques selon le type d'utilisateur
            if user.user_type == 'student':
                profile.school = profile_data.get('school', '')
                profile.field_of_study = profile_data.get('field_of_study', '')
            elif user.user_type == 'school':
                profile.university_name = profile_data.get('university_name', '')
            elif user.user_type == 'company':
                profile.company_name = profile_data.get('company_name', '')
                profile.industry = profile_data.get('industry', '')
            
            db.session.add(user)
            db.session.add(profile)
            db.session.commit()
            
            print(f"Utilisateur créé avec succès: {user_data['email']} (mot de passe: {user_data['password']})")
    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la création des utilisateurs de test: {str(e)}")

if __name__ == '__main__':
    reset_database()
    
    # Demander à l'utilisateur s'il souhaite créer des utilisateurs de test
    create_test = input("Voulez-vous créer des utilisateurs de test? (o/n): ")
    if create_test.lower() == 'o':
        app = create_app()
        with app.app_context():
            create_test_users()
