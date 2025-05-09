from app import db
from datetime import datetime
from sqlalchemy import or_, and_
from sqlalchemy.sql import func

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, index=True)
    company_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    location = db.Column(db.String(100), index=True)
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    salary_currency = db.Column(db.String(3), default='EUR')
    job_type = db.Column(db.String(50), index=True)  # Full-time, Part-time, Internship, etc.
    status = db.Column(db.String(20), default='draft', index=True)  # active, closed, draft
    experience_level = db.Column(db.String(50))  # Junior, Mid-level, Senior
    remote_policy = db.Column(db.String(50))  # On-site, Remote, Hybrid
    skills_required = db.Column(db.JSON)
    benefits = db.Column(db.JSON)
    application_deadline = db.Column(db.DateTime)
    views_count = db.Column(db.Integer, default=0)
    applications_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    company = db.relationship('User', backref=db.backref('posted_jobs', lazy='dynamic', cascade='all, delete-orphan'))
    applications = db.relationship('Application', backref='job', lazy='dynamic', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super(Job, self).__init__(**kwargs)
        self.skills_required = kwargs.get('skills_required', [])
        self.benefits = kwargs.get('benefits', [])

    def update(self, data):
        """Mise à jour sécurisée des données de l'offre."""
        allowed_fields = {
            'title', 'description', 'requirements', 'location', 'salary_min',
            'salary_max', 'salary_currency', 'job_type', 'experience_level',
            'remote_policy', 'skills_required', 'benefits', 'application_deadline'
        }
        for field in allowed_fields:
            if field in data:
                setattr(self, field, data[field])
        db.session.commit()

    def publish(self):
        """Publie l'offre d'emploi."""
        if not self._validate_required_fields():
            raise ValueError("Tous les champs obligatoires doivent être remplis")
        self.status = 'active'
        db.session.commit()

    def close(self):
        """Ferme l'offre d'emploi."""
        self.status = 'closed'
        db.session.commit()

    def increment_views(self):
        """Incrémente le compteur de vues."""
        self.views_count += 1
        db.session.commit()

    def _validate_required_fields(self):
        """Valide les champs obligatoires."""
        required_fields = ['title', 'description', 'location', 'job_type']
        return all(bool(getattr(self, field)) for field in required_fields)

    @property
    def salary_range_display(self):
        """Affiche la fourchette de salaire formatée."""
        if self.salary_min and self.salary_max:
            return f"{self.salary_min:,} - {self.salary_max:,} {self.salary_currency}"
        elif self.salary_min:
            return f"Min. {self.salary_min:,} {self.salary_currency}"
        elif self.salary_max:
            return f"Max. {self.salary_max:,} {self.salary_currency}"
        return "Non spécifié"

    @classmethod
    def search(cls, filters=None, sort_by='created_at', page=1, per_page=20):
        """Recherche avancée d'offres d'emploi."""
        query = cls.query.filter_by(status='active')

        if filters:
            if 'location' in filters:
                query = query.filter(cls.location.ilike(f"%{filters['location']}%"))
            if 'job_type' in filters:
                query = query.filter(cls.job_type == filters['job_type'])
            if 'experience_level' in filters:
                query = query.filter(cls.experience_level == filters['experience_level'])
            if 'remote_policy' in filters:
                query = query.filter(cls.remote_policy == filters['remote_policy'])
            if 'salary_min' in filters:
                query = query.filter(cls.salary_max >= filters['salary_min'])
            if 'skills' in filters:
                for skill in filters['skills']:
                    query = query.filter(cls.skills_required.contains(skill))
            if 'search' in filters:
                search = f"%{filters['search']}%"
                query = query.filter(or_(
                    cls.title.ilike(search),
                    cls.description.ilike(search),
                    cls.requirements.ilike(search)
                ))

        if sort_by == 'salary_max':
            query = query.order_by(cls.salary_max.desc())
        elif sort_by == 'views':
            query = query.order_by(cls.views_count.desc())
        else:  # default: created_at
            query = query.order_by(cls.created_at.desc())

        return query.paginate(page=page, per_page=per_page, error_out=False)

    @classmethod
    def get_stats(cls, company_id):
        """Obtient les statistiques des offres pour une entreprise."""
        return {
            'total_jobs': cls.query.filter_by(company_id=company_id).count(),
            'active_jobs': cls.query.filter_by(company_id=company_id, status='active').count(),
            'total_applications': db.session.query(func.sum(cls.applications_count))
                .filter_by(company_id=company_id).scalar() or 0,
            'total_views': db.session.query(func.sum(cls.views_count))
                .filter_by(company_id=company_id).scalar() or 0
        }

    def to_dict(self):
        """Convertit l'offre en dictionnaire pour l'API."""
        return {
            'id': self.id,
            'title': self.title,
            'company': {
                'id': self.company_id,
                'name': self.company.profile.full_name if self.company.profile else None,
                'logo_url': self.company.profile.avatar_url if self.company.profile else None
            },
            'description': self.description,
            'requirements': self.requirements,
            'location': self.location,
            'salary_range': self.salary_range_display,
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'salary_currency': self.salary_currency,
            'job_type': self.job_type,
            'experience_level': self.experience_level,
            'remote_policy': self.remote_policy,
            'skills_required': self.skills_required,
            'benefits': self.benefits,
            'status': self.status,
            'application_deadline': self.application_deadline.isoformat() if self.application_deadline else None,
            'views_count': self.views_count,
            'applications_count': self.applications_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }