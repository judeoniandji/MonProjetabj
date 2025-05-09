from datetime import datetime, timedelta
from app import db
from sqlalchemy import event, or_, and_
from sqlalchemy.sql import func

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text)
    start_time = db.Column(db.DateTime, nullable=False, index=True)
    end_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200))
    location_type = db.Column(db.String(20))  # physical, online
    virtual_meeting_url = db.Column(db.String(500))
    type = db.Column(db.String(50), index=True)  # forum, workshop, conference, webinar
    category = db.Column(db.String(50))  # tech, business, career, etc.
    max_participants = db.Column(db.Integer)
    current_participants = db.Column(db.Integer, default=0)
    is_private = db.Column(db.Boolean, default=False)
    registration_deadline = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='draft', index=True)  # draft, published, cancelled, completed
    cover_image_url = db.Column(db.String(500))
    agenda = db.Column(db.JSON)
    prerequisites = db.Column(db.Text)
    tags = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    organizer = db.relationship('User', backref=db.backref('organized_events', lazy='dynamic', cascade='all, delete-orphan'))
    
    # Relation avec EventParticipant définie dans le modèle EventParticipant
    # participants est défini par la relation backref dans EventParticipant

    def __init__(self, **kwargs):
        super(Event, self).__init__(**kwargs)
        self.agenda = kwargs.get('agenda', [])
        self.tags = kwargs.get('tags', [])

    def __repr__(self):
        return f'<Event {self.title}>'

    def publish(self):
        """Publie l'événement après validation."""
        if not self._validate_event():
            raise ValueError("L'événement ne peut pas être publié car il manque des informations requises")
        self.status = 'published'
        db.session.commit()

    def cancel(self, reason=None):
        """Annule l'événement et notifie les participants."""
        self.status = 'cancelled'
        # TODO: Implémenter la notification des participants
        db.session.commit()

    def update_details(self, data):
        """Met à jour les détails de l'événement."""
        if self.status not in ['draft', 'published']:
            raise ValueError("Impossible de modifier un événement annulé ou terminé")

        allowed_fields = {
            'title', 'description', 'start_time', 'end_time', 'location',
            'location_type', 'virtual_meeting_url', 'type', 'category',
            'max_participants', 'registration_deadline', 'prerequisites',
            'agenda', 'tags', 'cover_image_url', 'is_private'
        }
        
        for field in allowed_fields:
            if field in data:
                if field in ['start_time', 'end_time', 'registration_deadline']:
                    if isinstance(data[field], str):
                        data[field] = datetime.fromisoformat(data[field])
                setattr(self, field, data[field])
        
        db.session.commit()

    def register_participant(self, user_id, registration_type='attendee'):
        """Inscrit un participant à l'événement."""
        if self.status != 'published':
            raise ValueError("Les inscriptions ne sont pas ouvertes pour cet événement")
            
        if self.registration_deadline and datetime.utcnow() > self.registration_deadline:
            raise ValueError("La date limite d'inscription est dépassée")
            
        if self.is_full():
            raise ValueError("L'événement est complet")
            
        if self.is_participant(user_id):
            raise ValueError("L'utilisateur est déjà inscrit")
            
        participant = EventParticipant(
            event_id=self.id,
            user_id=user_id,
            registration_type=registration_type
        )
        db.session.add(participant)
        self.current_participants += 1
        db.session.commit()
        return participant

    def unregister_participant(self, user_id):
        """Désinscrit un participant de l'événement."""
        participant = EventParticipant.query.filter_by(
            event_id=self.id,
            user_id=user_id,
            status='registered'
        ).first()
        
        if participant:
            participant.status = 'cancelled'
            self.current_participants -= 1
            db.session.commit()

    def is_participant(self, user_id):
        """Vérifie si un utilisateur est inscrit à l'événement."""
        return EventParticipant.query.filter_by(
            event_id=self.id,
            user_id=user_id,
            status='registered'
        ).first() is not None

    def is_full(self):
        """Vérifie si l'événement est complet."""
        return self.max_participants and self.current_participants >= self.max_participants

    def _validate_event(self):
        """Valide les informations de l'événement."""
        if not all([self.title, self.description, self.start_time, self.end_time]):
            return False
        if self.start_time >= self.end_time:
            return False
        if self.registration_deadline and self.registration_deadline > self.start_time:
            return False
        return True

    @classmethod
    def get_upcoming_events(cls, limit=10):
        """Récupère les prochains événements."""
        return cls.query.filter(
            and_(
                cls.status == 'published',
                cls.start_time > datetime.utcnow()
            )
        ).order_by(cls.start_time).limit(limit).all()

    @classmethod
    def search(cls, filters=None, sort_by='start_time', page=1, per_page=20):
        """Recherche avancée d'événements."""
        query = cls.query.filter_by(status='published')

        if filters:
            if 'type' in filters:
                query = query.filter(cls.type == filters['type'])
            if 'category' in filters:
                query = query.filter(cls.category == filters['category'])
            if 'date_from' in filters:
                query = query.filter(cls.start_time >= filters['date_from'])
            if 'date_to' in filters:
                query = query.filter(cls.start_time <= filters['date_to'])
            if 'location_type' in filters:
                query = query.filter(cls.location_type == filters['location_type'])
            if 'search' in filters:
                search = f"%{filters['search']}%"
                query = query.filter(or_(
                    cls.title.ilike(search),
                    cls.description.ilike(search)
                ))

        if sort_by == 'participants':
            query = query.order_by(cls.current_participants.desc())
        else:  # default: start_time
            query = query.order_by(cls.start_time)

        return query.paginate(page=page, per_page=per_page, error_out=False)

    def to_dict(self, include_participants=False):
        """Convertit l'événement en dictionnaire pour l'API."""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'location': self.location,
            'location_type': self.location_type,
            'virtual_meeting_url': self.virtual_meeting_url if self.status == 'published' else None,
            'type': self.type,
            'category': self.category,
            'max_participants': self.max_participants,
            'current_participants': self.current_participants,
            'is_private': self.is_private,
            'registration_deadline': self.registration_deadline.isoformat() if self.registration_deadline else None,
            'status': self.status,
            'cover_image_url': self.cover_image_url,
            'agenda': self.agenda,
            'prerequisites': self.prerequisites,
            'tags': self.tags,
            'organizer': {
                'id': self.organizer_id,
                'name': self.organizer.profile.full_name if self.organizer.profile else None
            },
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_participants:
            data['participants'] = [
                {
                    'id': p.user_id,
                    'name': p.user.profile.full_name if p.user.profile else None,
                    'status': p.status,
                    'registration_type': p.registration_type,
                    'registered_at': p.registered_at.isoformat()
                }
                for p in self.participants.filter_by(status='registered').all()
            ]
            
        return data