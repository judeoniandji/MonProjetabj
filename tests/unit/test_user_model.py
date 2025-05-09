import pytest
from app.models import User
from app import db

def test_password_hashing(app):
    """Test que le hachage de mot de passe fonctionne correctement."""
    with app.app_context():
        u = User(email='test@example.com')
        u.set_password('Test1234!')
        assert u.check_password('Test1234!')
        assert not u.check_password('wrong_password')

def test_password_validation(app):
    """Test que la validation de mot de passe fonctionne correctement."""
    with app.app_context():
        u = User(email='test@example.com')
        
        # Tester un mot de passe trop court
        assert not u._validate_password('Abc1!')
        
        # Tester un mot de passe sans chiffre
        assert not u._validate_password('Abcdefgh!')
        
        # Tester un mot de passe sans majuscule
        assert not u._validate_password('abcdefg1!')
        
        # Tester un mot de passe sans caractère spécial
        assert not u._validate_password('Abcdefg12')
        
        # Tester un mot de passe valide
        assert u._validate_password('Test1234!')

def test_user_creation(app):
    """Test la création d'un utilisateur."""
    with app.app_context():
        u = User(email='newuser@example.com', user_type='student')
        u.set_password('NewUser1234!')
        
        db.session.add(u)
        db.session.commit()
        
        # Vérifier que l'utilisateur a été créé
        user = User.query.filter_by(email='newuser@example.com').first()
        assert user is not None
        assert user.email == 'newuser@example.com'
        assert user.user_type == 'student'
        
def test_failed_login_attempts(app):
    """Test le verrouillage du compte après plusieurs tentatives de connexion échouées."""
    with app.app_context():
        u = User(email='locktest@example.com', user_type='student')
        u.set_password('LockTest1234!')
        
        db.session.add(u)
        db.session.commit()
        
        # Simuler 5 tentatives de connexion échouées
        for _ in range(5):
            assert not u.check_password('wrong_password')
            u.failed_login_attempts += 1
            if u.failed_login_attempts >= 5:
                u.locked = True
        
        db.session.commit()
        
        # Vérifier que le compte est verrouillé
        user = User.query.filter_by(email='locktest@example.com').first()
        assert user.locked
        assert user.failed_login_attempts == 5
