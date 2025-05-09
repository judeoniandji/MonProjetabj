from datetime import datetime
from app import db

# Table d'association pour les membres des groupes
group_members = db.Table('group_members',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('discussion_group.id', ondelete='CASCADE'), primary_key=True),
    db.Column('joined_at', db.DateTime, default=datetime.utcnow),
    db.Column('is_admin', db.Boolean, default=False),
    db.Column('notification_preference', db.String(20), default='all')  # all, mentions, none
)

class DiscussionGroup(db.Model):
    """Modèle pour les groupes de discussion thématiques."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    topic = db.Column(db.String(50), nullable=False, index=True)  # Domaine d'étude ou secteur
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_private = db.Column(db.Boolean, default=False)
    access_code = db.Column(db.String(20))  # Code d'accès pour les groupes privés
    banner_image_url = db.Column(db.String(255))
    icon_url = db.Column(db.String(255))
    max_members = db.Column(db.Integer, default=500)
    is_official = db.Column(db.Boolean, default=False)  # Groupe officiel créé par une université ou entreprise
    
    # Relations
    creator = db.relationship('User', backref='created_groups')
    members = db.relationship('User', secondary=group_members, 
                             backref=db.backref('joined_groups', lazy='dynamic'))
    messages = db.relationship('GroupMessage', backref='group', lazy='dynamic', 
                              cascade='all, delete-orphan')
    
    def is_member(self, user_id):
        """Vérifie si un utilisateur est membre du groupe."""
        return db.session.query(group_members).filter_by(
            user_id=user_id, group_id=self.id).first() is not None
    
    def is_admin(self, user_id):
        """Vérifie si un utilisateur est administrateur du groupe."""
        membership = db.session.query(group_members).filter_by(
            user_id=user_id, group_id=self.id).first()
        return membership is not None and membership.is_admin
    
    def add_member(self, user_id, is_admin=False):
        """Ajoute un utilisateur au groupe."""
        if not self.is_member(user_id):
            db.session.execute(group_members.insert().values(
                user_id=user_id,
                group_id=self.id,
                joined_at=datetime.utcnow(),
                is_admin=is_admin
            ))
            db.session.commit()
            return True
        return False
    
    def remove_member(self, user_id):
        """Retire un utilisateur du groupe."""
        if self.is_member(user_id):
            db.session.execute(group_members.delete().where(
                (group_members.c.user_id == user_id) & 
                (group_members.c.group_id == self.id)
            ))
            db.session.commit()
            return True
        return False
    
    def get_members_count(self):
        """Retourne le nombre de membres du groupe."""
        return db.session.query(group_members).filter_by(group_id=self.id).count()
    
    def get_recent_messages(self, limit=20):
        """Récupère les messages récents du groupe."""
        return self.messages.order_by(GroupMessage.created_at.desc()).limit(limit).all()
    
    def to_dict(self):
        """Convertit le groupe en dictionnaire pour l'API."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'topic': self.topic,
            'created_by_id': self.created_by_id,
            'created_at': self.created_at.isoformat(),
            'is_private': self.is_private,
            'banner_image_url': self.banner_image_url,
            'icon_url': self.icon_url,
            'members_count': self.get_members_count(),
            'is_official': self.is_official
        }

class GroupMessage(db.Model):
    """Modèle pour les messages dans les groupes de discussion."""
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('discussion_group.id', ondelete='CASCADE'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    attachment_url = db.Column(db.String(500))
    is_pinned = db.Column(db.Boolean, default=False)
    is_announcement = db.Column(db.Boolean, default=False)
    edited_at = db.Column(db.DateTime)
    
    # Relations
    sender = db.relationship('User', backref='group_messages')
    reactions = db.relationship('MessageReaction', backref='message', lazy='dynamic',
                               cascade='all, delete-orphan')
    
    def add_reaction(self, user_id, reaction_type):
        """Ajoute une réaction à un message."""
        existing = MessageReaction.query.filter_by(
            message_id=self.id, user_id=user_id).first()
        
        if existing:
            existing.reaction_type = reaction_type
        else:
            reaction = MessageReaction(
                message_id=self.id,
                user_id=user_id,
                reaction_type=reaction_type
            )
            db.session.add(reaction)
        
        db.session.commit()
    
    def remove_reaction(self, user_id):
        """Supprime une réaction d'un message."""
        reaction = MessageReaction.query.filter_by(
            message_id=self.id, user_id=user_id).first()
        
        if reaction:
            db.session.delete(reaction)
            db.session.commit()
            return True
        return False
    
    def to_dict(self):
        """Convertit le message en dictionnaire pour l'API."""
        return {
            'id': self.id,
            'group_id': self.group_id,
            'sender_id': self.sender_id,
            'sender_name': self.sender.profile.full_name if self.sender and self.sender.profile else "Utilisateur supprimé",
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'attachment_url': self.attachment_url,
            'is_pinned': self.is_pinned,
            'is_announcement': self.is_announcement,
            'edited_at': self.edited_at.isoformat() if self.edited_at else None,
            'reactions': {r.reaction_type: r.count for r in self.get_reaction_counts()}
        }
    
    def get_reaction_counts(self):
        """Compte les réactions par type."""
        from sqlalchemy import func
        return db.session.query(
            MessageReaction.reaction_type,
            func.count(MessageReaction.id).label('count')
        ).filter(MessageReaction.message_id == self.id).group_by(
            MessageReaction.reaction_type
        ).all()

class MessageReaction(db.Model):
    """Modèle pour les réactions aux messages."""
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('group_message.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    reaction_type = db.Column(db.String(20), nullable=False)  # like, love, laugh, wow, sad, angry
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Contrainte d'unicité pour éviter les doublons
    __table_args__ = (
        db.UniqueConstraint('message_id', 'user_id', name='unique_message_reaction'),
    )
