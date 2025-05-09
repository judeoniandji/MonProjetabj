from app import db

# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.profile import Profile
from app.models.job import Job
from app.models.application import Application
from app.models.message import Message
from app.models.event import Event
from app.models.event_participant import EventParticipant
from app.models.skill import Skill
from app.models.discussion_group import DiscussionGroup, GroupMessage, MessageReaction

# Make models available at package level
__all__ = [
    'User',
    'Profile',
    'Job',
    'Application',
    'Message',
    'Event',
    'EventParticipant',
    'Skill',
    'DiscussionGroup',
    'GroupMessage',
    'MessageReaction'
]
