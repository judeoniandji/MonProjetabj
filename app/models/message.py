from datetime import datetime
from app import db

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True, index=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True, index=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    subject = db.Column(db.String(200))
    attachment_url = db.Column(db.String(500))
    is_deleted_by_sender = db.Column(db.Boolean, default=False)
    is_deleted_by_recipient = db.Column(db.Boolean, default=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=True)
    
    # Relations
    sender = db.relationship('User', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy='dynamic'))
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref=db.backref('received_messages', lazy='dynamic'))
    replies = db.relationship('Message', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    def mark_as_read(self):
        """Marque le message comme lu."""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()
            db.session.commit()

    def soft_delete(self, user_id):
        """Suppression douce du message pour un utilisateur."""
        if user_id == self.sender_id:
            self.is_deleted_by_sender = True
        elif user_id == self.recipient_id:
            self.is_deleted_by_recipient = True
        db.session.commit()

    @property
    def is_completely_deleted(self):
        """Vérifie si le message est supprimé par les deux parties."""
        return self.is_deleted_by_sender and self.is_deleted_by_recipient

    def can_view(self, user_id):
        """Vérifie si l'utilisateur peut voir le message."""
        if user_id == self.sender_id and not self.is_deleted_by_sender:
            return True
        if user_id == self.recipient_id and not self.is_deleted_by_recipient:
            return True
        return False

    @classmethod
    def get_conversation(cls, user1_id, user2_id, page=1, per_page=20):
        """Récupère la conversation entre deux utilisateurs."""
        return cls.query.filter(
            ((cls.sender_id == user1_id) & (cls.recipient_id == user2_id) & ~cls.is_deleted_by_sender) |
            ((cls.sender_id == user2_id) & (cls.recipient_id == user1_id) & ~cls.is_deleted_by_recipient)
        ).order_by(cls.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    @classmethod
    def get_unread_count(cls, user_id):
        """Compte les messages non lus pour un utilisateur."""
        return cls.query.filter_by(
            recipient_id=user_id,
            is_read=False,
            is_deleted_by_recipient=False
        ).count()

    def to_dict(self):
        """Convertit le message en dictionnaire pour l'API."""
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'content': self.content,
            'subject': self.subject,
            'created_at': self.created_at.isoformat(),
            'is_read': self.is_read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'attachment_url': self.attachment_url,
            'parent_id': self.parent_id,
            'has_replies': self.replies.count() > 0
        }