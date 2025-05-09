from datetime import datetime
import re
from app import db

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(200))
    cv_url = db.Column(db.String(200))
    linkedin_url = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    skills = db.Column(db.JSON)
    languages = db.Column(db.JSON)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completion_percentage = db.Column(db.Integer, default=0)

    def __init__(self, **kwargs):
        super(Profile, self).__init__(**kwargs)
        self.skills = kwargs.get('skills', [])
        self.languages = kwargs.get('languages', [])

    def update(self, data):
        """Mise à jour sécurisée des données du profil."""
        allowed_fields = {'full_name', 'bio', 'phone', 'location', 'skills', 'languages'}
        for field in allowed_fields:
            if field in data:
                if field == 'phone' and data[field]:
                    if not self._validate_phone(data[field]):
                        raise ValueError("Format de numéro de téléphone invalide")
                setattr(self, field, data[field])
        self._update_completion()
        return self

    def _validate_phone(self, phone):
        """Valide le format du numéro de téléphone."""
        phone_pattern = re.compile(r'^\+?1?\d{9,15}$')
        return bool(phone_pattern.match(phone))

    def _update_completion(self):
        """Calcule le pourcentage de complétion du profil."""
        fields = {
            'full_name': 20,
            'bio': 20,
            'avatar_url': 10,
            'cv_url': 15,
            'linkedin_url': 10,
            'phone': 10,
            'location': 5,
            'skills': 5,
            'languages': 5
        }
        
        completion = 0
        for field, weight in fields.items():
            value = getattr(self, field)
            if value:
                if isinstance(value, list) and len(value) > 0:
                    completion += weight
                elif isinstance(value, str) and value.strip():
                    completion += weight
                elif value is not None:
                    completion += weight
        
        self.completion_percentage = min(100, completion)

    def to_dict(self):
        """Convertit le profil en dictionnaire pour l'API."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'cv_url': self.cv_url,
            'linkedin_url': self.linkedin_url,
            'phone': self.phone,
            'location': self.location,
            'skills': self.skills,
            'languages': self.languages,
            'completion_percentage': self.completion_percentage,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }