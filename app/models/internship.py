from app import db
from datetime import datetime

class Internship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    location = db.Column(db.String(100))
    duration = db.Column(db.String(50))  # e.g., "6 months", "1 year"
    compensation = db.Column(db.String(50))
    internship_type = db.Column(db.String(50))  # Full-time, Part-time, Summer, etc.
    status = db.Column(db.String(20), default='active')  # active, closed, draft
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    company = db.relationship('User', backref='posted_internships')
    applications = db.relationship('Application', backref='internship', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company.profile.company_name,
            'description': self.description,
            'requirements': self.requirements,
            'location': self.location,
            'duration': self.duration,
            'compensation': self.compensation,
            'internship_type': self.internship_type,
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }