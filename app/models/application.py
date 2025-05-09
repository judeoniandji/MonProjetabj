from app import db
from datetime import datetime
from sqlalchemy import event

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id', ondelete='CASCADE'), nullable=False, index=True)
    status = db.Column(db.String(20), default='pending', index=True)  # pending, reviewing, accepted, rejected, withdrawn
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.String(200))
    answers = db.Column(db.JSON)  # Réponses aux questions spécifiques
    interview_date = db.Column(db.DateTime)
    interview_location = db.Column(db.String(200))
    interview_type = db.Column(db.String(50))  # on-site, video, phone
    feedback = db.Column(db.Text)
    rejection_reason = db.Column(db.String(200))
    internal_notes = db.Column(db.Text)
    viewed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations avec cascade de suppression et chargement différé
    student = db.relationship('User', foreign_keys=[student_id],
                            backref=db.backref('applications', lazy='dynamic'),
                            lazy='joined')
    job = db.relationship('Job', backref=db.backref('applications', lazy='dynamic'),
                         lazy='joined')

    def __init__(self, **kwargs):
        super(Application, self).__init__(**kwargs)
        self.answers = kwargs.get('answers', {})

    def update_status(self, new_status, reason=None, feedback=None):
        """Met à jour le statut de la candidature avec historique."""
        valid_statuses = {'pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'}
        if new_status not in valid_statuses:
            raise ValueError(f"Statut invalide. Doit être l'un de : {', '.join(valid_statuses)}")
        
        old_status = self.status
        self.status = new_status
        
        if new_status == 'rejected':
            self.rejection_reason = reason
        
        if feedback:
            self.feedback = feedback
            
        # Mise à jour du compteur d'applications du job
        if old_status == 'pending' and new_status in ['accepted', 'rejected', 'withdrawn']:
            self.job.applications_count -= 1
            
        db.session.commit()

    def mark_as_viewed(self):
        """Marque la candidature comme vue."""
        if not self.viewed_at:
            self.viewed_at = datetime.utcnow()
            db.session.commit()

    def schedule_interview(self, date, location, interview_type='video'):
        """Planifie un entretien."""
        if date < datetime.utcnow():
            raise ValueError("La date d'entretien ne peut pas être dans le passé")
        
        self.interview_date = date
        self.interview_location = location
        self.interview_type = interview_type
        self.status = 'reviewing'
        db.session.commit()

    def add_internal_note(self, note):
        """Ajoute une note interne."""
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
        new_note = f"[{timestamp}] {note}"
        if self.internal_notes:
            self.internal_notes = new_note + "\n" + self.internal_notes
        else:
            self.internal_notes = new_note
        db.session.commit()

    def withdraw(self):
        """Permet au candidat de retirer sa candidature."""
        if self.status not in ['accepted', 'rejected']:
            self.update_status('withdrawn')

    @classmethod
    def get_stats(cls, student_id):
        """Obtient les statistiques des candidatures pour un étudiant."""
        return {
            'total': cls.query.filter_by(student_id=student_id).count(),
            'pending': cls.query.filter_by(student_id=student_id, status='pending').count(),
            'reviewing': cls.query.filter_by(student_id=student_id, status='reviewing').count(),
            'accepted': cls.query.filter_by(student_id=student_id, status='accepted').count(),
            'rejected': cls.query.filter_by(student_id=student_id, status='rejected').count(),
            'withdrawn': cls.query.filter_by(student_id=student_id, status='withdrawn').count()
        }

    def to_dict(self, include_internal=False):
        """Convertit la candidature en dictionnaire pour l'API."""
        data = {
            'id': self.id,
            'student': {
                'id': self.student_id,
                'name': self.student.profile.full_name if self.student.profile else None,
                'email': self.student.email
            },
            'job': {
                'id': self.job_id,
                'title': self.job.title,
                'company': self.job.company.profile.full_name if self.job.company.profile else None
            },
            'status': self.status,
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'answers': self.answers,
            'interview_date': self.interview_date.isoformat() if self.interview_date else None,
            'interview_location': self.interview_location,
            'interview_type': self.interview_type,
            'feedback': self.feedback,
            'viewed_at': self.viewed_at.isoformat() if self.viewed_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_internal:
            data.update({
                'rejection_reason': self.rejection_reason,
                'internal_notes': self.internal_notes
            })
            
        return data

# Événements SQLAlchemy pour maintenir le compteur d'applications
@event.listens_for(Application, 'after_insert')
def update_job_applications_count_on_insert(mapper, connection, target):
    """Met à jour le compteur d'applications après une nouvelle candidature."""
    if target.status == 'pending':
        job = target.job
        job.applications_count += 1

@event.listens_for(Application, 'after_delete')
def update_job_applications_count_on_delete(mapper, connection, target):
    """Met à jour le compteur d'applications après la suppression d'une candidature."""
    if target.status == 'pending':
        job = target.job
        job.applications_count = max(0, job.applications_count - 1)