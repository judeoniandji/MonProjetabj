from app import db
from datetime import datetime

class EventParticipant(db.Model):
    __table_args__ = {'extend_existing': True}
    
    # Utiliser une clé primaire composite au lieu d'un ID auto-incrémenté
    event_id = db.Column(db.Integer, db.ForeignKey('event.id', ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    
    # Autres champs
    status = db.Column(db.String(20), default='registered')  # registered, attended, cancelled
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    user = db.relationship('User', backref='event_participations')
    event = db.relationship('Event', backref='participants')
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'event_id': self.event_id,
            'user': self.user.profile.full_name if hasattr(self.user, 'profile') else self.user.username,
            'event': self.event.title,
            'status': self.status,
            'registration_date': self.registration_date.isoformat()
        }