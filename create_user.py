"""
Script pour créer un utilisateur directement dans la base de données.
Exécutez ce script avec Python pour créer un utilisateur sans passer par l'API.
"""
import os
import sys
from app import create_app, db
from app.models.user import User
from app.models.profile import Profile

# Créer l'application Flask
app = create_app()

# Définir les informations de l'utilisateur
USER_EMAIL = "admin@example.com"
USER_PASSWORD = "password123"
USER_FULL_NAME = "Admin User"
USER_TYPE = "admin"  # ou 'student', 'company', etc.

def create_test_user():
    """Crée un utilisateur de test dans la base de données."""
    with app.app_context():
        # Vérifier si l'utilisateur existe déjà
        existing_user = User.query.filter_by(email=USER_EMAIL).first()
        if existing_user:
            print(f"L'utilisateur avec l'email {USER_EMAIL} existe déjà.")
            return False
        
        # Créer un nouvel utilisateur
        user = User(email=USER_EMAIL, user_type=USER_TYPE)
        user.set_password(USER_PASSWORD)
        
        # Créer un profil pour l'utilisateur
        profile = Profile(
            full_name=USER_FULL_NAME,
            user=user
        )
        
        # Ajouter à la base de données
        db.session.add(user)
        db.session.add(profile)
        
        try:
            db.session.commit()
            print(f"Utilisateur créé avec succès: {USER_EMAIL}")
            print(f"ID de l'utilisateur: {user.id}")
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Erreur lors de la création de l'utilisateur: {e}")
            return False

if __name__ == "__main__":
    success = create_test_user()
    if success:
        print("Vous pouvez maintenant vous connecter avec cet utilisateur.")
        print(f"Email: {USER_EMAIL}")
        print(f"Mot de passe: {USER_PASSWORD}")
    else:
        print("Échec de la création de l'utilisateur.")
