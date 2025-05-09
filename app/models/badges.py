from app import db
from datetime import datetime

class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    icon_url = db.Column(db.String(200))
    criteria = db.Column(db.String(100), nullable=False)  # ex: 'applications_count:10'
    
    user_badges = db.relationship('UserBadge', backref='badge', lazy='dynamic')

class UserBadge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badge.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, default=datetime.utcnow)

# Importation du modèle Skill depuis le module skill pour éviter la duplication
from app.models.skill import Skill

class UserSkill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skill.id'), nullable=False)
    level = db.Column(db.Integer)  # 1-5 pour représenter le niveau de compétence
    endorsements_count = db.Column(db.Integer, default=0)

class Endorsement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_skill_id = db.Column(db.Integer, db.ForeignKey('user_skill.id'), nullable=False)
    endorser_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Ajouter les relations dans le modèle User
from app.models import User
User.badges = db.relationship('UserBadge', backref='user', lazy='dynamic')
User.skills = db.relationship('UserSkill', backref='user', lazy='dynamic')
