from datetime import datetime, timedelta
import re
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128))
    user_type = db.Column(db.String(20), nullable=False)  # student, company, mentor
    is_premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    reset_token = db.Column(db.String(100), unique=True)
    reset_token_expiry = db.Column(db.DateTime)
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    
    # Relationship fields
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy='dynamic')
    received_messages = db.relationship('Message', foreign_keys='Message.recipient_id', backref='recipient', lazy='dynamic')

    def set_password(self, password):
        """Set hashed password with validation."""
        if not self._validate_password(password):
            raise ValueError("Le mot de passe ne respecte pas les critères de sécurité")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password with rate limiting."""
        if self.is_locked():
            return False
            
        is_valid = check_password_hash(self.password_hash, password)
        if not is_valid:
            self.failed_login_attempts += 1
            if self.failed_login_attempts >= 5:
                self.locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.session.commit()
        else:
            self.failed_login_attempts = 0
            self.last_login = datetime.utcnow()
            db.session.commit()
        return is_valid

    def _validate_password(self, password):
        """Validate password complexity."""
        if len(password) < 8:
            return False
        # Vérifier la présence d'au moins un chiffre
        if not any(char.isdigit() for char in password):
            return False
        # Vérifier la présence d'au moins une lettre majuscule
        if not any(char.isupper() for char in password):
            return False
        # Vérifier la présence d'au moins un caractère spécial
        special_chars = "!@#$%^&*()-_=+[]{}|;:,.<>?/"
        if not any(char in special_chars for char in password):
            return False
        return True

    def is_locked(self):
        """Check if account is locked."""
        if self.locked_until and self.locked_until > datetime.utcnow():
            return True
        if self.locked_until:  # Si le verrouillage est expiré
            self.locked_until = None
            self.failed_login_attempts = 0
            db.session.commit()
        return False

    def generate_reset_token(self):
        """Generate password reset token."""
        import secrets
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        return self.reset_token

    def verify_reset_token(self, token):
        """Verify if reset token is valid."""
        if (self.reset_token != token or 
            not self.reset_token_expiry or 
            self.reset_token_expiry < datetime.utcnow()):
            return False
        return True

    def clear_reset_token(self):
        """Clear reset token after use."""
        self.reset_token = None
        self.reset_token_expiry = None
        db.session.commit()

    def to_dict(self):
        """Convert user to dictionary for API responses."""
        return {
            'id': self.id,
            'email': self.email,
            'user_type': self.user_type,
            'is_premium': self.is_premium,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active,
            'email_verified': self.email_verified
        }