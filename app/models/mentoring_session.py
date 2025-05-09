from app import db
from datetime import datetime

class MentoringSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    scheduled_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer)  # Duration in minutes
    meeting_link = db.Column(db.String(200))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    mentor = db.relationship('User', foreign_keys=[mentor_id], backref='mentoring_sessions_given')
    student = db.relationship('User', foreign_keys=[student_id], backref='mentoring_sessions_received')
    
    def to_dict(self):
        return {
            'id': self.id,
            'mentor': self.mentor.profile.full_name,
            'student': self.student.profile.full_name,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat(),
            'duration': self.duration,
            'meeting_link': self.meeting_link,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }