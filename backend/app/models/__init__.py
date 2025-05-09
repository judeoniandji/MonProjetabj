from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    profile = db.relationship('Profile', backref='user', uselist=False)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(100))
    title = db.Column(db.String(100))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(200))
    skills = db.Column(db.JSON)
    experiences = db.Column(db.JSON)
    education = db.Column(db.JSON)
    badges = db.Column(db.JSON)
    applications = db.Column(db.JSON)
    events_attended = db.Column(db.JSON)
    connections = db.Column(db.JSON)
    rating = db.Column(db.Float)
    email_notifications = db.Column(db.Boolean, default=True)
    job_alerts = db.Column(db.Boolean, default=True)
    event_reminders = db.Column(db.Boolean, default=True)
    profile_visibility = db.Column(db.String(20), default='public')
    show_email = db.Column(db.Boolean, default=False)
    show_connections = db.Column(db.Boolean, default=True)
    linkedin_url = db.Column(db.String(200))
    github_url = db.Column(db.String(200))
    portfolio_url = db.Column(db.String(200))

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50))
    location = db.Column(db.String(100))
    salary = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50))
    format = db.Column(db.String(50))
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 